import { Injectable, Logger } from '@nestjs/common';
import { PaymentProvider, TopUpRequest } from './payment-provider.interface';

@Injectable()
export class MockPspProvider implements PaymentProvider {
  readonly key = 'mock';
  private readonly logger = new Logger(MockPspProvider.name);

  async initiateTopUp(request: TopUpRequest) {
    this.logger.log(`Mock top up processed for ${request.wristbandId}`);
  }
}
