import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VehicleService } from "../services/vehicle.service";
import { VehicleController } from "../controllers/vehicle.controller";
import { Vehicle } from "../entities/vehicle.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
