import {Entity, Column, PrimaryColumn} from 'typeorm';

@Entity('ProductDetails')
export class ProductDetail {
    @PrimaryColumn({ name: 'product_id' })
    productId: string;      // 제품 ID

    @Column({ name: 'product_name' })
    productName: string;    // 제품 이름

    @Column({ name: 'price'})
    price: number;          // 가격

    @Column({ name: 'manufacturer' })
    manufacturer: string;    // 제조사
}
