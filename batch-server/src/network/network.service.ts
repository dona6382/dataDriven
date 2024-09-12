import { Injectable } from '@nestjs/common';
import { ConsoleLogger } from '../log/console.logger.service';
import ky from '@toss/ky';

interface RequestOptions {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  url: string;
  headers?: Record<string, string>;
  data?: any;
}

@Injectable()
export class NetworkService {
  constructor(private readonly logger: ConsoleLogger) {}

  private static getRetryCount(port: number): number {
    switch (port) {
      default:
        return 0;
    }
  }

  private static async sendRequestWithRetry(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    options: any,
    retryCount: number,
    logger: ConsoleLogger,
  ): Promise<any> {
    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        if (attempt > 0) {
          const context: any = {};
          if (options) {
            context.options = options;
          }
          await logger.warn(`Retry attempt ${attempt} for url ${url}`, {
            context,
          });
        }

        switch (method) {
          case 'get':
            return await ky.get(url, options);
          case 'post':
            return await ky.post(url, options);
          case 'put':
            return await ky.put(url, options);
          case 'delete':
            return await ky.delete(url, options);
          case 'patch':
            return await ky.patch(url, options);
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
      } catch (error) {
        if (attempt === retryCount) {
          throw error;
        }
      }
    }
  }

  private async logRequest(method: string, url: string, options: any) {
    const context: any = options ? { options } : {};
    await this.logger.log(`method = ${method}, url = ${url}`, { context });
  }

  private async logError(
    method: string,
    url: string,
    error: Error,
    data?: any,
  ) {
    const errorMessage = `Request failed. method = ${method}, url = ${url}`;
    const context: any = {
      error: error.message,
      ...(data && { body: JSON.stringify(data) }),
    };
    await this.logger.error(errorMessage, error.stack, { context });
  }

  async sendNetworkRequest({
    method,
    url,
    headers,
    data,
  }: RequestOptions): Promise<any> {
    try {
      const port = new URL(url).port ? parseInt(new URL(url).port) : 0;
      const retryCount = NetworkService.getRetryCount(port);

      const options = {
        headers,
        body: data ? JSON.stringify(data) : undefined,
      };

      const response = await NetworkService.sendRequestWithRetry(
        method,
        url,
        options,
        retryCount,
        this.logger,
      );

      await this.logRequest(method, url, options);

      const contentType = response.headers?.get('content-type');

      if (contentType?.includes('application/json')) {
        return await response.json();
      } else if (contentType?.includes('text/')) {
        return await response.text();
      } else {
        return await response.blob();
      }
    } catch (error) {
      await this.logError(method, url, error, data);
    }
  }
}
