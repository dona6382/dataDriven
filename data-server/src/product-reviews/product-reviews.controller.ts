import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductReviewsService } from './product-reviews.service';
import { CreateProductReviewDto } from './dto/create-product-review.dto';

@Controller('product-reviews')
export class ProductReviewsController {
  constructor(private readonly productReviewsService: ProductReviewsService) {}

  @Post()
  create() {
    return this.productReviewsService.createRandomData();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productReviewsService.findOne(+id);
  }

}
