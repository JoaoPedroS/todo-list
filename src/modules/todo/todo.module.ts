import { Module } from '@nestjs/common';
import { CreateTodoUseCase } from './application/use-cases/create-todo.usecase';
import { ListTodosUseCase } from './application/use-cases/list-todos.usecase';
import { TodoController } from './infrastructure/controllers/todo.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TodoModel } from './infrastructure/models/todo.model';
import { TodoDependencyModel } from './infrastructure/models/todo-dependency.model';
import {
  TODO_REPOSITORY,
  TypeOrmTodoRepository,
} from './infrastructure/persistence/todo.repository.impl';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TodoModel, TodoDependencyModel])],
  controllers: [TodoController],
  providers: [
    CreateTodoUseCase,
    ListTodosUseCase,
    {
      provide: TODO_REPOSITORY,
      useFactory: (
        todoRepo: Repository<TodoModel>,
        depRepo: Repository<TodoDependencyModel>,
      ) => {
        return new TypeOrmTodoRepository(todoRepo, depRepo);
      },
      inject: [
        getRepositoryToken(TodoModel),
        getRepositoryToken(TodoDependencyModel),
      ],
    },
  ],
})
export class TodoModule {}
