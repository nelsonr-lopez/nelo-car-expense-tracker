import { DataSource } from 'typeorm';
import { runSeeds } from './seeds';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function seed() {
  // Create a DataSource instance
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'cab_expense_tracker',
    entities: ['src/entities/*.entity.ts'],
    synchronize: false, // Important: Don't use synchronize in production
  });

  try {
    // Initialize the data source
    await dataSource.initialize();
    console.log('Data Source initialized');

    // Run the seeds
    await runSeeds(dataSource);

    // Close the data source
    await dataSource.destroy();
    console.log('Data Source destroyed');

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seed function
seed();
