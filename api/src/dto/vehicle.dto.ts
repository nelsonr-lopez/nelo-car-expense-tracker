import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Length } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ description: 'The make of the vehicle' })
  @IsString()
  @IsNotEmpty()
  make: string;

  @ApiProperty({ description: 'The model of the vehicle' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ description: 'The year of the vehicle' })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ description: 'The license plate number of the vehicle' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  licensePlate: string;

  @ApiProperty({
    description: 'The VIN (Vehicle Identification Number) of the vehicle',
  })
  @IsString()
  @IsNotEmpty()
  @Length(17, 17)
  vin: string;
}

export class UpdateVehicleDto extends CreateVehicleDto {}
