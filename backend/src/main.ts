/*import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filter/exception.filter';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // class validator 세팅
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app.use(cookieParser());

  // swagger 세팅
  const config = new DocumentBuilder()
    .setTitle('Eventory Server')
    .setDescription('Eventory API description')
    .setVersion('1.0')
    .addTag('Eventory')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
*/
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

// 추가된 import 문들
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/exception.filter';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // NestExpressApplication 타입 지정
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // class-validator 설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  // 전역 예외 필터 설정
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS 및 쿠키 파서 설정
  app.enableCors();
  app.use(cookieParser());

  // 정적 자산 제공 설정 추가
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Eventory Server')
    .setDescription('Eventory API description')
    .setVersion('1.0')
    .addTag('Eventory')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000; // 기본값은 3000
  await app.listen(port);
}
bootstrap();
