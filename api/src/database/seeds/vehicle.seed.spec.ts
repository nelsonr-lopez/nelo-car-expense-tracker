import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '../../entities/vehicle.entity';
import { Expense } from '../../entities/expense.entity';
import { seedVehicles } from './vehicle.seed';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('VehicleSeed', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
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
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
      ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    // Clean up the database after each test
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Delete all expenses first (due to foreign key constraints)
      await queryRunner.manager.delete(Expense, {});
      // Then delete all vehicles
      await queryRunner.manager.delete(Vehicle, {});
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
      await dataSource.destroy();
    }
  });

  it('should seed vehicles when database is empty', async () => {
    // Run the seed
    await seedVehicles(dataSource);

    // Check if vehicles were created
    const repository = dataSource.getRepository(Vehicle);
    const vehicles = await repository.find();

    // Verify the results
    expect(vehicles).toHaveLength(10);
    expect(vehicles[0].licensePlate).toBe('TLC1234');
    expect(vehicles[0].make).toBe('Toyota');
    expect(vehicles[0].model).toBe('Camry');
  });

  it('should not seed vehicles when vehicles already exist', async () => {
    // First seeding
    await seedVehicles(dataSource);

    // Second seeding
    await seedVehicles(dataSource);

    // Check if no duplicate vehicles were created
    const repository = dataSource.getRepository(Vehicle);
    const vehicles = await repository.find();

    // Verify we still only have the original 10 vehicles
    expect(vehicles).toHaveLength(10);
  });

  it('should save vehicles with correct VIN numbers', async () => {
    // Run the seed
    await seedVehicles(dataSource);

    // Check if vehicles were created with correct VIN numbers
    const repository = dataSource.getRepository(Vehicle);
    const vehicles = await repository.find();

    // Verify VIN numbers
    expect(vehicles[0].vin).toBe('1HGCM82633A123456');
    expect(vehicles[1].vin).toBe('1HGCV86439A567890');
    expect(vehicles[2].vin).toBe('1N4BL4BV2KC901234');
  });
});
