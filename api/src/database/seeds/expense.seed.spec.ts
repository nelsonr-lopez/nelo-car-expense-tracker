import { DataSource, Repository, EntityTarget } from 'typeorm';
import { Vehicle } from '../../entities/vehicle.entity';
import { Expense } from '../../entities/expense.entity';
import { seedExpenses } from './expense.seed';
import { ExpenseCategory } from '../../dto/expense.dto';
import { seedVehicles } from './vehicle.seed';

jest.mock('./vehicle.seed');

describe('ExpenseSeed', () => {
  let mockDataSource: Partial<DataSource>;
  let mockExpenseRepository: Partial<Repository<Expense>>;
  let mockVehicleRepository: Partial<Repository<Vehicle>>;

  const mockVehicles: Vehicle[] = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      licensePlate: 'ABC123',
      vin: '1HGCM82633A123456',
      notes: 'Company sedan - Sales team',
      expenses: Promise.resolve([] as Expense[]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      make: 'Ford',
      model: 'F-150',
      year: 2021,
      licensePlate: 'XYZ789',
      vin: '2FTEW1E53MFB12345',
      notes: 'Work truck - Maintenance team',
      expenses: Promise.resolve([] as Expense[]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      make: 'Honda',
      model: 'CR-V',
      year: 2022,
      licensePlate: 'DEF456',
      vin: '3CZRU6H54NM678901',
      notes: 'Executive vehicle',
      expenses: Promise.resolve([] as Expense[]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      licensePlate: 'GHI789',
      vin: '5YJ3E1EA1PF234567',
      notes: 'Electric vehicle pilot program',
      expenses: Promise.resolve([] as Expense[]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 5,
      make: 'Chevrolet',
      model: 'Express',
      year: 2021,
      licensePlate: 'JKL012',
      vin: '1GCWGBFP8M1345678',
      notes: 'Cargo van - Delivery team',
      expenses: Promise.resolve([] as Expense[]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const expectedExpenses = [
    {
      date: new Date('2024-04-10'),
      category: ExpenseCategory.FUEL,
      amount: 45.5,
      note: 'Regular unleaded fuel',
      vehicleId: 1,
    },
    {
      date: new Date('2024-04-15'),
      category: ExpenseCategory.MAINTENANCE,
      amount: 75.0,
      note: 'Oil change and filter',
      vehicleId: 1,
    },
    {
      date: new Date('2024-04-12'),
      category: ExpenseCategory.FUEL,
      amount: 85.75,
      note: 'Diesel fuel',
      vehicleId: 2,
    },
    {
      date: new Date('2024-04-16'),
      category: ExpenseCategory.REPAIR,
      amount: 450.0,
      note: 'Replace brake pads and rotors',
      vehicleId: 2,
    },
    {
      date: new Date('2024-04-13'),
      category: ExpenseCategory.FUEL,
      amount: 52.25,
      note: 'Premium fuel',
      vehicleId: 3,
    },
    {
      date: new Date('2024-04-17'),
      category: ExpenseCategory.INSURANCE,
      amount: 175.0,
      note: 'Monthly insurance premium',
      vehicleId: 3,
    },
    {
      date: new Date('2024-04-14'),
      category: ExpenseCategory.MAINTENANCE,
      amount: 95.0,
      note: 'Tire rotation and alignment',
      vehicleId: 4,
    },
    {
      date: new Date('2024-04-18'),
      category: ExpenseCategory.TAX,
      amount: 250.0,
      note: 'Annual registration renewal',
      vehicleId: 4,
    },
    {
      date: new Date('2024-04-11'),
      category: ExpenseCategory.FUEL,
      amount: 95.5,
      note: 'Regular unleaded fuel',
      vehicleId: 5,
    },
    {
      date: new Date('2024-04-19'),
      category: ExpenseCategory.REPAIR,
      amount: 325.0,
      note: 'Replace serpentine belt',
      vehicleId: 5,
    },
  ];

  beforeEach(() => {
    mockExpenseRepository = {
      save: jest.fn(),
    };

    mockVehicleRepository = {
      find: jest.fn(),
    };

    mockDataSource = {
      getRepository: jest
        .fn()
        .mockImplementation((entity: EntityTarget<any>): any => {
          if (entity === Expense) return mockExpenseRepository;
          if (entity === Vehicle) return mockVehicleRepository;
          throw new Error('Unknown entity');
        }),
    };

    jest.clearAllMocks();
  });

  it('should seed expenses successfully', async () => {
    (seedVehicles as jest.Mock).mockResolvedValue(mockVehicles);
    (mockExpenseRepository.save as jest.Mock).mockResolvedValue(
      expectedExpenses,
    );

    await seedExpenses(mockDataSource as DataSource);

    expect(seedVehicles).toHaveBeenCalledWith(mockDataSource);
    expect(mockExpenseRepository.save).toHaveBeenCalledWith(expectedExpenses);
  });

  it('should handle errors during seeding', async () => {
    const error = new Error('Failed to seed vehicles');
    (seedVehicles as jest.Mock).mockRejectedValue(error);

    await expect(seedExpenses(mockDataSource as DataSource)).rejects.toThrow(
      'Failed to seed vehicles',
    );
  });
});
