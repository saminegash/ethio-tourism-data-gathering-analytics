import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { HealthController } from './health/health.controller';
import { TelemetryController } from './telemetry/telemetry.controller';
import { EventValidator } from './telemetry/processors/event-validator';
import { StreamProcessor } from './telemetry/processors/stream-processor';
import { EventAggregator } from './telemetry/processors/aggregator';
import { ClickhouseSink } from './telemetry/sinks/clickhouse-sink';
import { PostgresSink } from './telemetry/sinks/postgres-sink';
import { StreamHealthService } from './telemetry/monitoring/stream-health';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    })
  ],
  controllers: [HealthController, TelemetryController],
  providers: [
    EventValidator,
    StreamProcessor,
    EventAggregator,
    ClickhouseSink,
    PostgresSink,
    StreamHealthService
  ]
})
export class AppModule {}
