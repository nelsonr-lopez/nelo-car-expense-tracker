import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from '../entities/expense.entity';
import { ExpenseController } from '../controllers/expense.controller';
import { ExpenseService } from '../services/expense.service';
import { VehicleModule } from './vehicle.module';
import { RabbitMQModule } from '../processor/rabbitmq.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expense]), VehicleModule, RabbitMQModule],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
