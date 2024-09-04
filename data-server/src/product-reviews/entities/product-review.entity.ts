import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity('ProductReviews')
export class ProductReview {
    @PrimaryColumn({ name: 'review_id'})         // uuid
    reviewId: string;

    @Column({ name: 'reviewer'})
    reviewer: string;       // 리뷰 작성자

    @Column({ name: 'product_id' })
    productId: string;      // 제품 ID

    @Column({ name: 'rating'})
    rating: number;         // 평점

    @Column({ name: 'date'})
    date: string;           // 작성 일자
}
