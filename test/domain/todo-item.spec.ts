import { TodoItem } from '../../src/modules/todo/domain/entities/todo-item.entity';
import { InMemoryTodoRepository } from '../repositories/in-memory-todo.repository';

describe('TodoItem – regra de dependência de datas ', () => {
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
