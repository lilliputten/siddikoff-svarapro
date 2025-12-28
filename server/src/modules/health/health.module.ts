import { Module } from '@nestjs/common';

import { RedisService } from '../../services/redis.service';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService, RedisService],
  exports: [HealthService],
})
export class HealthModule {}
