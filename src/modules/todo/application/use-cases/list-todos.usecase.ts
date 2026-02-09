import { Inject } from '@nestjs/common';
import * as todoRepository from '../../domain/repositories/todo.repository';
import { TODO_REPOSITORY } from '../../infrastructure/persistence/todo.repository.impl';

interface ListTodosInput {
  page: number;
  limit: number;
}

export class ListTodosUseCase {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly repo: todoRepository.TodoRepository
) {}

  async execute({ page, limit }: ListTodosInput) {
    return this.repo.findAll({ page, limit });
  }
}