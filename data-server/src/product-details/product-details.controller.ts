import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductDetailsService } from './product-details.service';
import { CreateProductDetailsDto } from './dto/create-product-details.dto';

@Controller('product-details')
export class ProductDetailsController {
  constructor(private readonly productDetailsService: ProductDetailsService) {}

  @Post()
  createRandomData() {
    return this.productDetailsService.createRandomData();
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.productDetailsService.findOne(+id);
  }

}
