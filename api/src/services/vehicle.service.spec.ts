import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehicleService } from './vehicle.service';
import { Vehicle } from '../entities/vehicle.entity';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto/vehicle.dto';
import { NotFoundException } from '@nestjs/common';

describe('VehicleService', () => {
  let service: VehicleService;

  const mockVehicle = {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    licensePlate: 'ABC123',
    vin: '1HGCM82633A123456',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: getRepositoryToken(Vehicle),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vehicle', async () => {
      const createVehicleDto: CreateVehicleDto = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        licensePlate: 'ABC123',
        vin: '1HGCM82633A123456',
      };

      mockRepository.create.mockReturnValue(mockVehicle);
      mockRepository.save.mockResolvedValue(mockVehicle);

      const result = await service.create(createVehicleDto);

      expect(result).toEqual(mockVehicle);
      expect(mockRepository.create).toHaveBeenCalledWith(createVehicleDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all vehicles', async () => {
      const mockVehicles = [mockVehicle];
      mockRepository.findAndCount.mockResolvedValue([mockVehicles, 1]);

      const result = await service.findAll();

      expect(result).toEqual({
        vehicles: mockVehicles,
        page: 1,
        limit: 10,
        total: 1,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a vehicle if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockVehicle);

      const result = await service.findOne(1);

      expect(result).toEqual(mockVehicle);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if vehicle not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update a vehicle', async () => {
      const updateVehicleDto: UpdateVehicleDto = {
        make: 'Toyota',
        model: 'Camry',
        year: 2021,
        licensePlate: 'ABC123',
        vin: '1HGCM82633A123456',
      };

      mockRepository.findOne.mockResolvedValue(mockVehicle);
      mockRepository.save.mockResolvedValue({
        ...mockVehicle,
        ...updateVehicleDto,
      });

      const result = await service.update(1, updateVehicleDto);

      expect(result).toEqual({ ...mockVehicle, ...updateVehicleDto });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a vehicle', async () => {
      mockRepository.findOne.mockResolvedValue(mockVehicle);
      mockRepository.remove.mockResolvedValue(mockVehicle);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockVehicle);
    });
  });
});
