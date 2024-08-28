function getRandomLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
}

function generateRandomProduct(id, usedProductNames) {
    const productNames = Array.from({ length: 9999 }, (_, i) => `제품 ${i + 1}`);
    const categories = [
        "전자제품", "음향 기기", "컴퓨터", "웨어러블", "가전제품",
        "주방용품", "스포츠 용품", "자동차 액세서리", "사무용품"
    ];
    const manufacturers = [
        "제조사 A", "제조사 B", "제조사 C", "제조사 D", "제조사 E",
        "제조사 F", "제조사 G", "제조사 H", "제조사 I", "제조사 J",
        "제조사 K", "제조사 L", "제조사 M", "제조사 N", "제조사 O",
    ];

    const manufacturerIndex = Math.floor(Math.random() * manufacturers.length);
    const categoryIndex = Math.floor(Math.random() * categories.length);

    let productName;
    do {
        productName = productNames[Math.floor(Math.random() * productNames.length)];
    } while (usedProductNames.has(productName));  // 이미 사용된 제품 이름 체크

    usedProductNames.add(productName);  // 사용된 제품 이름 추가

    return {
        productId: `P${String(id).padStart(4, '0')}`,  // 4자리로 맞추기
        productName: productName,
        price: Math.floor(Math.random() * 2000000) + 10000,  // 10,000 ~ 2,000,000 사이의 가격
        category: categories[categoryIndex],
        manufacturer: manufacturers[manufacturerIndex] + getRandomLetter() + getRandomLetter(),  // 제조사 이름 뒤에 임의의 알파벳 추가
    };
}

const randomProducts = [];
const usedProductNames = new Set();  // 사용된 제품 이름을 저장할 Set

for (let i = 1; i <= 9999; i++) {  // 1부터 9999까지
    randomProducts.push(generateRandomProduct(i, usedProductNames));
}

console.log(randomProducts); // 생성된 제품 배열을 콘솔에 출력
