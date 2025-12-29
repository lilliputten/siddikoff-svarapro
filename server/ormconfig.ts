import path from 'path';
import dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

const dirName = process.cwd();

const dotenvOptions: dotenv.DotenvConfigOptions = {
  path: [
    // Using root `.env` file
    path.resolve(dirName, '..', '.env'),
    // Using current folder's `.env` file
    path.resolve(dirName, '.env'),
  ],
};
dotenv.config(dotenvOptions); // Загружаем переменные окружения

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  synchronize: false, // Отключаем для продакшена
  logging: process.env.NODE_ENV === 'development',
};
export default new DataSource(dataSourceOptions);
