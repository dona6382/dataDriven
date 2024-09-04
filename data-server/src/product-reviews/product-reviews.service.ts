import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from "typeorm";
import {ProductReview} from "./entities/product-review.entity";
import {generateRandomReviews} from "./generate-random-data/random-product-reviews";
import {CreateProductReviewDto} from "./dto/create-product-review.dto";

@Injectable()
export class ProductReviewsService {
  constructor(
      @InjectRepository(ProductReview)
      private readonly productReviewRepository: Repository<ProductReview>,
      private readonly dataSource: DataSource
  ) {}

  async createRandomData() {
    const numberOfReviews = 30000;  // 생성할 리뷰 수
    const randomReviews: ProductReview[] = await generateRandomReviews(numberOfReviews);

    const newProductReviews = randomReviews.map(review => new CreateProductReviewDto(review));

    return await this.saveProductReviewsInChunks(newProductReviews, 3000);
  }


  private async saveProductReviewsInChunks(newProductReviews: CreateProductReviewDto[], chunkSize: number) {
    await this.dataSource.transaction(async manager => {
      for (let i = 0; i < newProductReviews.length; i += chunkSize) {
        const chunk = newProductReviews.slice(i, i + chunkSize);
        await manager.insert(ProductReview, chunk);
      }
    });
  }

  async findAll(page: number) {
    const pageSize = 100;
    const [result, total] = await this.productReviewRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        productId: 'ASC',
      },
    });

    return {
      data: result,
      total,
      lastPage: Math.ceil(total / pageSize),
    };
  }

}
