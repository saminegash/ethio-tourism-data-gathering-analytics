import { Injectable } from '@nestjs/common';

@Injectable()
export class StreamHealthService {
  private lastHeartbeat = new Date();

  recordHeartbeat() {
    this.lastHeartbeat = new Date();
  }

  get status() {
    return {
      lastHeartbeat: this.lastHeartbeat.toISOString(),
      healthy: Date.now() - this.lastHeartbeat.getTime() < 60_000
    };
  }
}
