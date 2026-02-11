import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('todos')
export class TodoModel {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ type: 'date' })
  date: Date;
}
