import { HTMLElement } from './element';

export class ClassList extends Array {

  constructor (element: HTMLElement);

  add (className: string): void;

  contains (className: string): boolean;

  item (index: number): string;

  remove (className: string): void;

  reset (className?: string): void;

  toggle (className: string): boolean;
}
