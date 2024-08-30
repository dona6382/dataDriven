import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity('ProductReviews')
export class ProductReview {
    @PrimaryColumn()         // uuid
    review_id: string;

    @Column()
    reviewer: string;       // 리뷰 작성자

    @Column()
    productId: string;      // 제품 ID

    @Column()
    rating: number;         // 평점

    @Column()
    date: string;           // 작성 일자
}
