import {ProductDetails} from "../../type/product-details";

function getRandomLetter(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
}


function generateRandomProduct(id: number, usedProductNames: Set<string>): ProductDetails {
    const productNames = Array.from({ length: 9999 }, (_, i) => `prodName ${i + 1}`);
    const manufacturers = [
        "제조사 A", "제조사 B", "제조사 C", "제조사 D", "제조사 E",
        "제조사 F", "제조사 G", "제조사 H", "제조사 I", "제조사 J",
        "제조사 K", "제조사 L", "제조사 M", "제조사 N", "제조사 O",
    ];

    const manufacturerIndex = Math.floor(Math.random() * manufacturers.length);

    let productName: string;
    do {
        productName = productNames[Math.floor(Math.random() * productNames.length)];
    } while (usedProductNames.has(productName));  // 이미 사용된 제품 이름 체크

    usedProductNames.add(productName);  // 사용된 제품 이름 추가

    return {
        productId: `P${String(id).padStart(4, '0')}`,  // 4자리로 맞추기
        productName: productName,
        price: Math.floor(Math.random() * 2000000) + 1000,  // 1,000 ~ 2,000,000 사이의 가격
        manufacturer: manufacturers[manufacturerIndex] + getRandomLetter() + getRandomLetter(),  // 제조사 이름 뒤에 임의의 알파벳 추가
    };
}

export function generateRandomProducts(numProducts: number): ProductDetails[] {
    const randomProductDetails: ProductDetails[] = [];
    const usedProductNames = new Set<string>();  // 사용된 제품 이름을 저장할 Set

    for (let i = 1; i <= numProducts; i++) {     // 지정된 개수만큼 제품 생성
        randomProductDetails.push(generateRandomProduct(i, usedProductNames));
    }

    return randomProductDetails;
}
