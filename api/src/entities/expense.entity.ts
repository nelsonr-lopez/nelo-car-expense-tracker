import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Vehicle } from "./vehicle.entity";

@Entity("expenses")
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicleId: number;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column()
  date: Date;

  @Column()
  category: string;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.expenses)
  @JoinColumn({ name: "vehicleId" })
  vehicle: Vehicle;
}
