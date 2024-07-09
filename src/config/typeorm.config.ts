import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from 'config';

interface dbConfig {
  username: string;
  password: string;
  database?: string;
}

const dbConfig: dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: dbConfig.username,
  password: String(dbConfig.password),
  database: 'cmstock',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
