export type PaymentProviderKey =
  | 'telebirr'
  | 'coopay'
  | 'cbe-birr'
  | 'visa-mastercard'
  | 'mock';

export interface TopUpRequest {
  wristbandId: string;
  amount: number;
  provider: PaymentProviderKey;
  reference?: string;
}

export interface PaymentProvider {
  readonly key: PaymentProviderKey;
  initiateTopUp(request: TopUpRequest): Promise<void>;
}
