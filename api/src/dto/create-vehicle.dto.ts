import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
