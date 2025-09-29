import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ClickhouseSink {
  private readonly logger = new Logger(ClickhouseSink.name);

  async write(event: Record<string, unknown>) {
    this.logger.debug(`Writing event ${event['id']} to ClickHouse`);
  }
}
