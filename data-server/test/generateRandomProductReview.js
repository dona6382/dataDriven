function generateRandomReview(productIds, reviewers) {
    const rating = (Math.random() * 4 + 1).toFixed(1); // 1.0 ~ 5.0
    const productId = productIds[Math.floor(Math.random() * productIds.length)];
    const reviewer = reviewers[Math.floor(Math.random() * reviewers.length)];
    const date = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 50)).toISOString().split('T')[0]; // 최근 50일 내의 날짜

    return {
        productId: productId,
        reviewer: reviewer,
        rating: parseFloat(rating),
        date: date
    };
}

const productIds = Array.from({ length: 10000 }, (_, i) => `P${String(i + 1).padStart(4, '0')}`);
const reviewers = Array.from({ length: 10000 }, (_, i) => `reviewer${i + 1}`);

async function generateRandomReviews(totalReviews, batchSize) {
    const reviews = [];

    for (let i = 0; i < totalReviews; i += batchSize) {
        const promises = Array.from({ length: Math.min(batchSize, totalReviews - i) }, () =>
            new Promise((resolve) => {
                resolve(generateRandomReview(productIds, reviewers));
            })
        );

        const batchReviews = await Promise.all(promises);
        reviews.push(...batchReviews);
        console.log(reviews.length);
    }
    return reviews;
}

const totalReviews = 1000000;
const batchSize = 10000;

generateRandomReviews(totalReviews, batchSize).then(randomReviews => {
    console.log(randomReviews);
});
