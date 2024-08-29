import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ProductDetailsModule} from './product-details/product-details.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // - DB 종류
      database: 'product.db', // - DB 파일 이름
      autoLoadEntities: true, // - 구동시 entity파일 자동 로드
      synchronize: true, // - 서비스 구동시 entity와 디비의 테이블 싱크 개발만 할것
      logging: true, // - orm 사용시 로그 남기기
      // dropSchema: true, // - 구동시 해당 테이블 삭제 synchronize와 동시 사용
    }),
    ProductDetailsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
