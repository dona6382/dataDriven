import { IsString, IsNumber } from 'class-validator';

export class CreateProductDetailsDto {
    @IsString()
    productId: string;      // 제품 ID

    @IsString()
    productName: string;    // 제품 이름

    @IsNumber()
    price: number;          // 가격

    @IsString()
    manufacturer: string;   // 제조사

    constructor(product: { productId: string, productName: string, price: number, manufacturer: string }) {
        this.productId = product.productId;
        this.productName = product.productName;
        this.price = product.price;
        this.manufacturer = product.manufacturer;
    }
}
