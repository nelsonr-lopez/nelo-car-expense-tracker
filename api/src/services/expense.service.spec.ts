import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseService } from './expense.service';
import { VehicleService } from './vehicle.service';
import { MockRabbitMQService } from '../__mocks__/rabbitmq.service';
import { RabbitMQService } from '../processor/rabbitmq.service';
import { Expense } from '../entities/expense.entity';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseFiltersDto,
  ExpenseCategory,
} from '../dto/expense.dto';
import { NotFoundException } from '@nestjs/common';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let repository: Repository<Expense>;
  let vehicleService: VehicleService;
  let rabbitMQService: RabbitMQService;

  const mockExpense = {
    id: 1,
    date: new Date('2024-04-10'),
    category: 'Fuel',
    amount: 50.0,
    note: 'Regular fuel fill-up',
    vehicleId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    }),
  };

  const mockVehicleService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        {
          provide: getRepositoryToken(Expense),
          useValue: mockRepository,
        },
        {
          provide: VehicleService,
          useValue: mockVehicleService,
        },
        {
          provide: RabbitMQService,
          useClass: MockRabbitMQService,
        },
      ],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
    repository = module.get<Repository<Expense>>(getRepositoryToken(Expense));
    vehicleService = module.get<VehicleService>(VehicleService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an expense', async () => {
      const createExpenseDto: CreateExpenseDto = {
        date: new Date(),
        vehicleId: 1,
        category: ExpenseCategory.FUEL,
        amount: 100,
        note: 'Test expense',
      };

      const expense = { id: 1, ...createExpenseDto };
      mockVehicleService.findOne.mockResolvedValue({ id: 1 });
      mockRepository.create.mockReturnValue(expense);
      mockRepository.save.mockResolvedValue(expense);

      const result = await service.create(createExpenseDto);

      expect(result).toEqual(expense);
      expect(mockVehicleService.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.create).toHaveBeenCalledWith(createExpenseDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expense);
    });
  });

  describe('findAll', () => {
    it('should return paginated expenses', async () => {
      const filters: ExpenseFiltersDto = {
        search: 'test',
        category: ExpenseCategory.FUEL,
        vehicleId: 1,
        page: 1,
        limit: 10,
      };

      const expenses = [
        {
          id: 1,
          date: new Date(),
          category: ExpenseCategory.FUEL,
          amount: 100,
          vehicleId: 1,
        },
      ];

      mockRepository
        .createQueryBuilder()
        .getManyAndCount.mockResolvedValue([expenses, 1]);

      const result = await service.findAll(filters);

      expect(result).toEqual({
        expenses,
        total: 1,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return an expense by id', async () => {
      const expense = {
        id: 1,
        date: new Date(),
        category: ExpenseCategory.FUEL,
        amount: 100,
        vehicleId: 1,
      };

      mockRepository.findOne.mockResolvedValue(expense);

      const result = await service.findOne(1);

      expect(result).toEqual(expense);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['vehicle'],
      });
    });

    it('should throw NotFoundException if expense not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an expense', async () => {
      const updateExpenseDto: UpdateExpenseDto = {
        amount: 200,
        category: ExpenseCategory.MAINTENANCE,
      };

      const existingExpense = {
        id: 1,
        date: new Date(),
        category: ExpenseCategory.FUEL,
        amount: 100,
        vehicleId: 1,
      };

      const updatedExpense = {
        ...existingExpense,
        ...updateExpenseDto,
      };

      mockRepository.findOne.mockResolvedValue(existingExpense);
      mockRepository.save.mockResolvedValue(updatedExpense);

      const result = await service.update(1, updateExpenseDto);

      expect(result).toEqual(updatedExpense);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['vehicle'],
      });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedExpense);
    });
  });

  describe('remove', () => {
    it('should remove an expense', async () => {
      const expense = {
        id: 1,
        date: new Date(),
        category: ExpenseCategory.FUEL,
        amount: 100,
        vehicleId: 1,
      };

      mockRepository.findOne.mockResolvedValue(expense);
      mockRepository.remove.mockResolvedValue(expense);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['vehicle'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(expense);
    });
  });
});
