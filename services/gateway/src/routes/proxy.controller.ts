import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Controller('proxy')
export class ProxyController {
  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService
  ) {}

  @Get(':service/health')
  async proxyHealth(@Param('service') service: string) {
    const target = this.configService.get<string>(`services.${service}`);
    if (!target) {
      return {
        status: 'unknown-service',
        service
      };
    }

    const response = await this.http.axiosRef.get(`${target}/health`).catch(() => ({
      data: { status: 'unreachable' }
    }));

    return {
      upstream: service,
      target,
      payload: response.data
    };
  }
}
