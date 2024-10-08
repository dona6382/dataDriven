import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { Logger } from '../log/type/logger';
import { CollectProductDetailsService } from './product/product-details/collect-product-details.service';
import { TransformProductDetailsService } from './product/product-details/transform-product-details.service';
import { CollectProductReviewsService } from './product/product-reviews/collect-product-reviews.service';
import { toZonedTime, format } from 'date-fns-tz';

@Injectable()
export class BatchService implements OnApplicationBootstrap {
  constructor(
    @Inject('Logger')
    private readonly logger: Logger,
    private readonly ProductDetailsService: CollectProductDetailsService,
    private readonly transformProductDetailsService: TransformProductDetailsService,
    private readonly collectProductReviewsService: CollectProductReviewsService,
  ) {}

  @Cron('0 */10 * * * *')
  async run() {
    const startTime = toZonedTime(new Date(), 'Asia/Seoul');
    this.logger.log(`10분마다 정기적으로 실행되는 Batch.`, {
      startTime: format(startTime, 'yyyy-MM-dd HH:mm:ssXXX', {
        timeZone: 'Asia/Seoul',
      }),
    });

    try {
      this.logger.log(`Batch 시작`);

      this.logger.log(`productDetails 시작`);

      const collectProductDetails = await this.ProductDetailsService.collectProductDetails();
      const uniqueProductDetails = await this.transformProductDetailsService.transformProductDetails(collectProductDetails);

      this.logger.log(`productReviews 시작`);

      const collectProductReviews = await this.collectProductReviewsService.collectProductReviewsService(uniqueProductDetails);

      this.logger.log(`Batch 종료`);
    } catch (error) {
      this.logger.error(
        'Batch 작업 중 에러 발생: ' + error.message,
        error.stack,
        { error },
      );
    } finally {
      const endTime = toZonedTime(new Date(), 'Asia/Seoul');
      this.logger.log(`Batch 작업 종료`, {
        endTime: format(endTime, 'yyyy-MM-dd HH:mm:ssXXX', {
          timeZone: 'Asia/Seoul',
        }),
      });
    }
  }

  onApplicationBootstrap() {
    this.run(); //run 주석시 10분에 실행(10,20,30...)
  }

  @Interval(30000)
  batchRunning() {
    const currentTime = toZonedTime(new Date(), 'Asia/Seoul');
    this.logger.log('Batch 서비스가 실행 중입니다...', {
      currentTime: format(currentTime, 'yyyy-MM-dd HH:mm:ssXXX', {
        timeZone: 'Asia/Seoul',
      }),
    });
  }
}
