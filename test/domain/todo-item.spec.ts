import { TodoItem } from '../../src/modules/todo/domain/entities/todo-item.entity';
import { InMemoryTodoRepository } from '../repositories/in-memory-todo.repository';

describe('TodoItem – regras de dependência ', () => {
  it('cria um item com título e data', () => {
    const item = TodoItem.create('Task A', new Date('2025-10-20'));

    expect(item.title).toBe('Task A');
    expect(item.date.toISOString()).toBe(new Date('2025-10-20').toISOString());
  });

  it('cria item sem dependências por padrão', () => {
    const item = TodoItem.create('Task A', new Date('2025-10-20'));

    expect(item.dependents).toHaveLength(0);
  });

  it('não permite depender de si mesmo', () => {
    const a = TodoItem.create('A', new Date('2025-10-20'));

    expect(() => a.addDependent(a)).toThrow();
  });

  it('impede dependência circular direta', () => {
    const a = TodoItem.create('A', new Date('2025-10-20'));
    const b = TodoItem.create('B', new Date('2025-10-21'));

    a.addDependent(b);

    expect(() => b.addDependent(a)).toThrow();
  });

  it('impede dependência circular indireta', () => {
    const a = TodoItem.create('A', new Date('2025-10-20'));
    const b = TodoItem.create('B', new Date('2025-10-21'));
    const c = TodoItem.create('C', new Date('2025-10-22'));

    b.addDependent(a);
    c.addDependent(b);

    expect(() => a.addDependent(c)).toThrow();
  });

  it('Deve atualizar a data dos dependentes recursivamente', () => {
    const taskA = TodoItem.create('Task A', new Date('2025-10-20'));

    const taskB = TodoItem.create('Task B', new Date('2025-10-21'), []);

    taskA.addDependent(taskB);

    taskA.updateDate(new Date('2025-10-25'));

    expect(taskA.date.toISOString()).toBe(new Date('2025-10-25').toISOString());

    expect(taskB.date.toISOString()).toBe(new Date('2025-10-26').toISOString());
  });

  it('Deve atualizar dependentes em cadeia', () => {
    const a = TodoItem.create('A', new Date('2025-10-20'));
    const b = TodoItem.create('B', new Date('2025-10-21'));
    const c = TodoItem.create('C', new Date('2025-10-22'));

    a.addDependent(b);

    b.addDependent(c);

    a.updateDate(new Date('2025-10-25'));

    expect(b.date.toISOString()).toBe(new Date('2025-10-26').toISOString());

    expect(c.date.toISOString()).toBe(new Date('2025-10-27').toISOString());
  });
});

describe('Todo - teste de listagem', () => {
  it('Deve listar todos paginados', async () => {
    const repo = new InMemoryTodoRepository();

    for (let i = 1; i <= 15; i++) {
      await repo.save(
        TodoItem.create(
          `Task ${i}`,
          new Date(`2025-10-${i.toString().padStart(2, '0')}`),
        ),
      );
    }

    const result = await repo.findAll({ page: 2, limit: 5 });

    expect(result.data).toHaveLength(5);
    expect(result.total).toBe(15);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(5);
  });
});
