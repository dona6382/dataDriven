function generateRandomReview(productId) {
    const reviewers = ["이재원", "김소연", "박민수", "최지연", "이영수"];
    const comments = [
        "매우 만족합니다! 다시 구매할 의사가 있습니다.",
        "가격 대비 성능이 뛰어나요.",
        "생각보다 별로였어요. 기대 이하입니다.",
        "좋은 제품입니다. 추천합니다!",
        "배송이 너무 늦었어요. 아쉬워요."
    ];

    return {
        productId: productId,
        reviewer: reviewers[Math.floor(Math.random() * reviewers.length)],
        rating: Math.floor(Math.random() * 5) + 1, // 1~5 사이의 평점
        comment: comments[Math.floor(Math.random() * comments.length)],
        date: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 50)).toISOString().split('T')[0] // 최근 50일 내의 날짜
    };
}

const randomReviews = [];
const productIds = Array.from({ length: 10000 }, (_, i) => `P${String(i + 1).padStart(3, '0')}`); // 제품 ID 배열

for (let i = 0; i < 1000000; i++) { // 100만개 리뷰 생성
    const productId = productIds[Math.floor(Math.random() * productIds.length)];
    randomReviews.push(generateRandomReview(productId, i + 1));
}

// randomReviews 배열에 랜덤 리뷰 데이터가 생성됩니다.
console.log(randomReviews);
