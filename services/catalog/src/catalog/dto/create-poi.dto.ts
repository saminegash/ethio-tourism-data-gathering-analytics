import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePoiDto {
  @IsString()
  destinationId!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
