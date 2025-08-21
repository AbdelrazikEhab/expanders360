import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNumber()
  clientId: number;

  @IsString()
  country: string;

  @IsArray()
  services_needed: string[];

  @IsOptional()
  @IsNumber()
  budget?: number;
}
