import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PostgresSink {
  private readonly logger = new Logger(PostgresSink.name);

  async write(event: Record<string, unknown>) {
    this.logger.debug(`Persisting event ${event['id']} to Postgres`);
  }
}
