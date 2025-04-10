import { DataSource } from 'typeorm';
import { Expense } from '../../entities/expense.entity';
import { ExpenseCategory } from '../../dto/expense.dto';
import { seedVehicles } from './vehicle.seed';

export async function seedExpenses(dataSource: DataSource) {
  const expenseRepository = dataSource.getRepository(Expense);

  try {
    // First seed vehicles and get their IDs
    const vehicles = await seedVehicles(dataSource);

    const expenses = [
      // Toyota Camry expenses
      {
        date: new Date('2024-04-10'),
        category: ExpenseCategory.FUEL,
        amount: 45.5,
        note: 'Regular unleaded fuel',
        vehicleId: vehicles[0].id,
      },
      {
        date: new Date('2024-04-15'),
        category: ExpenseCategory.MAINTENANCE,
        amount: 75.0,
        note: 'Oil change and filter',
        vehicleId: vehicles[0].id,
      },
      // Ford F-150 expenses
      {
        date: new Date('2024-04-12'),
        category: ExpenseCategory.FUEL,
        amount: 85.75,
        note: 'Diesel fuel',
        vehicleId: vehicles[1].id,
      },
      {
        date: new Date('2024-04-16'),
        category: ExpenseCategory.REPAIR,
        amount: 450.0,
        note: 'Replace brake pads and rotors',
        vehicleId: vehicles[1].id,
      },
      // Honda CR-V expenses
      {
        date: new Date('2024-04-13'),
        category: ExpenseCategory.FUEL,
        amount: 52.25,
        note: 'Premium fuel',
        vehicleId: vehicles[2].id,
      },
      {
        date: new Date('2024-04-17'),
        category: ExpenseCategory.INSURANCE,
        amount: 175.0,
        note: 'Monthly insurance premium',
        vehicleId: vehicles[2].id,
      },
      // Tesla Model 3 expenses
      {
        date: new Date('2024-04-14'),
        category: ExpenseCategory.MAINTENANCE,
        amount: 95.0,
        note: 'Tire rotation and alignment',
        vehicleId: vehicles[3].id,
      },
      {
        date: new Date('2024-04-18'),
        category: ExpenseCategory.TAX,
        amount: 250.0,
        note: 'Annual registration renewal',
        vehicleId: vehicles[3].id,
      },
      // Chevrolet Express expenses
      {
        date: new Date('2024-04-11'),
        category: ExpenseCategory.FUEL,
        amount: 95.5,
        note: 'Regular unleaded fuel',
        vehicleId: vehicles[4].id,
      },
      {
        date: new Date('2024-04-19'),
        category: ExpenseCategory.REPAIR,
        amount: 325.0,
        note: 'Replace serpentine belt',
        vehicleId: vehicles[4].id,
      },
    ];

    await expenseRepository.save(expenses);
    console.log('Successfully seeded expenses');
  } catch (error) {
    console.error('Error seeding expenses:', error);
    throw error;
  }
}
