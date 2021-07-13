import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Logger } from 'winston';
import { getNow } from '../shared/utils/datetime';

@Injectable()
export class RpcLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const rpcData = rpcContext.getData();

    // log when to receive the broker message
    this.logger.info('rabbitMQ media message received successfully', {
      data: rpcData,
      timestamp: getNow(),
    });
    return next.handle().pipe(
      tap(() => {
        /** */
      }),
    );
  }
}
