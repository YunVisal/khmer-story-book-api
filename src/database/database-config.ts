import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import {
  DB_HOST_CONFIG_KEY,
  DB_NAME_CONFIG_KEY,
  DB_PASSWORD_CONFIG_KEY,
  DB_USERNAME_CONFIG_KEY,
  DB_TYPE,
} from '../app.config';

config({ path: `.env.${process.env.NODE_ENV}` });

const configService = new ConfigService();
const isTsRuntime = __filename.endsWith('.ts');
const entitiesPath = isTsRuntime ? 'src/**/*.entity.ts' : 'dist/**/*.entity.js';
const migrationsPath = isTsRuntime
  ? 'db/migrations/**/*.ts'
  : 'db/migrations/**/*.js';

export const AppDataSourceOption: DataSourceOptions = {
  type: DB_TYPE,
  host: configService.get<string>(DB_HOST_CONFIG_KEY),
  username: configService.get<string>(DB_USERNAME_CONFIG_KEY),
  password: configService.get<string>(DB_PASSWORD_CONFIG_KEY),
  database: configService.get<string>(DB_NAME_CONFIG_KEY),
  synchronize: false,
  ssl: true,
  entities: [entitiesPath],
  migrations: [migrationsPath],
};

const AppDataSource = new DataSource(AppDataSourceOption);

export default AppDataSource;
