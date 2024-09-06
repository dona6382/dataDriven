import { Module } from '@nestjs/common';
import { ConsoleLogger } from './console.logger.service';
import { Log } from './entities/logger.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [ConsoleLogger],
  exports: [ConsoleLogger],
})
export class LoggerModule {}
