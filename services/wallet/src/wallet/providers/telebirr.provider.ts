import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { TopUpRequest, PaymentProvider } from './payment-provider.interface';

@Injectable()
export class TelebirrProvider implements PaymentProvider {
  readonly key = 'telebirr';
  private readonly logger = new Logger(TelebirrProvider.name);

  async initiateTopUp(request: TopUpRequest) {
    if (!process.env.TELEBIRR_API_URL) {
      this.logger.warn('Telebirr API not configured, simulating top up');
      return;
    }

    await axios.post(
      `${process.env.TELEBIRR_API_URL}/topups`,
      {
        wristbandId: request.wristbandId,
        amount: request.amount,
        reference: request.reference
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TELEBIRR_API_KEY}`
        }
      }
    );
  }
}
