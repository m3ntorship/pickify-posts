import { Catch, RpcExceptionFilter, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Logger } from 'winston';
import { getNow } from '../utils/datetime';

@Catch()
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  constructor(private readonly logger: Logger) {}
  catch(exception: any): Observable<any> {
    // In case of HttpException (as validation pipe throws HttpException)
    if (exception.getStatus) {
      const { stack, name } = exception as HttpException;

      const { message } = exception.getResponse() as {
        message: string | string[];
        statusCode: number;
        error: string;
      };

      // Add logging
      this.logger.error({
        Error: 'RpcException validation error',
        message,
        stack,
        timestamp: getNow(),
      });
      return throwError(name);
    }

    // In case of RPCException for all other exceptions
    if (exception.getError) {
      const { name, stack, message } = exception as RpcException;

      // Add logging
      this.logger.error({
        Error: 'RpcException Error',
        message,
        stack,
        timestamp: getNow(),
      });
      return throwError(name);
    }
  }
}
