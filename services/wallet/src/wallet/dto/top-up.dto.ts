import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentProviderKey } from '../providers/payment-provider.interface';

const SUPPORTED_CURRENCIES = ['ETB'] as const;
const SUPPORTED_PROVIDERS: PaymentProviderKey[] = [
  'telebirr',
  'coopay',
  'cbe-birr',
  'visa-mastercard',
  'mock'
];

export class TopUpDto {
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsIn(SUPPORTED_CURRENCIES as unknown as string[])
  currency!: 'ETB';

  @IsIn(SUPPORTED_PROVIDERS as unknown as string[])
  provider!: PaymentProviderKey;

  @IsOptional()
  @IsString()
  reference?: string;
}
