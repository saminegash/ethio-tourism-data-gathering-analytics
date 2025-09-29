import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OfflineBatchProcessor {
  private readonly logger = new Logger(OfflineBatchProcessor.name);
  private readonly queue: any[] = [];

  queueOfflineDebit(event: Record<string, unknown>) {
    this.logger.debug(`Queueing offline debit ${JSON.stringify(event)}`);
    this.queue.push({ ...event, queuedAt: new Date().toISOString() });
  }

  drain() {
    const drained = [...this.queue];
    this.queue.length = 0;
    return drained;
  }
}
