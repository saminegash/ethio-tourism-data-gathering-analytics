import { Injectable } from '@nestjs/common';
import {
  PaymentProvider,
  PaymentProviderKey
} from './payment-provider.interface';
import { TelebirrProvider } from './telebirr.provider';
import { CoopayProvider } from './coopay.provider';
import { CbeBirrProvider } from './cbe-birr.provider';
import { VisaMastercardProvider } from './visa-mastercard.provider';
import { MockPspProvider } from './mock-psp.provider';

@Injectable()
export class PaymentProviderRegistry {
  private readonly providers = new Map<PaymentProviderKey, PaymentProvider>();

  constructor(
    telebirr: TelebirrProvider,
    coopay: CoopayProvider,
    cbeBirr: CbeBirrProvider,
    visaMastercard: VisaMastercardProvider,
    mock: MockPspProvider
  ) {
    [telebirr, coopay, cbeBirr, visaMastercard, mock].forEach((provider) => {
      this.providers.set(provider.key, provider);
    });
  }

  getProvider(key: PaymentProviderKey): PaymentProvider {
    const provider = this.providers.get(key);
    if (!provider) {
      throw new Error(`Payment provider ${key} not registered`);
    }
    return provider;
  }
}
