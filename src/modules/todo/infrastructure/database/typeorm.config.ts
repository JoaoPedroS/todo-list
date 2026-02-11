import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: 'localhost',
    port: Number(process.env.DB_PORT),
    username: 'postgres',
    password: 'postgres',
    database: 'todo-list',
    autoLoadEntities: true,
    synchronize: true,
    extra: {
      timezone: 'America/Sao_Paulo',
    },
  };
}
