import { createHmac } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionSigningService {
  signTopUpRequest(payload: Record<string, unknown>) {
    const secret = process.env.WALLET_SIGNING_SECRET ?? 'change-me';
    const signature = createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return {
      ...payload,
      signature
    };
  }
}
