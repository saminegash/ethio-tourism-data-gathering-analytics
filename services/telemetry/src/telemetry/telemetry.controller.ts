import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { StreamProcessor } from './processors/stream-processor'
import { StreamHealthService } from './monitoring/stream-health'

@Controller()
export class TelemetryController {
  private readonly logger = new Logger(TelemetryController.name);

  constructor(
    private readonly processor: StreamProcessor,
    private readonly health: StreamHealthService
  ) {}

  @EventPattern('tourism.telemetry')
  async handleEvent(@Payload() message: any) {
    this.logger.debug(`Received telemetry event ${JSON.stringify(message)}`);
    await this.processor.process(message);
    this.health.recordHeartbeat();
  }
}
