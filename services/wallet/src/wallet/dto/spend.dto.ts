import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SpendDto {
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsOptional()
  @IsString()
  merchantId?: string;

  @IsOptional()
  @IsString()
  merchantName?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
