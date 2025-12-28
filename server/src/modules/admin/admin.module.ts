import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Room } from '../../entities/rooms.entity';
import { Transaction } from '../../entities/transactions.entity';
import { User } from '../../entities/user.entity';
import { AdminController } from './admin.controller';
import { AdminApiGuard } from './admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction, Room])],
  controllers: [AdminController],
  providers: [AdminApiGuard],
})
export class AdminModule {}
