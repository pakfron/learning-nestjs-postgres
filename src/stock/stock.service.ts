import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { CreateStockDto } from './dto/create-stock-dto';
import { ProductRepository } from './product.repository';
import * as fs from 'fs-extra';

@Injectable()
export class StockService {
  constructor(private productRepository: ProductRepository) {}

  async createProduct(createStockDto: CreateStockDto): Promise<Product> {
    return await this.productRepository.createProduct(createStockDto);
  }

  async getProduct(keyword: string): Promise<Product[]> {
    if (keyword) {
      return this.productRepository.getProductByQuery(keyword);
    } else {
      return this.productRepository.findAllProduct();
    }
  }

  async getProductById(id: number) {
    const found = await this.productRepository.findOneProduct(Number(id));
    if (!found) {
      throw new NotFoundException(`Product ${id} is not found!`);
    }

    return found;
  }
  async deleteProductById(id: number) {
    const found = await this.getProductById(id);
    const { image = '' } = found;
    await fs.remove(`upload/${image}`);
    return await this.productRepository.deleteProductById(id);
  }

  async updateProduct(id: number, CreateStockDto: CreateStockDto) {
    const product = await this.getProductById(id);
    const { name, price, stock } = CreateStockDto;
    product.name = name;
    product.stock = stock;
    product.price = price;

    await product.save();
    return product;
  }
}
