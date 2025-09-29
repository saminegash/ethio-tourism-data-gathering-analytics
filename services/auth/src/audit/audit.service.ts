import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  record(event: { actorId: string; action: string; metadata?: unknown }) {
    this.logger.log(
      `Audit: ${event.action} by ${event.actorId} :: ${JSON.stringify(
        event.metadata ?? {}
      )}`
    );
  }
}
