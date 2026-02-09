import { Test, TestingModule } from '@nestjs/testing';
import { Todo } from './todo.provider';

describe('Todo', () => {
  let provider: Todo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Todo],
    }).compile();

    provider = module.get<Todo>(Todo);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
