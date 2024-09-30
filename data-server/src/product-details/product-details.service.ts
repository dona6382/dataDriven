import { Injectable } from '@nestjs/common';
import { CreateProductDetailsDto } from './dto/create-product-details.dto';
import { ProductDetails } from '../type/product-details';
import { generateRandomProducts } from './generate-random-data/random-product-details';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDetail } from './entities/product-detail.entity';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductDetailsService {
  constructor(
      @InjectRepository(ProductDetail)
      private readonly productDetailRepository: Repository<ProductDetail>,
      private readonly dataSource: DataSource
  ) {}

  async createRandomData() {
    const numberOfProducts = 9999;  // 생성할 제품 수
    const randomProducts: ProductDetails[] = generateRandomProducts(numberOfProducts);

    const newProductDetails = randomProducts.map(product => new CreateProductDetailsDto(product));

    return await this.saveProductDetailsInChunks(newProductDetails, 1000);
  }

  private async saveProductDetailsInChunks(productDetails: CreateProductDetailsDto[], chunkSize: number) {
    await this.dataSource.transaction(async manager => {
      for (let i = 0; i < productDetails.length; i += chunkSize) {
        const chunk = productDetails.slice(i, i + chunkSize);
        await manager.save(ProductDetail, chunk);
      }
    });
  }

  async findAll(page: number) {
    const pageSize = 100;
    const [result, total] = await this.productDetailRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        productId: 'ASC',
      },
    });

    return {
      dataList: result,
      total,
      lastPage: Math.ceil(total / pageSize),
    };
  }
}
