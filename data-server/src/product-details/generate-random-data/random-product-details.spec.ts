import {generateRandomProducts} from "./random-product-details";

describe('generateRandomData', () => {
    it('generate random products', async () => {
        const numProducts = 100;
        const products = generateRandomProducts(numProducts);

        expect(products).toHaveLength(numProducts);
        products.forEach(product => {
            expect(product).toHaveProperty('productId');
            expect(product).toHaveProperty('productName');
            expect(product).toHaveProperty('price');
            expect(product).toHaveProperty('manufacturer');
        });
    });

    it('generate random zero products', async () => {
        const reviews = generateRandomProducts(0);
        expect(reviews).toHaveLength(0);
    });

    it('generate random negative products', async () => {
        const reviews = generateRandomProducts(-10);
        expect(reviews).toHaveLength(0); // 음수 요청 시 빈 배열 반환
    });

});
