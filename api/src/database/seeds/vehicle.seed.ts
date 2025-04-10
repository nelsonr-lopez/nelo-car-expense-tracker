import { DataSource } from 'typeorm';
import { Vehicle } from '../../entities/vehicle.entity';

export async function seedVehicles(dataSource: DataSource) {
  const vehicleRepository = dataSource.getRepository(Vehicle);

  try {
    // Clean up existing data with CASCADE
    await dataSource.query('TRUNCATE TABLE expenses CASCADE');
    await dataSource.query('TRUNCATE TABLE vehicles CASCADE');

    const vehicles = [
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

    const savedVehicles = await vehicleRepository.save(vehicles);
    console.log('Successfully seeded vehicles');
    return savedVehicles;
  } catch (error) {
    console.error('Error seeding vehicles:', error);
    throw error;
  }
}
