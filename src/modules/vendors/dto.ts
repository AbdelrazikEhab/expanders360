import { IsArray, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  name: string;

  @IsArray()
  countries_supported: string[];

  @IsArray()
  services_offered: string[];

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsInt()
  response_sla_hours?: number;
}
