import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from '../log/console.logger.module';
import { ConsoleLogger } from '../log/console.logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from '../log/entities/logger.entity';
import { NetworkService } from '../network/network.service';
import { CollectProductDetailsService } from './product/product-details/collect-product-details.service';
import { TransformProductDetailsService } from './product/product-details/transform-product-details.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      entities: [Log],
      synchronize: true,
      database: 'tb_prod.db',
      logging: false,
    }),
    TypeOrmModule.forFeature([Log]),
    LoggerModule,
  ],
  providers: [
    BatchService,
    { provide: 'Logger', useClass: ConsoleLogger },
    NetworkService,
    CollectProductDetailsService,
    TransformProductDetailsService,
  ],
})
export class BatchModule {}
