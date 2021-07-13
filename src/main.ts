import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import * as winston from 'winston';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { AllExceptionsFilterLogger } from './shared/exception-filters/http-exceptions-logger.filter';
import { winstonLoggerOptions } from './logging/winston.options';
import { HttpLoggingInterceptor } from './logging/http-logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create application listens for HTTP requests
  const app = await NestFactory.create(AppModule);

  // load all env variable
  config();

  // initialize configService to get data from it
  const configService = app.get(ConfigService);

  // Make the application a microservice also
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('rabbitURL') as string],
      queue: configService.get('rabbitMediaQueue') as string,
      queueOptions: {
        // the queue will survive broker restarts
        durable: true,
      },
    },
  });

  // add global prefix to all endpoints
  app.setGlobalPrefix('api');

  // add global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Enable cors
  app.enableCors();

  // Helmet
  app.use(helmet());

  // Rate limit
  // Ahmed: disabled it as it casues some inconvinences during development
  // should have a look before publishing the service live
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //   }),
  // );

  // Compression
  app.use(compression());

  // Cookie parser
  app.use(cookieParser());

  const logger = winston.createLogger(winstonLoggerOptions);
  app.useGlobalInterceptors(new HttpLoggingInterceptor(logger));
  app.useGlobalFilters(new AllExceptionsFilterLogger(logger));

  app.use('/health', (req: any, res: any) => {
    res.send({ status: true });
  });

  // get port from configService
  const port = configService.get('port');

  // start microservices
  await app.startAllMicroservicesAsync();

  // start http app
  await app.listen(port);
}
bootstrap();
