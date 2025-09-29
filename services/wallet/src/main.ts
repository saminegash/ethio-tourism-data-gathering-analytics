import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const kafkaBrokers = (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',');

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'wallet-service',
        brokers: kafkaBrokers
      },
      consumer: {
        groupId: 'wallet-service-consumer'
      }
    }
  });

  await app.startAllMicroservices();

  const port = Number.parseInt(process.env.PORT ?? '3002', 10);
  await app.listen(port);

  Logger.log(`Wallet service running on ${await app.getUrl()}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  Logger.error(error, 'Bootstrap');
  process.exit(1);
});
