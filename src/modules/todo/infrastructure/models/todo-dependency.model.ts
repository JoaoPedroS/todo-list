import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('todo_dependencies')
export class TodoDependencyModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  parentId: string;

  @Column()
  dependentId: string;
}
