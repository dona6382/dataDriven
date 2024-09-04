import {Controller, Get, Post, Body, Param, Query} from '@nestjs/common';
import { ProductDetailsService } from './product-details.service';
import { CreateProductDetailsDto } from './dto/create-product-details.dto';

@Controller('product-details')
export class ProductDetailsController {
  constructor(private readonly productDetailsService: ProductDetailsService) {}

  @Post()
  createRandomData() {
    return this.productDetailsService.createRandomData();
  }

  @Get()
  findAll(@Query('page') page: number) {
    return this.productDetailsService.findAll(page);
  }

}
