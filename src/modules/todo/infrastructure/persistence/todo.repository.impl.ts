import { Repository } from 'typeorm';
import {
  PaginatedResult,
  PaginationParams,
  TodoRepository,
} from '../../domain/repositories/todo.repository';
import { TodoModel } from '../models/todo.model';
import { TodoDependencyModel } from '../models/todo-dependency.model';
import { TodoItem } from '../../domain/entities/todo-item.entity';

export const TODO_REPOSITORY = 'TODO_REPOSITORY';

export class TypeOrmTodoRepository implements TodoRepository {
  constructor(
    private readonly todoRepo: Repository<TodoModel>,
    private readonly depRepo: Repository<TodoDependencyModel>,
  ) {}

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findAll({
    page,
    limit,
  }: PaginationParams): Promise<PaginatedResult<TodoItem>> {
    const skip = (page - 1) * limit;

    const [todos, total] = await this.todoRepo.findAndCount({
      skip,
      take: limit,
      order: {
        date: 'ASC',
      },
    });

    const items: TodoItem[] = [];

    for (const todo of todos) {
      const deps = await this.depRepo.find({
        where: { parentId: todo.id },
      });

      const dependents: TodoItem[] = [];

      for (const dep of deps) {
        const depTodo = await this.todoRepo.findOne({
          where: { id: dep.dependentId },
        });

        if (depTodo) {
          dependents.push(
            TodoItem.create(depTodo.title, depTodo.date, [], depTodo.id),
          );
        }
      }

      items.push(TodoItem.create(todo.title, todo.date, dependents, todo.id));
    }

    return {
      data: items,
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<TodoItem | null> {
    const todo = await this.todoRepo.findOne({ where: { id } });
    if (!todo) return null;

    const deps = await this.depRepo.find({
      where: { parentId: id },
    });

    const dependents: TodoItem[] = [];

    for (const dep of deps) {
      const depTodo = await this.todoRepo.findOne({
        where: { id: dep.dependentId },
      });

      if (depTodo) {
        dependents.push(
          TodoItem.create(depTodo.title, depTodo.date, [], depTodo.id),
        );
      }
    }

    return TodoItem.create(todo.title, todo.date, dependents, todo.id);
  }

  async save(todo: TodoItem): Promise<void> {
    await this.todoRepo.save({
      id: todo.id,
      title: todo.title,
      date: todo.date,
    });

    for (const dep of todo.dependents) {
      await this.depRepo.save({
        parentId: todo.id,
        dependentId: dep.id,
      });
    }
  }
}
