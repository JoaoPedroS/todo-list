import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateTodoUseCase } from '../../application/use-cases/create-todo.usecase';
import { CreateTodoDto } from '../../application/dtos/create-todo.dto';
import { ListTodosUseCase } from '../../application/use-cases/list-todos.usecase';

@Controller('todos')
export class TodoController {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly listTodosUseCase: ListTodosUseCase
  ) {}

  @Post()
  async create(@Body() dto: CreateTodoDto) {
    const todo = await this.createTodoUseCase.execute({
      title: dto.title,
      date: new Date(dto.date),
      dependencyIds: dto.dependencyIds,
    });

    return {
      id: todo.id,
      title: todo.title,
      date: todo.date,
    };
  }

  @Get()
  async list(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.listTodosUseCase.execute({
        page: Number(page),
        limit: Number(limit),
    });
  }
}