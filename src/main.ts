import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: '*',
    credentials: true
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      forbidUnknownValues: false,
      forbidNonWhitelisted: false,
      validationError: {
        target: true,
        value: true,
      },
    })
  )  
  
  app.use(cookieParser());

  app.useGlobalFilters(new HttpExceptionFilter())

  const logger = new Logger('Main')

  setupSwagger(app)

  await app.listen(AppModule.port)

  // log docs
  const baseUrl = AppModule.getBaseUrl(app)
  const url = `http://${baseUrl}:${AppModule.port}`
  logger.log(`API Documentation available at ${url}`);
}
bootstrap();
