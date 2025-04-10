import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from './vehicle.entity';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsDate,
  IsOptional,
  Min,
  IsEnum,
} from 'class-validator';
import { ExpenseCategory } from '../dto/expense.dto';

@Entity()
export class Expense {
  @ApiProperty({ description: 'The unique identifier of the expense' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The date of the expense' })
  @Column({ type: 'date' })
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    description: 'The category of the expense',
    enum: ExpenseCategory,
    example: ExpenseCategory.FUEL,
  })
  @Column({
    type: 'enum',
    enum: ExpenseCategory,
    default: ExpenseCategory.OTHER,
  })
  @IsEnum(ExpenseCategory)
  @IsNotEmpty()
  category: ExpenseCategory;

  @ApiProperty({ description: 'The amount of the expense' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Optional note about the expense' })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty({ description: 'The vehicle associated with this expense' })
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.expenses, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  vehicle: Promise<Vehicle>;

  @ApiProperty({ description: 'The ID of the associated vehicle' })
  @Column()
  @IsNumber()
  @IsNotEmpty()
  vehicleId: number;

  @ApiProperty({ description: 'When the expense was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the expense was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
