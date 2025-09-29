import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { TopUpRequest, PaymentProvider } from './payment-provider.interface';

@Injectable()
export class CoopayProvider implements PaymentProvider {
  readonly key = 'coopay';
  private readonly logger = new Logger(CoopayProvider.name);

  async initiateTopUp(request: TopUpRequest) {
    if (!process.env.COOPAY_API_URL) {
      this.logger.warn('Coopay API not configured, simulating top up');
      return;
    }

    await axios.post(
      `${process.env.COOPAY_API_URL}/wallet/topup`,
      {
        id: request.wristbandId,
        amount: request.amount,
        reference: request.reference
      },
      {
        headers: {
          'X-API-KEY': process.env.COOPAY_API_KEY ?? ''
        }
      }
    );
  }
}
