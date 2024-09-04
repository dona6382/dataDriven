import {IsNumber, IsString} from "class-validator";
import {ProductReview} from "../entities/product-review.entity";

export class CreateProductReviewDto {
    @IsString()
    reviewId: string;       // 리뷰 ID

    @IsString()
    reviewer: string;       // 리뷰 작성자

    @IsString()
    productId: string;      // 제품 ID

    @IsNumber()
    rating: number;         // 평점

    @IsString()
    date: string;           // 작성 일자

    constructor(review: ProductReview) {
        this.reviewId = review.reviewId;
        this.reviewer = review.reviewer;
        this.productId = review.productId;
        this.rating = review.rating;
        this.date = review.date;
    }
}
