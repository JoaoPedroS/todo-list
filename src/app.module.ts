import { Module } from '@nestjs/common';
import { TodoModule } from './modules/todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './modules/todo/infrastructure/database/typeorm.config';

@Module({
  imports: [TodoModule, TypeOrmModule.forRoot(typeOrmConfig())],
})
export class AppModule {}
