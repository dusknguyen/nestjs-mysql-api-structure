/* eslint-disable no-console */
import { ValidationPipe, BadGatewayException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';

import { RedisIoAdapter } from './adapter';
import { middleware } from './app.middleware';
import { AppModule } from './app.module';

/**
 * https://docs.nestjs.com
 * https://github.com/nestjs/nest/tree/master/sample
 */
async function bootstrap(): Promise<void> {
  const isProduction = process.env.NODE_ENV === 'production';

  // Enable SWC if you have configured SWC in nest-cli.json
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    logger: isProduction
      ? WinstonModule.createLogger({
          level: 'info',
          format: winston.format.json(),
          transports: [
            new winston.transports.File({
              filename: 'logs/error.log',
              level: 'error',
            }),
            new winston.transports.File({
              filename: 'logs/query.log',
              level: 'query',
            }),
            new winston.transports.File({
              filename: 'logs/info.log',
              level: 'info',
            }),
            new winston.transports.Console({
              format: winston.format.combine(winston.format.colorize(), winston.format.json()),
            }),
          ],
        })
      : undefined,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => new BadGatewayException(validationErrors),
    }),
  );

  // Set API versioning
  app.setGlobalPrefix(`api/v${process.env['VERSION'] || '1'}`);

  if (isProduction) {
    app.enable('trust proxy');
  }

  // Redis Adapter with Wildcard Subscriptions
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Using Redis wildcard subscription for microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
      wildcards: true, // Enable wildcard subscriptions
    },
  });

  // Express Middleware
  middleware(app);
  /** Swagger configuration*/
  const options = new DocumentBuilder()
    .setTitle('LegendDao API')
    .setDescription('LegendDao API')
    .setVersion('1.0')
    .addBearerAuth()
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT || 3001);
}

console.log('PORT ENV ', process.env.PORT);
bootstrap()
  .then(() => console.log(`Bootstrap on port ${process.env.PORT || 3000}`, new Date().toLocaleString()))
  .catch(console.error);
