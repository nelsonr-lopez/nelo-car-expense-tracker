import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExpensesModule } from "./modules/expenses/expenses.module";
import { VehiclesModule } from "./modules/vehicles/vehicles.module";

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
        type: "postgres",
        host: configService.get("POSTGRES_HOST", "localhost"),
        port: configService.get("POSTGRES_PORT", 5432),
        username: configService.get("POSTGRES_USER", "postgres"),
        password: configService.get("POSTGRES_PASSWORD", "postgres"),
        database: configService.get("POSTGRES_DB", "cab_expenses"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize:
          configService.get("ENVIRONMENT", "development") === "development",
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    ExpensesModule,
    VehiclesModule,
  ],
})
export class AppModule {}
