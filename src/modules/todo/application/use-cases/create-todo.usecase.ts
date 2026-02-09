import * as todoRepository from '../../domain/repositories/todo.repository';
import { TodoItem } from '../../domain/entities/todo-item.entity';
import { Inject } from '@nestjs/common';
import { TODO_REPOSITORY } from '../../infrastructure/persistence/todo.repository.impl';

interface CreateTodoInput {
  title: string;
  date: Date;
  dependencyIds?: string[];
}

export class CreateTodoUseCase {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: todoRepository.TodoRepository,
  ) {}

  async execute(input: CreateTodoInput): Promise<TodoItem> {
    const { title, date, dependencyIds = [] } = input;

    const dependencies: TodoItem[] = [];

    for (const dependencyId of dependencyIds) {
      const dependency = await this.todoRepository.findById(dependencyId);

      if (!dependency) {
        throw new Error(`Dependency ${dependencyId} not found`);
      }

      dependencies.push(dependency);
    }

    const todo = TodoItem.create(title, date);

    for (const dependency of dependencies) {
      dependency.addDependent(todo);
      await this.todoRepository.save(dependency);
    }

    await this.todoRepository.save(todo);

    return todo;
  }
}
