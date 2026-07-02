import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: jest.Mocked<Repository<Category>>;

  // Datos de prueba completos según la entidad
  const mockCategory: Category = {
    id: 'uuid-1234',
    name: 'Electrónica',
    description: 'Descripción de Electrónica',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    products: [],
  };

  const createCategoryDto: CreateCategoryDto = {
    name: 'Electrónica',
  };

  const updateCategoryDto: UpdateCategoryDto = {
    name: 'Electrónica Actualizada',
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn().mockResolvedValue(mockCategory), // valor por defecto
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get(getRepositoryToken(Category)) as jest.Mocked<
      Repository<Category>
    >;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ==========================================
  // TESTS DEL MÉTODO CREATE
  // ==========================================

  describe('create', () => {
    it('debería crear una categoría exitosamente', async () => {
      repository.findOneBy.mockResolvedValue(null); // No existe
      // save ya tiene valor por defecto

      const result = await service.create(createCategoryDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        name: 'electrónica',
      });
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'electrónica' }),
      );
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'electrónica' }),
      );
      expect(result).toEqual(expect.objectContaining({ name: 'electrónica' }));
    });

    it('debería normalizar el nombre a minúsculas antes de guardar', async () => {
      repository.findOneBy.mockResolvedValue(null);
      // save ya tiene valor por defecto

      const dtoUppercase: CreateCategoryDto = { name: '  ELECTRÓNICA  ' };
      await service.create(dtoUppercase);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'electrónica' }),
      );
    });

    it('debería lanzar ConflictException si la categoría ya existe', async () => {
      repository.findOneBy.mockResolvedValue(mockCategory);

      await expect(service.create(createCategoryDto)).rejects.toThrow(
        ConflictException,
      );

      expect(repository.findOneBy).toHaveBeenCalledWith({
        name: 'electrónica',
      });
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // TESTS DEL MÉTODO FINDALL
  // ==========================================

  describe('findAll', () => {
    it('debería retornar un arreglo de categorías', async () => {
      const mockCategories = [
        { ...mockCategory, id: 'uuid-1', name: 'Electrónica' },
        { ...mockCategory, id: 'uuid-2', name: 'Ropa' },
      ];
      repository.find.mockResolvedValue(mockCategories);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });

    it('debería retornar un arreglo vacío si no hay categorías', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ==========================================
  // TESTS DEL MÉTODO FINDONE
  // ==========================================

  describe('findOne', () => {
    it('debería retornar la categoría encontrada por ID', async () => {
      repository.findOne.mockResolvedValue(mockCategory);

      const result = await service.findOne('uuid-1234');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1234' },
      });
      expect(result).toEqual(mockCategory);
    });

    it('debería lanzar NotFoundException si la categoría no existe', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('no-existe')).rejects.toThrow(
        NotFoundException,
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'no-existe' },
      });
    });
  });

  // ==========================================
  // TESTS DEL MÉTODO UPDATE
  // ==========================================

  describe('update', () => {
    it('debería actualizar el nombre correctamente', async () => {
      repository.findOne.mockResolvedValue(mockCategory);
      repository.findOneBy.mockResolvedValue(null); // Nuevo nombre no existe
      repository.save.mockResolvedValue({
        ...mockCategory,
        name: 'Electrónica Actualizada',
      });

      const result = await service.update('uuid-1234', updateCategoryDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1234' },
      });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Electrónica Actualizada' }),
      );
      expect(result.name).toBe('Electrónica Actualizada');
    });

    it('debería lanzar NotFoundException si la categoría no existe', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.update('no-existe', updateCategoryDto),
      ).rejects.toThrow(NotFoundException);

      expect(repository.save).not.toHaveBeenCalled();
    });

    it('debería lanzar ConflictException si el nuevo nombre ya existe', async () => {
      repository.findOne.mockResolvedValue(mockCategory);
      repository.findOneBy.mockResolvedValue({
        ...mockCategory,
        id: 'otro-uuid',
      });

      await expect(
        service.update('uuid-1234', updateCategoryDto),
      ).rejects.toThrow(ConflictException);

      expect(repository.save).not.toHaveBeenCalled();
    });

    it('NO debería verificar duplicado si el nombre no se está cambiando', async () => {
      repository.findOne.mockResolvedValue(mockCategory);
      // save ya tiene valor por defecto

      const dtoSinNombre: UpdateCategoryDto = {
        description: 'Nueva descripción',
      };

      await service.update('uuid-1234', dtoSinNombre);

      expect(repository.findOneBy).not.toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  // ==========================================
  // TESTS DEL MÉTODO REMOVE
  // ==========================================

  describe('remove', () => {
    it('debería eliminar la categoría existente', async () => {
      repository.findOne.mockResolvedValue(mockCategory);
      repository.remove.mockResolvedValue(mockCategory); // Cambio: devolver la entidad, no undefined

      await service.remove('uuid-1234');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1234' },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockCategory);
    });

    it('debería lanzar NotFoundException si la categoría no existe', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('no-existe')).rejects.toThrow(
        NotFoundException,
      );

      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
