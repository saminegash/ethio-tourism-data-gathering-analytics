import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const kafkaBrokers = (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'telemetry-service',
        brokers: kafkaBrokers
      },
      consumer: {
        groupId: 'telemetry-processor'
      }
    }
  });

  await app.startAllMicroservices();

  const port = Number.parseInt(process.env.PORT ?? '3004', 10);
  await app.listen(port);

  Logger.log(`Telemetry service running on ${await app.getUrl()}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  Logger.error(error, 'Bootstrap');
  process.exit(1);
});
