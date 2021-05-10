import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from 'winston';
import { formatISO } from 'date-fns';

@Catch()
export class AllExceptionsFilterLogger implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  generateErrorBasedOnCurrentEnvironment(
    status: number,
    message: string,
    stack,
    url,
  ) {
    const currentEnvironment = process.env.NODE_ENV;
    let expectedErrorToBeReturned = {};

    if (currentEnvironment != 'production') {
      expectedErrorToBeReturned = {
        statusCode: status,
        message: message,
        stack,
        timestamp: formatISO(Date.now()),
        path: url,
      };
    } else {
      if (status >= 500) {
        message = 'Internal Server Error';
      }

      expectedErrorToBeReturned = {
        statusCode: status,
        message,
        timestamp: formatISO(Date.now()),
      };
    }

    return expectedErrorToBeReturned;
  }

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

    const errorToBeReturned = this.generateErrorBasedOnCurrentEnvironment(
      status,
      message,
      stack,
      url,
    );

    response.status(status).json(errorToBeReturned);
  }
}
