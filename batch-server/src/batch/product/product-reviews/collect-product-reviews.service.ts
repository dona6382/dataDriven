import { Inject, Injectable } from '@nestjs/common';
import { NetworkService } from '../../../network/network.service';
import { Logger } from '../../../log/type/logger';

@Injectable()
export class CollectProductReviewsService {
    constructor(
        @Inject('Logger')
        private readonly logger: Logger,
        private readonly networkService: NetworkService,
    ) {}

    private readonly ports = [5001];
    private readonly pageSize = 1; // 동일한 store, date에 대해서 여러페이지 요청
    private readonly sleepTime = 200; // ms
    private readonly chunkSize = 1; // storeid기준 chunk

    async collectProductReviewsService(uniqueProductDetails) {
        const allPortData = await Promise.all(
            this.ports.map((port) => this.fetchData(port, uniqueProductDetails)),
        );

        const result = this.ports.reduce((acc, port, index) => {
            acc[port] = allPortData[index];
            return acc;
        }, {});

        return result;
    }

    private chunkArray<T>(array: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }

    private async fetchData(port: number, uniqueProductDetails: any[]) {
        const allData = [];
        const productDetailGroups = this.chunkArray(
            uniqueProductDetails,
            this.chunkSize,
        );

        for (const group of productDetailGroups) {
            const groupData = await Promise.all(
                group.map(async (productDetail) => {
                    try {
                        const { productId } = productDetail;
                        const initialResponse = await this.sendRequest(
                            port,
                            1,
                            productId,
                        );
                        const { totalPageCnt, data, isHasNextPage } =
                            await this.handleResponse(port, initialResponse);

                        if (isHasNextPage) {
                            const additionalData = await this.fetchAdditionalData(
                                port,
                                totalPageCnt,
                                productId,
                            );
                            data.push(...additionalData);
                        }

                        return data;
                    } catch (error) {
                        this.logger.error(
                            `Error processing transaction for storeId ${productDetail.productId}: ${error.message}`,
                            error.stack,
                            {
                                context: {
                                    port,
                                    productId: productDetail.productId,
                                },
                            },
                        );
                        return [];
                    }
                }),
            );

            groupData.forEach((data) => allData.push(...data));
        }

        return allData;
    }

    private async handleResponse(port: number, response: any) {
        switch (port) {
            case 5001:
                return this.handlePort5001(response);
        }
    }

    private handlePort5001(response: any) {
        try {
            //todo erryn이 n일때의 처리 추가
            const responseData = response.data;
            const totalPageCnt = responseData.totalPage;
            const data = responseData.dataList;
            return { totalPageCnt, data, isHasNextPage: totalPageCnt > 1 };
        } catch (error) {
            return {
                totalPageCnt: 0,
                data: [],
                isHasNextPage: false,
                error: error.message,
            };
        }
    }

    private async fetchAdditionalData(
        port: number,
        totalPageCnt: number,
        productId: string,
    ) {
        const allData = [];

        for (let page = 2; ; page = page + this.pageSize) {
            try {
                const additionalPagesData = await this.fetchAdditionalPages(
                    port,
                    page,
                    totalPageCnt,
                    productId,
                );

                const handledData = await Promise.all(
                    additionalPagesData.map(async (response) => {
                        try {
                            if (response !== undefined) {
                                const res = await this.handleResponse(port, response);
                                return res.data[0];
                            }
                        } catch (error) {
                            this.logger.error(
                                `Error handling response: ${error.message}`,
                                error.stack,
                                {
                                    context: { port, response },
                                },
                            );
                            return null;
                        }
                    }),
                );

                allData.push(...handledData.filter((data) => data !== null));

                if (page >= totalPageCnt) {
                    this.logger.log(
                        `Port ${port}: 마지막 페이지 요청 (페이지 ${totalPageCnt})`,
                        { context: { port, totalPageCnt } },
                    );
                    break;
                }

                await this.sleep(this.sleepTime);
            } catch (error) {
                this.logger.error(
                    `Error fetching additional pages: ${error.message}`,
                    error.stack,
                    {
                        context: { error: error.message },
                    },
                );
                break;
            }
        }

        return allData;
    }

    private async fetchAdditionalPages(
        port: number,
        startPage: number,
        totalPageCnt: number,
        productId: string,
    ) {
        const pageRequests = [];

        for (let i = 0; i < this.pageSize && startPage + i <= totalPageCnt; i++) {
            const page = startPage + i;
            pageRequests.push(this.sendRequest(port, page, productId));
        }

        return await Promise.all(pageRequests);
    }

    private sendRequest(
        port: number,
        page: number,
        productId: string,
    ) {
        const url = `http://localhost:${port}/api/product-reviews?productId=${productId}&page=${page}`;

        let options;

        if (port === 5001) {
            options = {
                method: 'get',
                url: url,
                headers: { 'Content-Type': 'application/json' },
            };
        }

        return this.networkService.sendNetworkRequest(options);
    }

    private sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
