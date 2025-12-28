import { Module } from '@nestjs/common';

import { RedisService } from '../../services/redis.service';
import { FinancesModule } from '../finances/finances.module';
import { UsersModule } from '../users/users.module';
import { GameGateway } from './game.gateway';
import { BettingService } from './services/betting.service';
import { CardService } from './services/card.service';
import { GameStateService } from './services/game-state.service';
import { GameService } from './services/game.service';
import { PlayerService } from './services/player.service';

@Module({
  imports: [UsersModule, FinancesModule],
  providers: [
    //  Основной сервис (монолитная архитектура)
    GameService,

    // Вспомогательные сервисы
    CardService,
    PlayerService,
    BettingService,
    GameStateService,

    // Инфраструктурные сервисы
    GameGateway,
    RedisService,
  ],
  exports: [GameService, GameStateService],
})
export class GameModule {}
