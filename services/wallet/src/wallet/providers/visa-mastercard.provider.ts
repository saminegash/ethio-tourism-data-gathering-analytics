import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { TopUpRequest, PaymentProvider } from './payment-provider.interface';

@Injectable()
export class VisaMastercardProvider implements PaymentProvider {
  readonly key = 'visa-mastercard';
  private readonly logger = new Logger(VisaMastercardProvider.name);

  async initiateTopUp(request: TopUpRequest) {
    if (!process.env.CARD_PROCESSOR_API_URL) {
      this.logger.warn('Card processor API not configured, simulating top up');
      return;
    }

    await axios.post(
      `${process.env.CARD_PROCESSOR_API_URL}/charges`,
      {
        amount: request.amount,
        currency: 'ETB',
        metadata: { wristbandId: request.wristbandId }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CARD_PROCESSOR_API_KEY ?? ''}`
        }
      }
    );
  }
}
