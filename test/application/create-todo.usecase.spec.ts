import { CreateTodoUseCase } from '../../src/modules/todo/application/use-cases/create-todo.usecase';
import * as todoRepository from '../../src/modules/todo/domain/repositories/todo.repository';
import { TodoItem } from '../../src/modules/todo/domain/entities/todo-item.entity';

describe('CreateTodoUseCase', () => {
  let useCase: CreateTodoUseCase;
  let mockRepo: Partial<todoRepository.TodoRepository>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new CreateTodoUseCase(mockRepo as todoRepository.TodoRepository);
    jest.clearAllMocks();
  });

  it('deve criar um todo', async () => {
    const dto = { title: 'Test', date: new Date(), dependencyIds: [] };
    (mockRepo.save as jest.Mock).mockResolvedValueOnce({ ...dto, id: '1' });

    const result = await useCase.execute(dto);

    expect(result).toBeInstanceOf(TodoItem);
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('deve lançar erro se dependência não existir', async () => {
    const dto = { title: 'Test', date: new Date(), dependencyIds: ['dep1'] };
    (mockRepo.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(useCase.execute(dto)).rejects.toThrow(
      `Dependency dep1 not found`,
    );
  });
});
