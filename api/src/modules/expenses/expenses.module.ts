import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExpensesController } from "./expenses.controller";
import { ExpensesService } from "./expenses.service";
import { Expense } from "../../entities/expense.entity";
import { Vehicle } from "../../entities/vehicle.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Vehicle])],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
