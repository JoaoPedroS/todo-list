import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateTodoUseCase } from '../../application/use-cases/create-todo.usecase';
import { CreateTodoDto } from '../../application/dtos/create-todo.dto';
import { ListTodosUseCase } from '../../application/use-cases/list-todos.usecase';
import { FindOneUseCase } from '../../application/use-cases/find-one.usecase';
import { DeleteTodoUseCase } from '../../application/use-cases/delete-todo.usecase';
import { UpdateTodoDto } from '../../application/dtos/update-todo.usecase';
import { UpdateTodoUseCase } from '../../application/use-cases/update-todo.usecase';

@Controller('todos')
export class TodoController {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly listTodosUseCase: ListTodosUseCase,
    private readonly findOneUseCase: FindOneUseCase,
    private readonly deleteTodoUseCase: DeleteTodoUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateTodoDto) {
    console.log(dto);
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

  @Put()
  async update(@Body() dto: UpdateTodoDto) {
    console.log(dto);
    const todo = await this.updateTodoUseCase.execute({
      title: dto.title,
      date: new Date(dto.date),
      id: dto.id,
    });

    return todo;
  }

  @Get()
  async list(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.listTodosUseCase.execute({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return this.findOneUseCase.execute(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleteTodoUseCase.execute(id);
  }
}
