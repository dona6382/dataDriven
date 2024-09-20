# DATA-DRIVEN

데이터를 배치로 수집, 변환, 저장할 수 있는 애플리케이션과 이를 지원하는 API 서버입니다.

## 목적

- 대용량 데이터 처리를 위한 데이터 처리 서버 및 데이터 생성 서버

## 요구사항
- Node.js 18.12
- TypeScript
- NestJs

## 데이터 정의

- **[productDetails](data-server/src/type/product-details.ts)**
- **[productReviews](data-server/src/type/product-reviews.ts)**
- **[productOverview](data-server/src/type/product-overview.ts)**

`ProductDetails`의 정보를 활용하여 `ProductReviews`를 조회하고, 이를 기반으로 `ProductOverview`를 구성합니다.

## 진행 상황

### data-server (완료)
- [개발 완료] `productDetails`, `productReviews` 임의 데이터 생성 API
- [개발 완료] `productDetails`, `productReviews` 데이터 조회 API 

### batch-server (개발 진행 중)
- 진행 중
- [개발 완료] 로그
- [개발 완료] HTTP 요청 공통부분
- [개발 완료] product details 데이터 수집


## 실행 방법

1. **npm 설치**
   ```bash
   npm install

2. **데이터 서버 실행**
- 5001번 port 사용
   ```bash   
   npm run start:data-server

3. **⚡️ 초기실행 하는 경우라면 샘플 데이터 생성 ⚡️**
- [data-server 서버 관련](#data-server-서버)

4. **데이터 처리 어플리케이션 실행**
- 

## data-server 서버 
- `실행방법` 2번 `데이터 서버 실행`후 생성 가능
- swagger 참고 [http://localhost:5001/api-docs](http://localhost:5001/api-docs/)
### `productDetails` 샘플 데이터 생성
- 데이터 서버 실행 후: [http://localhost:5001/api/product-details](http://localhost:5001/api/product-details)

### `productReviews` 샘플 데이터 생성
- 데이터 서버 실행 후: [http://localhost:5001/api/product-reviews](http://localhost:5001/api/product-reviews)
