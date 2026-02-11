import { ListTodosUseCase } from '../../src/modules/todo/application/use-cases/list-todos.usecase';
import * as todoRepository from '../../src/modules/todo/domain/repositories/todo.repository';

describe('ListTodosUseCase', () => {
  let useCase: ListTodosUseCase;
  let mockRepo: Partial<todoRepository.TodoRepository>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new ListTodosUseCase(mockRepo as todoRepository.TodoRepository);
    jest.clearAllMocks();
  });

  it('deve retornar todos os todos paginados', async () => {
    const todos = [{ id: '1', title: 'Todo 1' }];
    (mockRepo.findAll as jest.Mock).mockResolvedValueOnce(todos);

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result).toEqual(todos);
    expect(mockRepo.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });
});
