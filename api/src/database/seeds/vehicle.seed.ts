import { DataSource } from 'typeorm';
import { Vehicle } from '../../entities/vehicle.entity';

export async function seedVehicles(dataSource: DataSource): Promise<void> {
  const vehicleRepository = dataSource.getRepository(Vehicle);

  // Check if we already have vehicles
  const existingVehicles = await vehicleRepository.find();
  if (existingVehicles.length > 0) {
    console.log('Vehicles already seeded, skipping...');
    return;
  }

  // TLC license plate format: TLC followed by 4 digits
  const vehicles = [
    {
      licensePlate: 'TLC1234',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      notes: 'Hybrid model, excellent fuel economy',
      vin: '1HGCM82633A123456',
    },
    {
      licensePlate: 'TLC5678',
      make: 'Honda',
      model: 'Accord',
      year: 2021,
      notes: 'Regular maintenance every 5,000 miles',
      vin: '1HGCV86439A567890',
    },
    {
      licensePlate: 'TLC9012',
      make: 'Nissan',
      model: 'Altima',
      year: 2023,
      notes: 'New vehicle, first service due in 3 months',
      vin: '1N4BL4BV2KC901234',
    },
    {
      licensePlate: 'TLC3456',
      make: 'Hyundai',
      model: 'Sonata',
      year: 2020,
      notes: 'Recently replaced brake pads',
      vin: '5NPEB4AC7LH345678',
    },
    {
      licensePlate: 'TLC7890',
      make: 'Kia',
      model: 'Optima',
      year: 2021,
      notes: 'Minor scratch on rear bumper',
      vin: 'KNAFX4A63E5789012',
    },
    {
      licensePlate: 'TLC2345',
      make: 'Ford',
      model: 'Fusion',
      year: 2019,
      notes: 'Higher mileage vehicle, regular maintenance',
      vin: '3FA6P0HD7JR234567',
    },
    {
      licensePlate: 'TLC6789',
      make: 'Chevrolet',
      model: 'Malibu',
      year: 2022,
      notes: 'Leather interior, premium package',
      vin: '1G1ZD5ST7LF678901',
    },
    {
      licensePlate: 'TLC0123',
      make: 'Mazda',
      model: 'Mazda6',
      year: 2021,
      notes: 'Sport package, excellent handling',
      vin: 'JM1GL1VM5A1012345',
    },
    {
      licensePlate: 'TLC4567',
      make: 'Subaru',
      model: 'Legacy',
      year: 2020,
      notes: 'All-wheel drive, good in winter conditions',
      vin: '4S3BMHB68B3456789',
    },
    {
      licensePlate: 'TLC8901',
      make: 'Volkswagen',
      model: 'Passat',
      year: 2022,
      notes: 'TDI engine, excellent fuel economy',
      vin: 'WVWZZZ1KZDM890123',
    },
  ];

  try {
    await vehicleRepository.save(vehicles);
    console.log('Successfully seeded vehicles');
  } catch (error) {
    console.error('Error seeding vehicles:', error);
    throw error;
  }
}
