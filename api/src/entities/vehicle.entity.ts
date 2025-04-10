import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Expense } from './expense.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator';

@Entity('vehicles')
export class Vehicle {
  @ApiProperty({ description: 'The unique identifier of the vehicle' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The license plate of the vehicle' })
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ description: 'The make of the vehicle' })
  @Column()
  @IsString()
  @IsNotEmpty()
  make: string;

  @ApiProperty({ description: 'The model of the vehicle' })
  @Column()
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ description: 'Optional notes about the vehicle' })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({ description: 'The year of the vehicle' })
  @Column()
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    description: 'The VIN (Vehicle Identification Number) of the vehicle',
  })
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @Length(17, 17)
  vin: string;

  @ApiProperty({ description: 'The expenses associated with this vehicle' })
  @OneToMany(() => Expense, (expense) => expense.vehicle, {
    lazy: true,
  })
  expenses: Promise<Expense[]>;

  @ApiProperty({ description: 'When the vehicle was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the vehicle was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
