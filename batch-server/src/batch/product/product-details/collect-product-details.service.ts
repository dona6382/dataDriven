import { Inject, Injectable } from '@nestjs/common';
import { NetworkService } from '../../../network/network.service';
import { Logger } from '../../../log/type/logger';

@Injectable()
export class CollectProductDetailsService {
    constructor(
        @Inject('Logger')
        private readonly logger: Logger,
        private readonly networkService: NetworkService,
    ) {}

    private readonly ports = [5001];
    private readonly pageSize = 10;
    private readonly sleepTime = 500; //ms

    async collectProductDetails() {
        const allPortData = await Promise.all(
            this.ports.map((port) => this.fetchData(port)),
        );

        const result = this.ports.reduce((acc, port, index) => {
            acc[port] = allPortData[index];
            return acc;
        }, {});

        return result;
    }

    private async fetchData(port: number) {
        try {
            const initialResponse = await this.sendRequest(port, 1);
            const { lastPage, responseData, isHasNextPage } = await this.handleResponse(
                port,
                initialResponse,
            );

            this.logger.log(`Port ${port}: 총 ${lastPage} 페이지 존재`, {
                context: { port, lastPage },
            });

            if (isHasNextPage) {
                const additionalData = await this.fetchAdditionalData(
                    port,
                    lastPage,
                );
                responseData.push(...additionalData);
            }

            return responseData;
        } catch (error) {
            this.logger.error(`Error fetching data for port ${port}:`, error.stack, {
                context: { port, error: error.message },
            });
            return [];
        }
    }

    private async handleResponse(port: number, response: any) {
        switch (port) {
            case 5001:
                return this.handlePort5001(response);
            default:
                return { lastPage: 0, responseData: [], isHasNextPage: false };
        }
    }

    private handlePort5001(response: any) {
        try {
            //todo erryn이 n일때의 처리 추가
            const lastPage = response.data.lastPage;
            const responseData = [response.data];
            return { lastPage, responseData, isHasNextPage: lastPage > 1 };
        } catch (error) {
            this.logger.error(
                `Error while handling port 5001 response: ${error.message}`,
                error.stack,
                {},
            );
            return { lastPage: 0, responseData: [], isHasNextPage: false };
        }
    }

    private async fetchAdditionalData(port: number, totalPageCnt: number) {
        const allData = [];

        for (let page = 2; ; page = page + this.pageSize) {
            try {
                const additionalPagesData = await this.fetchAdditionalPages(
                    port,
                    page,
                    totalPageCnt,
                );


                const handledData = await Promise.all(
                    additionalPagesData.map(async (response) => {
                        try {
                            if (response !== undefined) {
                                const res = await this.handleResponse(port, response);

                                // return res.data[0];
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

                allData.push(...handledData.filter((data) => data !== undefined)); // 간혹가다 retry횟수를 넘어서까지 실패해서 undefined인 케이스 존재 => 제외

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
        totalPageCnt?: number,
    ) {
        const pageRequests = [];

        for (let i = 0; i < this.pageSize && startPage + i <= totalPageCnt; i++) {
            const page = startPage + i;
            pageRequests.push(this.sendRequest(port, page));
        }

        return await Promise.all(pageRequests);
    }

    private sendRequest(port: number, page: number) {
        const url = `http://localhost:${port}/api/product-details`;

        let options;

        options = {
            method: 'get',
            url: `${url}?page=${page}`,
        };

        return this.networkService.sendNetworkRequest(options);
    }

    private sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}