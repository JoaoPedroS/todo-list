import {
  TodoRepository,
  PaginationParams,
  PaginatedResult,
} from '../../src/modules/todo/domain/repositories/todo.repository';
import { TodoItem } from '../../src/modules/todo/domain/entities/todo-item.entity';

export class InMemoryTodoRepository implements TodoRepository {
  private items = new Map<string, TodoItem>();

  async findById(id: string): Promise<TodoItem | null> {
    return this.items.get(id) ?? null;
  }

  async save(todo: TodoItem): Promise<void> {
    this.items.set(todo.id, todo);
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  async findAll({
    page,
    limit,
  }: PaginationParams): Promise<PaginatedResult<TodoItem>> {
    const all = Array.from(this.items.values());

    const total = all.length;
    const start = (page - 1) * limit;
    const end = start + limit;

    const data = all.slice(start, end);

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
