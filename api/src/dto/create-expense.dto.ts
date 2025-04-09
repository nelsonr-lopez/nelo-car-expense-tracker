import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDate,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsNumber()
  vehicleId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  note?: string;
}
