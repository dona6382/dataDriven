import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { ProductReviewsService } from './product-reviews.service';
import { CreateProductReviewDto } from './dto/create-product-review.dto';

@Controller('product-reviews')
export class ProductReviewsController {
  constructor(private readonly productReviewsService: ProductReviewsService) {}

  @Post()
  create() {
    return this.productReviewsService.createRandomData();
  }

  @Get()
  findAll(@Query('page') page: number) {
    return this.productReviewsService.findAll(page);
  }

}
