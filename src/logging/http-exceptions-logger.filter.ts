import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from 'winston';
import { formatISO } from 'date-fns';
import generateErrorBasedOnCurrentEnvironment from '../utils/LoggingUtils/generateErrorBasedOnEnvironment';

@Catch()
export class AllExceptionsFilterLogger implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { headers, method, originalUrl, url } = ctx.getRequest();
    delete headers.authorization;
    const { message, stack } = exception;

    this.logger.error({
      message,
      request: {
        headers,
        method,
        originalUrl,
      },
      stack,
      timestamp: formatISO(Date.now()),
    });

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorToBeReturned = generateErrorBasedOnCurrentEnvironment(
      status,
      message,
      stack,
      url,
      process.env.NODE_ENV,
    );

    response.status(status).json(errorToBeReturned);
  }
}
