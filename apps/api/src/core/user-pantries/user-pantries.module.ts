import { Module } from '@nestjs/common';
import { UserPantriesService } from './user-pantries.service';
import { UserPantriesController } from './user-pantries.controller';

@Module({
  controllers: [UserPantriesController],
  providers: [UserPantriesService],
})
export class UserPantriesModule {}
