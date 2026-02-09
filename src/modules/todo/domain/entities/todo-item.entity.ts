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

  addDependent(todo: TodoItem): void {
    this._dependents.push(todo);
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
