import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EventAggregator {
  aggregate(event: Record<string, unknown>) {
    return {
      ...event,
      id: event['id'] ?? uuid(),
      processedAt: new Date().toISOString()
    };
  }
}
