import * as path from 'path';
import * as dotenv from 'dotenv';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

const env = process.env.NODE_ENV || 'development';
const dotenv_path = path.resolve(process.cwd(), `.${env}.env`);
const result = dotenv.config({ path: dotenv_path });
if (result.error) {
  console.log('Cannot resolve any environment variable file');
}

const logging: any =
  process.env.DB_LOGGING === 'true'
    ? true
    : process.env.DB_LOGGING === 'false'
    ? false
    : [process.env.DB_LOGGING];

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  migrationsRun: true,
  url: process.env.DB_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'postgres',
  synchronize: (process.env.DB_SYNC === 'true' ? true : false) || false,
  logging: logging || false,
  // Extra connection options to be passed to the underlying driver (pg).
  extra: {
    // max pool size connections
    max: process.env.DB_POOL_SIZE || 3,
    // connection timeout
    connectionTimeoutMillis: 1000,
  },
  entities: [process.env.DB_ENTITIES || 'dist/**/*.entity{.ts,.js}'],
  migrations: [process.env.DB_MIGRATIONS || 'dist/**/shared/migrations/*.js'],
  subscribers: [process.env.DB_SUBSCRIBERS || 'dist/**/subscriber/*.js'],
  cli: {
    entitiesDir: 'src/**/entity',
    migrationsDir: 'src/shared/migrations',
    subscribersDir: 'src/shared/subscribers',
  },
};

export default config;
