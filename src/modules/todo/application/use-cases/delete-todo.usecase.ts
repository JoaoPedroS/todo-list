import { Inject } from '@nestjs/common';
import * as todoRepository from '../../domain/repositories/todo.repository';
import { TODO_REPOSITORY } from '../../infrastructure/database/persistence/todo.repository.impl';

export class DeleteTodoUseCase {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly repo: todoRepository.TodoRepository,
  ) {}

  async execute(id: string) {
    return this.repo.delete(id);
  }
}
