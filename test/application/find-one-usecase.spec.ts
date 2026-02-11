import { FindOneUseCase } from '../../src/modules/todo/application/use-cases/find-one.usecase';
import * as todoRepository from '../../src/modules/todo/domain/repositories/todo.repository';

describe('FindOneUseCase', () => {
  let useCase: FindOneUseCase;
  let mockRepo: Partial<todoRepository.TodoRepository>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new FindOneUseCase(mockRepo as todoRepository.TodoRepository);
    jest.clearAllMocks();
  });

  it('deve retornar o todo pelo id', async () => {
    const todo = { id: '1', title: 'Test' };
    (mockRepo.findById as jest.Mock).mockResolvedValueOnce(todo);

    const result = await useCase.execute('1');

    expect(result).toEqual(todo);
    expect(mockRepo.findById).toHaveBeenCalledWith('1');
  });
});
