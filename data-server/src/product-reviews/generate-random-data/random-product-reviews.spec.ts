import { generateRandomReviews } from './random-product-reviews';
import { v4 as uuidv4 } from 'uuid';

// uuidv4를 mocking
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'test-uuid')
}));

describe('generateRandomReviews', () => {
    it('generate random reviews', async () => {
        const numReviews = 100;
        const reviews = await generateRandomReviews(numReviews);

        expect(reviews).toHaveLength(numReviews);
        reviews.forEach(review => {
            expect(review).toHaveProperty('review_id', 'test-uuid');
            expect(review).toHaveProperty('productId');
            expect(review).toHaveProperty('reviewer');
            expect(review).toHaveProperty('rating');
            expect(review.rating).toBeGreaterThan(0);
            expect(review.rating).toBeLessThan(6);
            expect(review).toHaveProperty('date');
        });
    });

    it('generate random zero reviews', async () => {
        const reviews = await generateRandomReviews(0);
        expect(reviews).toHaveLength(0);
    });

    it('generate random negative reviews', async () => {
        const reviews = await generateRandomReviews(-10);
        expect(reviews).toHaveLength(0); // 음수 요청 시 빈 배열 반환
    });

});
