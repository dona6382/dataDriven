import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './responseInterceptor';

// .env 파일 로드
dotenv.config();

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Helmet 설정 (보안)
  app.use(helmet());

  // CORS 설정
  app.enableCors();

  // Morgan 설정 (HTTP 요청 로깅)
  app.use(morgan('combined'));

  // Body Parser 설정 (요청 본문 파싱)
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Compression 설정 (응답 본문 압축)
  app.use(compression());

  app.setGlobalPrefix('api');

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('dataServer API 문서')
    .setDescription('dataServer API doc with nestJS.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // 인터셉터
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 애플리케이션 실행
  const port = process.env.PORT || 5001;
  await app.listen(port, () => {
    console.log(`Data server Application is running port : ${port}`);
  });
}

bootstrap();
