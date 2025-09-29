import { IsOptional, IsString } from 'class-validator';

export class VerifyIdentityDto {
  @IsString()
  documentNumber!: string;

  @IsString()
  nationality!: string;

  @IsOptional()
  @IsString()
  wristbandId?: string;
}
