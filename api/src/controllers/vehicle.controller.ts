import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto/vehicle.dto';
import { Vehicle } from '../entities/vehicle.entity';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({
    status: 201,
    description: 'The vehicle has been successfully created.',
    type: Vehicle,
  })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({
    status: 200,
    description: 'Return all vehicles.',
    type: [Vehicle],
  })
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the vehicle.',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiResponse({
    status: 200,
    description: 'The vehicle has been successfully updated.',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleService.update(+id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiResponse({
    status: 200,
    description: 'The vehicle has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(+id);
  }
}
