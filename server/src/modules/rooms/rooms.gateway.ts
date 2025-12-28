import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { RedisService } from '../../services/redis.service'; // Импортируем RedisService
import { RoomsService } from './rooms.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class RoomsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly roomsService: RoomsService,
    private readonly redisService: RedisService, // Инжектируем RedisService
  ) {}

  afterInit() {
    void this.redisService.subscribeToRoomUpdates(() => {
      void this.broadcastRoomsUpdate();
    });
  }

  async handleConnection(client: Socket) {
    const rooms = await this.roomsService.getRooms();
    client.emit('rooms', { action: 'initial', rooms });
  }

  handleDisconnect() {
    // Можно добавить логику при отключении клиента
  }

  @SubscribeMessage('request_rooms')
  async handleRequestRooms(client: Socket) {
    const rooms = await this.roomsService.getRooms();
    client.emit('rooms', { action: 'initial', rooms });
  }

  // Метод для рассылки обновленного списка комнат всем клиентам
  async broadcastRoomsUpdate() {
    const rooms = await this.roomsService.getRooms();
    this.server.emit('rooms', { action: 'update', rooms });
  }
}
