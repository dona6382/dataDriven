import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '../../../log/type/logger';

@Injectable()
export class TransformProductDetailsService {
    constructor(
        @Inject('Logger')
        private readonly logger: Logger,
    ) {}

    async transformProductDetails(collectProductDetails: { [key: string]: any[] }) {
        const transformedProductDetails = [];

        for (const key in collectProductDetails) {
            const collectProductDetailArray = collectProductDetails[key];

            for (const collectProductDetailObject of collectProductDetailArray) {
                try {
                    const transformedProductDetail = this.transformProductDetail(
                        key,
                        collectProductDetailObject,
                    );
                    transformedProductDetails.push(...transformedProductDetail);
                } catch (error) {
                    this.logger.error(
                        `Failed to product detail for key ${key}: ${error.message}`,
                        error.stack,
                    );
                }
            }
        }

        this.logger.log(
            `transformedProductDetails 중복 처리 전 : ${transformedProductDetails.length}`,
        );

        const productDetailMap = new Map();

        for (const productDetail of transformedProductDetails) {
            const key = `${productDetail.productId}-${productDetail.date}`;
            if (!productDetailMap.has(key)) {
                productDetailMap.set(key, productDetail);
            }
        }

        const uniqueProductDetails = Array.from(productDetailMap.values());

        this.logger.log(
            `transformedProductDetails 중복 처리  : ${uniqueProductDetails.length}`,
        );

        return {
            uniqueProductDetails,
        };
    }

    private transformProductDetail(key: string, collectProductDetailObject: any) {
        const transformed: any[] = [];

        try {
            switch (key) {
                case '5001':
                    const collectProductDetailPageList5001 = collectProductDetailObject.data;

                    if (collectProductDetailPageList5001.length > 0) {
                        for (const collectProductDetailPage of collectProductDetailPageList5001) {
                            const transformedPage = {
                                productId: collectProductDetailPage.productId,
                                productName: collectProductDetailPage.productName,
                                price: collectProductDetailPage.price,
                                manufacturer: collectProductDetailPage.manufacturer,
                            };
                            transformed.push(transformedPage);
                        }
                        break;
                    }

                default:
                    throw new Error(`Unknown productDetail source: ${key}`);
            }
        } catch (error) {
            this.logger.error(
                `Error transforming productDetail for key ${key}: ${error.message}`,
                error.stack,
            );
            throw error;
        }

        return transformed;
    }

}