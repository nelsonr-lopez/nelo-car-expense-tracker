import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Expense } from './entities/expense.entity';
import { VehicleModule } from './modules/vehicle.module';
import { ExpenseModule } from './modules/expense.module';
import { RabbitMQModule } from './processor/rabbitmq.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [Vehicle, Expense],
        synchronize: configService.get('ENVIRONMENT') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    VehicleModule,
    ExpenseModule,
    RabbitMQModule,
  ],
})
export class AppModule {}
