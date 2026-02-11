import { Module } from '@nestjs/common';
import { CreateTodoUseCase } from './application/use-cases/create-todo.usecase';
import { ListTodosUseCase } from './application/use-cases/list-todos.usecase';
import { TodoController } from './infrastructure/controllers/todo.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TodoModel } from './infrastructure/database/models/todo.model';
import { TodoDependencyModel } from './infrastructure/database/models/todo-dependency.model';
import {
  TODO_REPOSITORY,
  TypeOrmTodoRepository,
} from './infrastructure/database/persistence/todo.repository.impl';
import { DataSource, Repository } from 'typeorm';
import { FindOneUseCase } from './application/use-cases/find-one.usecase';
import { DeleteTodoUseCase } from './application/use-cases/delete-todo.usecase';
import { UpdateTodoUseCase } from './application/use-cases/update-todo.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([TodoModel, TodoDependencyModel])],
  controllers: [TodoController],
  providers: [
    CreateTodoUseCase,
    ListTodosUseCase,
    FindOneUseCase,
    DeleteTodoUseCase,
    UpdateTodoUseCase,
    {
      provide: TODO_REPOSITORY,
      useFactory: (
        todoRepo: Repository<TodoModel>,
        depRepo: Repository<TodoDependencyModel>,
        dataSource: DataSource,
      ) => {
        return new TypeOrmTodoRepository(todoRepo, depRepo, dataSource);
      },
      inject: [
        getRepositoryToken(TodoModel),
        getRepositoryToken(TodoDependencyModel),
        DataSource,
      ],
    },
  ],
})
export class TodoModule {}
