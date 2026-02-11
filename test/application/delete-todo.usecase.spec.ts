import { DeleteTodoUseCase } from '../../src/modules/todo/application/use-cases/delete-todo.usecase';
import * as todoRepository from '../../src/modules/todo/domain/repositories/todo.repository';

describe('DeleteTodoUseCase', () => {
  let useCase: DeleteTodoUseCase;
  let mockRepo: Partial<todoRepository.TodoRepository>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new DeleteTodoUseCase(mockRepo as todoRepository.TodoRepository);
    jest.clearAllMocks();
  });

  it('deve chamar delete no repositório', async () => {
    (mockRepo.delete as jest.Mock).mockResolvedValueOnce({ deleted: true });

    const result = await useCase.execute('1');

    expect(result).toEqual({ deleted: true });
    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });
});
