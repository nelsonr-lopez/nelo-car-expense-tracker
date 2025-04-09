import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { VehiclesService } from "./vehicles.service";
import { Vehicle } from "../../entities/vehicle.entity";

@ApiTags("vehicles")
@Controller("vehicles")
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: "Get all vehicles" })
  @ApiResponse({ status: 200, description: "Return all vehicles." })
  findAll(): Promise<Vehicle[]> {
    return this.vehiclesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a vehicle by id" })
  @ApiResponse({ status: 200, description: "Return the vehicle." })
  @ApiResponse({ status: 404, description: "Vehicle not found." })
  findOne(@Param("id") id: string): Promise<Vehicle> {
    return this.vehiclesService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new vehicle" })
  @ApiResponse({
    status: 201,
    description: "The vehicle has been successfully created.",
  })
  create(@Body() vehicle: Partial<Vehicle>): Promise<Vehicle> {
    return this.vehiclesService.create(vehicle);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a vehicle" })
  @ApiResponse({
    status: 200,
    description: "The vehicle has been successfully updated.",
  })
  @ApiResponse({ status: 404, description: "Vehicle not found." })
  update(
    @Param("id") id: string,
    @Body() vehicle: Partial<Vehicle>
  ): Promise<Vehicle> {
    return this.vehiclesService.update(+id, vehicle);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a vehicle" })
  @ApiResponse({
    status: 200,
    description: "The vehicle has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Vehicle not found." })
  remove(@Param("id") id: string): Promise<void> {
    return this.vehiclesService.remove(+id);
  }
}
