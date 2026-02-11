import * as todoRepository from '../../domain/repositories/todo.repository';
import { TodoItem } from '../../domain/entities/todo-item.entity';
import { BadRequestException, Inject } from '@nestjs/common';
import { TODO_REPOSITORY } from '../../infrastructure/database/persistence/todo.repository.impl';

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
        throw new BadRequestException(`Dependency ${dependencyId} not found`);
      }

      dependencies.push(dependency);
    }
    const todo = TodoItem.create(title, date);

    await this.todoRepository.save(todo);

    for (const dependency of dependencies) {
      dependency.addDependent(todo);
      await this.todoRepository.save(dependency);
    }

    return todo;
  }
}
