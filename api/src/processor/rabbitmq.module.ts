import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { ExpenseProcessor } from './expense.processor';

@Module({
  providers: [RabbitMQService, ExpenseProcessor],
  exports: [RabbitMQService, ExpenseProcessor],
})
export class RabbitMQModule {}
