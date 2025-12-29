/* eslint-disable no-console */

import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { GameAction, GameState, Room } from '../types/game';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    const REDIS_HOST = process.env.REDIS_HOST;
    const REDIS_PORT = process.env.REDIS_PORT;

    this.client = new Redis({
      host: REDIS_HOST || 'redis',
      port: parseInt(REDIS_PORT || '6379', 10),
      maxRetriesPerRequest: 3,
      connectTimeout: 10000,
      commandTimeout: 5000,
      lazyConnect: true,
    });

    // Обработка ошибок подключения
    this.client.on('error', (error) => {
      // prettier-ignore
      console.error('[server/src/services/redis.service.ts] Redis connection error:', error);
      debugger; // eslint-disable-line no-debugger
    });

    this.client.on('connect', () => {
      // prettier-ignore
      console.log('[server/src/services/redis.service.ts] Redis connected successfully');
    });

    this.client.on('ready', () => {
      // prettier-ignore
      console.log('[server/src/services/redis.service.ts] Redis is ready');
    });
  }

  // Утилита для retry логики
  private async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 100,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.warn(
          `Redis operation failed (attempt ${attempt}/${maxRetries}):`,
          error,
        );

        if (attempt < maxRetries) {
          // Экспоненциальная задержка
          const waitTime = delay * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }

    throw lastError!;
  }

  async setRoom(roomId: string, room: Room): Promise<void> {
    await this.withRetry(async () => {
      await this.client.set(`rooms:${roomId}`, JSON.stringify(room));
    });
  }

  async getRoom(roomId: string): Promise<Room | null> {
    return await this.withRetry(async () => {
      const roomData = await this.client.get(`rooms:${roomId}`);
      if (!roomData) {
        return null;
      }
      return JSON.parse(roomData) as Room;
    });
  }

  async addToActiveRooms(roomId: string): Promise<void> {
    await this.withRetry(async () => {
      await this.client.sadd('active_rooms', roomId);
    });
  }

  async getActiveRooms(): Promise<string[]> {
    return await this.withRetry(async () => {
      return this.client.smembers('active_rooms');
    });
  }

  async removeRoom(roomId: string): Promise<void> {
    await this.withRetry(async () => {
      await this.client.del(`rooms:${roomId}`);
      await this.client.srem('active_rooms', roomId);
    });
  }

  async ping(): Promise<string> {
    return await this.withRetry(async () => {
      return await this.client.ping();
    });
  }

  async publishRoomUpdate(roomId: string, room: Room | null): Promise<void> {
    await this.withRetry(async () => {
      if (room === null) {
        // Уведомляем об удалении комнаты
        await this.client.publish(
          `room:${roomId}`,
          JSON.stringify({ deleted: true }),
        );
        await this.client.publish(
          'rooms',
          JSON.stringify({ action: 'delete', roomId }),
        );
      } else {
        await this.client.publish(`room:${roomId}`, JSON.stringify(room));
        if (room.type === 'public') {
          await this.client.publish(
            'rooms',
            JSON.stringify({ action: 'update', room }),
          );
        }
      }
    });
  }

  async isRoomIdUnique(roomId: string): Promise<boolean> {
    return await this.withRetry(async () => {
      const exists = await this.client.sismember('active_rooms', roomId);
      return !exists;
    });
  }

  async subscribeToRoomUpdates(
    callback: (data: { action: string; roomId?: string; room?: Room }) => void,
  ): Promise<void> {
    const subClient = this.client.duplicate();
    // prettier-ignore
    console.log('[server/src/services/redis.service.ts] subscribe:rooms:start', {
      options: subClient.options,
    });
    await subClient.subscribe('rooms');
    // prettier-ignore
    console.log('[server/src/services/redis.service.ts] subscribe:rooms:success', {
      options: subClient.options,
    });

    subClient.on('message', (channel, message) => {
      if (channel === 'rooms') {
        try {
          const data = JSON.parse(message) as {
            action: string;
            roomId?: string;
            room?: Room;
          };
          if (data && data.action) {
            callback(data);
          }
        } catch (error) {
          console.error('Error parsing room update message:', error);
        }
      }
    });
  }

  async setGameState(roomId: string, gameState: GameState): Promise<void> {
    await this.withRetry(async () => {
      await this.client.set(`game:${roomId}`, JSON.stringify(gameState));
    });
  }

  async getGameState(roomId: string): Promise<GameState | null> {
    return await this.withRetry(async () => {
      const gameData = await this.client.get(`game:${roomId}`);
      if (!gameData) {
        return null;
      }
      try {
        const gameState = JSON.parse(gameData) as GameState;
        return gameState;
      } catch (error) {
        console.error('Error parsing game state:', error);
        return null;
      }
    });
  }

  async publishGameUpdate(roomId: string, gameState: GameState): Promise<void> {
    await this.withRetry(async () => {
      await this.client.publish(`game:${roomId}`, JSON.stringify(gameState));
    });
  }

  async publishBalanceUpdate(
    telegramId: string,
    balance: number,
  ): Promise<void> {
    await this.withRetry(async () => {
      await this.client.publish(
        `balance:${telegramId}`,
        JSON.stringify({ balance: balance.toFixed(2) }),
      );
    });
  }

  async subscribeToGameUpdates(
    callback: (roomId: string, gameState: GameState) => void,
  ): Promise<void> {
    const subClient = this.client.duplicate();
    await subClient.psubscribe('game:*');

    subClient.on('pmessage', (pattern, channel, message) => {
      if (pattern === 'game:*') {
        try {
          const roomId = channel.split(':')[1];
          const gameState = JSON.parse(message) as GameState;
          callback(roomId, gameState);
        } catch (error) {
          console.error('Error parsing game update message:', error);
        }
      }
    });
  }

  async subscribeToBalanceUpdates(
    callback: (telegramId: string, balance: string) => void,
  ): Promise<void> {
    const subClient = this.client.duplicate();
    await subClient.psubscribe('balance:*');

    subClient.on('pmessage', (pattern, channel, message) => {
      if (pattern === 'balance:*') {
        try {
          const telegramId = channel.split(':')[1];
          const data = JSON.parse(message) as { balance: string };
          callback(telegramId, data.balance);
        } catch (error) {
          console.error('Error parsing balance update message:', error);
        }
      }
    });
  }

  async addPlayerToRoom(roomId: string, playerId: string): Promise<void> {
    await this.withRetry(async () => {
      await this.client.sadd(`room_players:${roomId}`, playerId);
      await this.client.sadd(`player_rooms:${playerId}`, roomId);
    });
  }

  async removePlayerFromRoom(roomId: string, playerId: string): Promise<void> {
    await this.withRetry(async () => {
      await this.client.srem(`room_players:${roomId}`, playerId);
      await this.client.srem(`player_rooms:${playerId}`, roomId);
    });
  }

  async getPlayersInRoom(roomId: string): Promise<string[]> {
    return await this.withRetry(async () => {
      return this.client.smembers(`room_players:${roomId}`);
    });
  }

  async getPlayerRooms(playerId: string): Promise<string[]> {
    return await this.withRetry(async () => {
      return this.client.smembers(`player_rooms:${playerId}`);
    });
  }

  async addGameAction(roomId: string, action: GameAction): Promise<void> {
    await this.withRetry(async () => {
      await this.client.rpush(`game_log:${roomId}`, JSON.stringify(action));
    });
  }

  async getGameActions(roomId: string): Promise<GameAction[]> {
    return await this.withRetry(async () => {
      const actions = await this.client.lrange(`game_log:${roomId}`, 0, -1);
      return actions.map((action) => JSON.parse(action) as GameAction);
    });
  }

  async clearGameData(roomId: string): Promise<void> {
    await this.withRetry(async () => {
      await this.client.del(`game:${roomId}`);
      await this.client.del(`game_log:${roomId}`);
    });
  }

  async cleanupDeadPlayers(): Promise<void> {
    try {
      // Получаем все активные комнаты
      const activeRooms = await this.getActiveRooms();

      for (const roomId of activeRooms) {
        try {
          const room = await this.getRoom(roomId);
          if (!room) {
            // Комната не найдена, удаляем из активных
            await this.client.srem('active_rooms', roomId);
            continue;
          }

          const gameState = await this.getGameState(roomId);
          if (gameState) {
            // Проверяем, есть ли игроки в gameState, но нет в room.players
            const gamePlayerIds = gameState.players.map((p) => p.id);
            const roomPlayerIds = room.players;

            // Находим "мертвых" игроков (есть в gameState, но нет в room.players)
            const deadPlayers = gamePlayerIds.filter(
              (id) => !roomPlayerIds.includes(id),
            );

            if (deadPlayers.length > 0) {
              // Удаляем мертвых игроков из gameState
              gameState.players = gameState.players.filter(
                (p) => !deadPlayers.includes(p.id),
              );

              // Сохраняем обновленное состояние
              await this.setGameState(roomId, gameState);
              await this.publishGameUpdate(roomId, gameState);

              // Если комната пуста, удаляем её
              if (gameState.players.length === 0) {
                await this.removeRoom(roomId);
                await this.clearGameData(roomId);
              }
            }
          }
        } catch (error) {
          console.error(`Error cleaning up room ${roomId}:`, error);
        }
      }
    } catch (error) {
      console.error('Error during cleanup of dead players:', error);
    }
  }

  // Метод для проверки здоровья Redis
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }
}
