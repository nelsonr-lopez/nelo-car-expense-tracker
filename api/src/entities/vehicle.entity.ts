import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Expense } from "./expense.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("vehicles")
export class Vehicle {
  @ApiProperty({ description: "The unique identifier of the vehicle" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "The make of the vehicle" })
  @Column()
  make: string;

  @ApiProperty({ description: "The model of the vehicle" })
  @Column()
  model: string;

  @ApiProperty({ description: "The year of the vehicle" })
  @Column()
  year: number;

  @ApiProperty({ description: "The license plate number of the vehicle" })
  @Column({ unique: true })
  licensePlate: string;

  @ApiProperty({
    description: "The VIN (Vehicle Identification Number) of the vehicle",
  })
  @Column({ unique: true })
  vin: string;

  @ApiProperty({
    description: "The date when the vehicle was added to the system",
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: "The date when the vehicle was last updated" })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Expense, (expense) => expense.vehicle)
  expenses: Expense[];
}
