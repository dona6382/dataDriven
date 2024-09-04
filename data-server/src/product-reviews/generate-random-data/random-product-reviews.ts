import { v4 as uuidv4 } from 'uuid';
import { ProductReviews } from "../../type/product-reviews";

const batchSize = 10000;

function generateRandomReview(productIds: string[], reviewers: string[]): ProductReviews {
    const rating = (Math.random() * 4 + 1).toFixed(1); // 1.0 ~ 5.0
    const productId = productIds[Math.floor(Math.random() * productIds.length)];
    const reviewer = reviewers[Math.floor(Math.random() * reviewers.length)];
    const date = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 50)).toISOString().split('T')[0]; // 최근 50일 내의 날짜

    return {
        reviewId: uuidv4(),
        productId: productId,
        reviewer: reviewer,
        rating: parseFloat(rating),
        date: date
    };
}

const productIds = Array.from({ length: 10000 }, (_, i) => `P${String(i + 1).padStart(4, '0')}`);
const reviewers = Array.from({ length: 10000 }, (_, i) => `reviewer${i + 1}`);

export async function generateRandomReviews(numReviews: number): Promise<ProductReviews[]> {
    const randomProductReviews: ProductReviews[] = [];

    for (let i = 0; i < numReviews; i += batchSize) {
        const promises = Array.from({ length: Math.min(batchSize, numReviews - i) }, () =>
            new Promise<ProductReviews>((resolve) => {
                resolve(generateRandomReview(productIds, reviewers));
            })
        );

        const batchReviews = await Promise.all(promises);
        randomProductReviews.push(...batchReviews);
        console.log(randomProductReviews.length);
    }
    return randomProductReviews;
}
