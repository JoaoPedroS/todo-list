import { randomUUID } from 'crypto';

export class TodoItem {
  private readonly _id: string;
  private _title: string;
  private _date: Date;
  private _dependents: TodoItem[];

  private constructor(
    title: string,
    date: Date,
    dependents: TodoItem[] = [],
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this._title = title;
    this._date = date;
    this._dependents = dependents;
  }

  static create(
    title: string,
    date: Date,
    dependents: TodoItem[] = [],
    id?: string,
  ): TodoItem {
    return new TodoItem(title, date, dependents, id);
  }

  get id(): string {
    return this._id;
  }

  get date(): Date {
    return this._date;
  }

  get title(): string {
    return this._title;
  }

  set date(date: Date) {
    this._date = date;
  }

  set title(title: string) {
    this._title = title;
  }

  addDependent(todo: TodoItem): void {
    if (todo.id === this._id) {
      throw new Error('Todo cannot depend on itself');
    }

    if (this.hasCircularDependency(todo)) {
      throw new Error('Circular dependency detected');
    }

    this._dependents.push(todo);
  }

  private hasCircularDependency(todo: TodoItem): boolean {
    return todo.dependsOn(this);
  }

  private dependsOn(target: TodoItem): boolean {
    if (this._dependents.some((dep) => dep.id === target.id)) {
      return true;
    }

    for (const dep of this._dependents) {
      if (dep.dependsOn(target)) {
        return true;
      }
    }

    return false;
  }

  get dependents(): TodoItem[] {
    return [...this._dependents];
  }

  updateDate(newDate: Date): void {
    const diffInDays = this.diffInDays(this._date, newDate);
    this._date = newDate;

    this._dependents.forEach((dep) => dep.shiftDate(diffInDays));
  }

  private shiftDate(days: number): void {
    const newDate = new Date(this._date);
    newDate.setDate(newDate.getDate() + days);
    this._date = newDate;

    this._dependents.forEach((dep) => dep.shiftDate(days));
  }

  private diffInDays(oldDate: Date, newDate: Date): number {
    const diffTime = newDate.getTime() - oldDate.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  }
}
