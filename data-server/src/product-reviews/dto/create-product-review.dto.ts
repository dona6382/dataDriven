import {IsNumber, IsString} from "class-validator";
import {ProductReview} from "../entities/product-review.entity";

export class CreateProductReviewDto {
    @IsString()
    review_id: string;       // 리뷰 ID

    @IsString()
    reviewer: string;       // 리뷰 작성자

    @IsString()
    productId: string;      // 제품 ID

    @IsNumber()
    rating: number;         // 평점

    @IsString()
    date: string;           // 작성 일자

    constructor(review: ProductReview) {
        this.review_id = review.review_id;
        this.reviewer = review.reviewer;
        this.productId = review.productId;
        this.rating = review.rating;
        this.date = review.date;
    }
}
