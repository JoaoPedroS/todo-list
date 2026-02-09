import { TodoItem } from '../entities/todo-item.entity';

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface TodoRepository {
  findById(id: string): Promise<TodoItem | null>;
  save(todo: TodoItem): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(
    params: PaginationParams,
  ): Promise<PaginatedResult<TodoItem>>;
}
