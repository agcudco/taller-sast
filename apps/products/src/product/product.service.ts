import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const name = createProductDto.name.trim();
    const exists = await this.productRepository.findOneBy({ name });
    if (exists) {
      throw new ConflictException('Product already exists');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      name,
      category: { id: createProductDto.categoryId } as Category,
    });

    return this.productRepository.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: { category: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const duplicate = await this.productRepository.findOneBy({
        name: updateProductDto.name,
      });
      if (duplicate) {
        throw new ConflictException('Product already exists');
      }
    }

    const { categoryId, ...data } = updateProductDto;
    Object.assign(product, data);
    if (categoryId) {
      product.category = { id: categoryId } as Category;
    }

    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
