import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  PaginatedResult,
  PaginationParams,
  TodoRepository,
} from '../../../domain/repositories/todo.repository';
import { TodoModel } from '../models/todo.model';
import { TodoDependencyModel } from '../models/todo-dependency.model';
import { TodoItem } from '../../../domain/entities/todo-item.entity';

export const TODO_REPOSITORY = 'TODO_REPOSITORY';

export class TypeOrmTodoRepository implements TodoRepository {
  constructor(
    private readonly todoRepo: Repository<TodoModel>,
    private readonly depRepo: Repository<TodoDependencyModel>,
    private readonly dataSource: DataSource,
  ) {}

  async delete(id: string): Promise<void> {
    await this.depRepo.delete({ parentId: id });

    await this.depRepo.delete({ dependentId: id });

    await this.todoRepo.delete({ id });
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
            TodoItem.create(
              depTodo.title,
              new Date(depTodo.date),
              [],
              depTodo.id,
            ),
          );
        }
      }

      items.push(
        TodoItem.create(todo.title, new Date(todo.date), dependents, todo.id),
      );
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

    return this.buildTodoTree(todo);
  }

  private async buildTodoTree(todoModel: TodoModel): Promise<TodoItem> {
    const deps = await this.depRepo.find({
      where: { parentId: todoModel.id },
    });

    const dependents: TodoItem[] = [];

    for (const dep of deps) {
      const depTodo = await this.todoRepo.findOne({
        where: { id: dep.dependentId },
      });

      if (depTodo) {
        const childTree = await this.buildTodoTree(depTodo);
        dependents.push(childTree);
      }
    }

    return TodoItem.create(
      todoModel.title,
      new Date(todoModel.date),
      dependents,
      todoModel.id,
    );
  }

  async save(todo: TodoItem): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await this.persistTodoTree(todo, manager);
    });
  }

  private async persistTodoTree(
    todo: TodoItem,
    manager: EntityManager,
  ): Promise<void> {
    await manager.save(TodoModel, {
      id: todo.id,
      title: todo.title,
      date: todo.date.toISOString().split('T')[0],
    });

    await manager.delete(TodoDependencyModel, {
      parentId: todo.id,
    });

    for (const dep of todo.dependents) {
      await manager.save(TodoDependencyModel, {
        parentId: todo.id,
        dependentId: dep.id,
      });

      await this.persistTodoTree(dep, manager);
    }
  }
}
