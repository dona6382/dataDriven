export interface ProductReviews {
    review_id: string;
    reviewer: string;       // 리뷰 작성자
    productId: string;      // 제품 ID
    rating: number;         // 평점 (1~5)
    date: string;           // 작성 날짜 (형식: yyyy-MM-dd)
}