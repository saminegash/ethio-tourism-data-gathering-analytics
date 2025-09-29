import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  readiness() {
    return {
      status: 'ok',
      service: 'wallet',
      timestamp: new Date().toISOString()
    };
  }
}
