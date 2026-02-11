import { UpdateTodoUseCase } from '../../src/modules/todo/application/use-cases/update-todo.usecase';
import * as todoRepository from '../../src/modules/todo/domain/repositories/todo.repository';
import { TodoItem } from '../../src/modules/todo/domain/entities/todo-item.entity';

describe('UpdateTodoUseCase', () => {
  let useCase: UpdateTodoUseCase;
  let mockRepo: Partial<todoRepository.TodoRepository>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new UpdateTodoUseCase(mockRepo as todoRepository.TodoRepository);
    jest.clearAllMocks();
  });

  it('deve atualizar título e data se todo existir', async () => {
    const todo = TodoItem.create('Old Title', new Date());
    (mockRepo.findById as jest.Mock).mockResolvedValueOnce(todo);

    const input = { id: '1', title: 'New Title', date: new Date() };
    await useCase.execute(input);

    expect(todo.title).toBe(input.title);
    expect(mockRepo.save).toHaveBeenCalledWith(todo);
  });

  it('não deve fazer nada se todo não existir', async () => {
    (mockRepo.findById as jest.Mock).mockResolvedValueOnce(null);

    const input = { id: '1', title: 'New Title', date: new Date() };
    await useCase.execute(input);

    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
