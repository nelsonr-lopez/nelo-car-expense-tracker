import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseService } from './expense.service';
import { VehicleService } from './vehicle.service';
import { MockRabbitMQService } from '../__mocks__/rabbitmq.service';
import { RabbitMQService } from '../processor/rabbitmq.service';
import { Expense } from '../entities/expense.entity';
import { CreateExpenseDto } from '../dto/expense.dto';
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
      getManyAndCount: jest.fn().mockResolvedValue([[mockExpense], 1]),
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
    it('should create a new expense', async () => {
      const createExpenseDto: CreateExpenseDto = {
        date: new Date('2024-04-10'),
        category: 'Fuel',
        amount: 50.0,
        note: 'Regular fuel fill-up',
        vehicleId: 1,
      };

      mockVehicleService.findOne.mockResolvedValue({ id: 1 });
      mockRepository.create.mockReturnValue(mockExpense);
      mockRepository.save.mockResolvedValue(mockExpense);

      const result = await service.create(createExpenseDto);

      expect(result).toEqual(mockExpense);
      expect(mockVehicleService.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.create).toHaveBeenCalledWith(createExpenseDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an expense if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockExpense);

      const result = await service.findOne(1);

      expect(result).toEqual(mockExpense);
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

  describe('findAll', () => {
    it('should return paginated expenses', async () => {
      const result = await service.findAll({
        page: 1,
        limit: 10,
        search: 'fuel',
        category: 'Fuel',
        vehicleId: 1,
      });

      expect(result).toEqual({
        expenses: [mockExpense],
        total: 1,
        totalPages: 1,
      });

      const queryBuilder = mockRepository.createQueryBuilder();
      expect(queryBuilder.where).toHaveBeenCalled();
      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(queryBuilder.getManyAndCount).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an expense', async () => {
      const updateExpenseDto = {
        amount: 60.0,
      };

      mockRepository.findOne.mockResolvedValue(mockExpense);
      mockRepository.save.mockResolvedValue({
        ...mockExpense,
        ...updateExpenseDto,
      });

      const result = await service.update(1, updateExpenseDto);

      expect(result).toEqual({ ...mockExpense, ...updateExpenseDto });
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an expense', async () => {
      mockRepository.findOne.mockResolvedValue(mockExpense);
      mockRepository.remove.mockResolvedValue(mockExpense);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockExpense);
    });
  });
});
