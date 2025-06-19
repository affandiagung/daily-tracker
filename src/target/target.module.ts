import { Module } from '@nestjs/common';
import { TargetService } from './target.service';
import { TargetController } from './target.controller';

@Module({
  providers: [TargetService],
  controllers: [TargetController]
})
export class TargetModule {}
