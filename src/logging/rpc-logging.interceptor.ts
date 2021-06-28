import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Logger } from 'winston';
import * as dayjs from 'dayjs';

@Injectable()
export class RpcLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const rpcData = rpcContext.getData();
    const start = dayjs();
    // const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const end = dayjs();
        this.logger.info({
          ...rpcData,
          timestamp: dayjs(start).format(),
          responseTime: end.diff(start),
        });
      }),
    );
  }
}
