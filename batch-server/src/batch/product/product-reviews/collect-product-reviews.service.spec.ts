import { Test, TestingModule } from '@nestjs/testing';
import { CollectProductReviewsService } from './collect-product-reviews.service';

describe('ProductReviewsService', () => {
  let service: CollectProductReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectProductReviewsService],
    }).compile();

    service = module.get<CollectProductReviewsService>(CollectProductReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
