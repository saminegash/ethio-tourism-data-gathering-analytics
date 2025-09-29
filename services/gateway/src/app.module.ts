import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import configuration from './config/configuration';
import { HealthController } from './health/health.controller';
import { ProxyController } from './routes/proxy.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    HttpModule
  ],
  controllers: [HealthController, ProxyController]
})
export class AppModule {}
