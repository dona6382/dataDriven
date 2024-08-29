import {ProductDetails} from "./product-details";

export interface ProductOverview extends ProductDetails {
    averageRating: number;  // 평균 평점
    totalReviews: number;    // 총 리뷰 수
}