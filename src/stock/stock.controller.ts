import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock-dto';
import { ChangeStringCasePipe } from 'src/pipes/change-string-case/change-string-case.pipe';

import { StockService } from './stock.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import * as fs from 'fs-extra';
import { LoggerInterceptor } from 'src/logger/logger.interceptor';
import { AuthGuard } from '@nestjs/passport';

@Controller('stock')
@UseInterceptors(LoggerInterceptor)
// @UseGuards(MyGuard) //customguard
export class StockController {
  constructor(private stockService: StockService) {}

  @Get()
  getStock(@Query('keyword') keyword: string) {
    return this.stockService.getProduct(keyword);
  }
  // @Post()
  // @UsePipes(ValidationPipe)
  // @UsePipes(new ChangeStringCasePipe())
  // addStock(@Body() createStockDto: CreateStockDto) {
  //   return this.stockService.createProduct(createStockDto);
  // }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UsePipes(new ChangeStringCasePipe())
  async addStock(
    @UploadedFile() file: any,
    @Body() createStockDto: CreateStockDto,
  ) {
    const product = await this.stockService.createProduct(createStockDto);
    const imageFile = product.id + extname(file.originalname);
    fs.move(file.path, `upload/${imageFile}`);
    product.image = imageFile;
    await product.save();
    return product;
  }

  @Get('/:id')
  getStockById(@Param('id') id: number) {
    return this.stockService.getProductById(id);
  }
  @Delete('/:id')
  deleteStockById(@Param('id') id: number) {
    return this.stockService.deleteProductById(id);
  }

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateStockById(
    @Param('id') id: number,
    @UploadedFile() file: any,
    @Body() createStockDto: CreateStockDto,
  ) {
    const product = await this.stockService.updateProduct(id, createStockDto);
    if (file) {
      fs.remove(`upload/${product.image}`);
      const imageFile = id + extname(file.filename);
      fs.move(file.path, `upload/${imageFile}`);
      product.image = imageFile;
      await product.save();
    }
    return product;
  }
}
