import { Inject } from '@nestjs/common';
import * as todoRepository from '../../domain/repositories/todo.repository';
import { TODO_REPOSITORY } from '../../infrastructure/database/persistence/todo.repository.impl';

interface UpdateTodoInput {
  title: string;
  date: Date;
  id: string;
}

export class UpdateTodoUseCase {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly repo: todoRepository.TodoRepository,
  ) {}

  async execute(input: UpdateTodoInput) {
    const { title, date, id } = input;

    const todo = await this.repo.findById(id);
    if (todo) {
      todo.title = title;
      if (date) {
        todo.updateDate(date);
      }

      await this.repo.save(todo);
    }
  }
}
