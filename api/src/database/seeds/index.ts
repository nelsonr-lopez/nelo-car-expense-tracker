import { DataSource } from 'typeorm';
import { seedVehicles } from './vehicle.seed';

export async function runSeeds(dataSource: DataSource): Promise<void> {
  console.log('Running database seeds...');

  try {
    // Run vehicle seeds
    await seedVehicles(dataSource);

    console.log('All seeds completed successfully');
  } catch (error) {
    console.error('Error running seeds:', error);
    throw error;
  }
}
