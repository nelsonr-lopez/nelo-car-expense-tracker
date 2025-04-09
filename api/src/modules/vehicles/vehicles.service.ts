import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Vehicle } from "../../entities/vehicle.entity";

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>
  ) {}

  findAll(): Promise<Vehicle[]> {
    return this.vehiclesRepository.find();
  }

  findOne(id: number): Promise<Vehicle> {
    return this.vehiclesRepository.findOne({ where: { id } });
  }

  async create(vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const newVehicle = this.vehiclesRepository.create(vehicle);
    return this.vehiclesRepository.save(newVehicle);
  }

  async update(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    await this.vehiclesRepository.update(id, vehicle);
    return this.vehiclesRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.vehiclesRepository.delete(id);
  }
}
