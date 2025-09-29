import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { TopUpRequest, PaymentProvider } from './payment-provider.interface';

@Injectable()
export class CbeBirrProvider implements PaymentProvider {
  readonly key = 'cbe-birr';
  private readonly logger = new Logger(CbeBirrProvider.name);

  async initiateTopUp(request: TopUpRequest) {
    if (!process.env.CBE_BIRR_API_URL) {
      this.logger.warn('CBE Birr API not configured, simulating top up');
      return;
    }

    await axios.post(`${process.env.CBE_BIRR_API_URL}/v1/topup`, request, {
      headers: {
        Authorization: `Bearer ${process.env.CBE_BIRR_API_KEY ?? ''}`
      }
    });
  }
}
