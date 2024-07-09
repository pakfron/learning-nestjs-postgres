import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateStockDto } from './dto/create-stock-dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(createStockDto: CreateStockDto): Promise<Product> {
    const { name = '', price = 0, stock = 0 } = createStockDto;

    const product = new Product();
    product.name = name;
    product.price = price;
    product.stock = stock;
    await product.save();

    return product;
  }

  async findAllProduct(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOneProduct(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async deleteProductById(id: number) {
    return await this.productRepository.delete(id);
  }
  async getProductByQuery(keyword: string) {
    const query = this.productRepository.createQueryBuilder('product');
    query.andWhere(`product.name LIKE :keyword`, { keyword: `%${keyword}%` });
    return query.getMany();
  }
}
