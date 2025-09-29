import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EventValidator {
  private readonly logger = new Logger(EventValidator.name);

  validate(event: Record<string, unknown>) {
    if (!event['event_name']) {
      this.logger.warn('Telemetry event missing event_name');
      return false;
    }
    return true;
  }
}
