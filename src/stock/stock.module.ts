import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { StockService } from './stock.service';
import { ProductRepository } from './product.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule],
  controllers: [StockController],
  providers: [StockService, ProductRepository],
})
export class StockModule {}
