import { DataSource, Repository } from 'typeorm';
import { Vehicle } from '../../entities/vehicle.entity';
import { seedVehicles } from './vehicle.seed';

describe('VehicleSeed', () => {
  let mockDataSource: Partial<DataSource>;
  let mockVehicleRepository: Partial<Repository<Vehicle>>;

  beforeEach(() => {
    mockVehicleRepository = {
      save: jest.fn(),
    };

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockVehicleRepository),
      query: jest.fn(),
    };
  });

  it('should seed vehicles', async () => {
    const expectedVehicles = [
      {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        licensePlate: 'ABC123',
        vin: '1HGCM82633A123456',
        notes: 'Company sedan - Sales team',
      },
      {
        make: 'Ford',
        model: 'F-150',
        year: 2021,
        licensePlate: 'XYZ789',
        vin: '2FTEW1E53MFB12345',
        notes: 'Work truck - Maintenance team',
      },
      {
        make: 'Honda',
        model: 'CR-V',
        year: 2022,
        licensePlate: 'DEF456',
        vin: '3CZRU6H54NM678901',
        notes: 'Executive vehicle',
      },
      {
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        licensePlate: 'GHI789',
        vin: '5YJ3E1EA1PF234567',
        notes: 'Electric vehicle pilot program',
      },
      {
        make: 'Chevrolet',
        model: 'Express',
        year: 2021,
        licensePlate: 'JKL012',
        vin: '1GCWGBFP8M1345678',
        notes: 'Cargo van - Delivery team',
      },
    ];

    (mockVehicleRepository.save as jest.Mock).mockResolvedValue(
      expectedVehicles,
    );

    const result = await seedVehicles(mockDataSource as DataSource);

    // Verify truncate queries were called
    expect(mockDataSource.query).toHaveBeenCalledWith(
      'TRUNCATE TABLE expenses CASCADE',
    );
    expect(mockDataSource.query).toHaveBeenCalledWith(
      'TRUNCATE TABLE vehicles CASCADE',
    );

    // Verify vehicles were saved
    expect(mockVehicleRepository.save).toHaveBeenCalledWith(expectedVehicles);
    expect(result).toEqual(expectedVehicles);
  });

  it('should handle errors during seeding', async () => {
    const error = new Error('Database error');
    (mockDataSource.query as jest.Mock).mockRejectedValue(error);

    await expect(seedVehicles(mockDataSource as DataSource)).rejects.toThrow(
      'Database error',
    );
  });
});
