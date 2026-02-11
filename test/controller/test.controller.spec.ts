import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDto } from '../../src/modules/todo/application/dtos/create-todo.dto';
import { UpdateTodoDto } from '../../src/modules/todo/application/dtos/update-todo.usecase';
import { CreateTodoUseCase } from '../../src/modules/todo/application/use-cases/create-todo.usecase';
import { DeleteTodoUseCase } from '../../src/modules/todo/application/use-cases/delete-todo.usecase';
import { FindOneUseCase } from '../../src/modules/todo/application/use-cases/find-one.usecase';
import { ListTodosUseCase } from '../../src/modules/todo/application/use-cases/list-todos.usecase';
import { UpdateTodoUseCase } from '../../src/modules/todo/application/use-cases/update-todo.usecase';
import { TodoController } from '../../src/modules/todo/infrastructure/controllers/todo.controller';

describe('TodoController', () => {
  let controller: TodoController;

  const mockCreateUseCase = { execute: jest.fn() };
  const mockUpdateUseCase = { execute: jest.fn() };
  const mockListUseCase = { execute: jest.fn() };
  const mockFindOneUseCase = { execute: jest.fn() };
  const mockDeleteUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        { provide: CreateTodoUseCase, useValue: mockCreateUseCase },
        { provide: UpdateTodoUseCase, useValue: mockUpdateUseCase },
        { provide: ListTodosUseCase, useValue: mockListUseCase },
        { provide: FindOneUseCase, useValue: mockFindOneUseCase },
        { provide: DeleteTodoUseCase, useValue: mockDeleteUseCase },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve criar um todo', async () => {
    const dto: CreateTodoDto = {
      title: 'New Todo',
      date: '2026-02-11',
      dependencyIds: [],
    };

    const todo = { id: '1', title: dto.title, date: new Date(dto.date) };
    mockCreateUseCase.execute.mockResolvedValue(todo);

    const result = await controller.create(dto);
    expect(result).toEqual({
      id: '1',
      title: dto.title,
      date: new Date(dto.date),
    });
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith({
      title: dto.title,
      date: new Date(dto.date),
      dependencyIds: [],
    });
  });

  it('deve atualizar um todo', async () => {
    const dto: UpdateTodoDto = {
      id: '1',
      title: 'Updated Todo',
      date: '2026-02-12',
    };
    const updated = { id: dto.id, title: dto.title, date: new Date(dto.date) };

    mockUpdateUseCase.execute.mockResolvedValue(updated);

    const result = await controller.update(dto);
    expect(result).toEqual(updated);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      id: dto.id,
      title: dto.title,
      date: new Date(dto.date),
    });
  });

  it('deve listar todos', async () => {
    const todos = [
      { id: '1', title: 'Todo 1', date: new Date() },
      { id: '2', title: 'Todo 2', date: new Date() },
    ];
    mockListUseCase.execute.mockResolvedValue(todos);

    const result = await controller.list(1, 10);
    expect(result).toEqual(todos);
    expect(mockListUseCase.execute).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
    });
  });

  it('deve retornar um todo especifico', async () => {
    const todo = { id: '1', title: 'Todo 1', date: new Date() };
    mockFindOneUseCase.execute.mockResolvedValue(todo);

    const result = await controller.find('1');
    expect(result).toEqual(todo);
    expect(mockFindOneUseCase.execute).toHaveBeenCalledWith('1');
  });

  it('deve deletar um todo', async () => {
    mockDeleteUseCase.execute.mockResolvedValue({ deleted: true });

    const result = await controller.delete('1');
    expect(result).toEqual({ deleted: true });
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith('1');
  });
});
