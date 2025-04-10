import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  Min,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ExpenseCategory {
  FUEL = 'FUEL',
  MAINTENANCE = 'MAINTENANCE',
  REPAIR = 'REPAIR',
  INSURANCE = 'INSURANCE',
  TAX = 'TAX',
  OTHER = 'OTHER',
}

export class CreateExpenseDto {
  @ApiProperty({ description: 'The date of the expense' })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'The ID of the associated vehicle' })
  @Type(() => Number)
  @IsNumber()
  vehicleId: number;

  @ApiProperty({
    description: 'The category of the expense',
    enum: ExpenseCategory,
    example: ExpenseCategory.FUEL,
  })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty({ description: 'The amount of the expense' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Optional note about the expense',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateExpenseDto {
  @ApiProperty({ description: 'The date of the expense', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  date?: Date;

  @ApiProperty({
    description: 'The ID of the associated vehicle',
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  vehicleId?: number;

  @ApiProperty({
    description: 'The category of the expense',
    required: false,
    enum: ExpenseCategory,
    example: ExpenseCategory.FUEL,
  })
  @IsEnum(ExpenseCategory)
  @IsOptional()
  category?: ExpenseCategory;

  @ApiProperty({ description: 'The amount of the expense', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Optional note about the expense',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class ExpenseFiltersDto {
  @ApiProperty({
    description: 'Search term for filtering expenses',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Filter by expense category',
    required: false,
    enum: ExpenseCategory,
    example: ExpenseCategory.FUEL,
  })
  @IsEnum(ExpenseCategory)
  @IsOptional()
  category?: ExpenseCategory;

  @ApiProperty({ description: 'Filter by vehicle ID', required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  vehicleId?: number;

  @ApiProperty({ description: 'Page number for pagination', required: false })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Number of items per page', required: false })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;
}
