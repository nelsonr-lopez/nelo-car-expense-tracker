import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { Vehicle } from '../entities/vehicle.entity';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  make: string;

  @ApiProperty({ example: 'Camry' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 2020 })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: 'ABC123' })
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ example: '1HGCM82633A123456' })
  @IsString()
  @IsOptional()
  vin?: string;

  @ApiProperty({ example: 'Company sedan - Sales team' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateVehicleDto extends CreateVehicleDto {}

export class VehicleListResponseDto {
  @ApiProperty({ type: [Vehicle] })
  vehicles: Vehicle[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  total: number;
}
