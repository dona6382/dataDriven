import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    let successMessage = '[SUCCESS] 조회 성공';

    switch (method) {
      case 'POST':
        successMessage = '[SUCCESS] 생성 성공';
        break;
      case 'PATCH':
        successMessage = '[SUCCESS] 수정 성공';
        break;
      case 'DELETE':
        successMessage = '[SUCCESS] 삭제 성공';
        break;
      // GET의 경우 기본 메시지를 사용
    }

    return next.handle().pipe(
      map((data) => ({
        errYn: 'N',
        msg: successMessage,
        data, // 실제 데이터는 data 필드에 포함
      })),
      catchError((err) => {
        const { message, stack } = err;
        let errorMessage = '[ERROR] 요청 처리 중 오류 발생';

        if (err instanceof HttpException) {
          errorMessage = err.message;
        } else if (err instanceof BadRequestException) {
          errorMessage = '[ERROR] 잘못된 요청';
        } else if (err instanceof UnauthorizedException) {
          errorMessage = '[ERROR] 권한 없음';
        } else if (err instanceof NotFoundException) {
          errorMessage = '[ERROR] 리소스를 찾을 수 없음';
        } else if (err instanceof InternalServerErrorException) {
          errorMessage = '[ERROR] 서버 오류';
        }

        this.logger.error(`[ERROR] Exception thrown: ${message}`);
        this.logger.error(`[ERROR] Stack trace: ${stack}`);
        this.logger.error(`[ERROR] Request URL: ${request.url}`);
        this.logger.error(
          `[ERROR] Request Body: ${JSON.stringify(request.body)}`,
        );

        return throwError(
          () =>
            new HttpException(
              {
                errYn: 'Y',
                msg: errorMessage,
              },
              err instanceof HttpException
                ? err.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
