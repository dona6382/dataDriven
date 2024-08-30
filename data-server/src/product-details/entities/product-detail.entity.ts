import {Entity, Column, PrimaryColumn} from 'typeorm';

@Entity('ProductDetails')
export class ProductDetail {
    @PrimaryColumn()
    productId: string;      // 제품 ID

    @Column()
    productName: string;    // 제품 이름

    @Column()
    price: number;          // 가격

    @Column()
    manufacturer: string;    // 제조사
}
