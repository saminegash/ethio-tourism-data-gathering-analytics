import { Injectable, Logger } from '@nestjs/common';
import { EventValidator } from './event-validator';
import { EventAggregator } from './aggregator';
import { ClickhouseSink } from '../sinks/clickhouse-sink';
import { PostgresSink } from '../sinks/postgres-sink';

@Injectable()
export class StreamProcessor {
  private readonly logger = new Logger(StreamProcessor.name);

  constructor(
    private readonly validator: EventValidator,
    private readonly aggregator: EventAggregator,
    private readonly clickhouseSink: ClickhouseSink,
    private readonly postgresSink: PostgresSink
  ) {}

  async process(event: Record<string, unknown>) {
    if (!this.validator.validate(event)) {
      this.logger.warn('Discarding invalid telemetry event');
      return;
    }

    const enriched = this.aggregator.aggregate(event);
    await Promise.all([
      this.clickhouseSink.write(enriched),
      this.postgresSink.write(enriched)
    ]);
  }
}
