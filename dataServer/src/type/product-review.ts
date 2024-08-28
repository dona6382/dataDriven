export interface ProductReview {
    reviewer: string;       // 리뷰 작성자
    rating: number;         // 평점 (1~5)
    comment: string;        // 리뷰 내용
    date: string;           // 작성 날짜 (형식: yyyy-MM-dd)
}