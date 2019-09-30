import { Attributes } from './attributes';
import { ClassList } from './classlist';
import { Dataset } from './dataset';
import { Node } from './node';
import { CSSStyleDeclaration } from './style';

export class HTMLElement extends Node {
  attributes: Attributes;
  readonly classList: ClassList;
  className: string;
  dataset: Dataset;
  innerHTML: string;
  readonly nextSibling: Node | null;
  nodeType: number;
  readonly outerHTML: string;
  style: CSSStyleDeclaration;
  tagName: string;
  textContent: string;

  constructor (options: { [key: string]: string });

  appendChild <T extends Node> (newChild: T): T;

  insertBefore <T extends Node> (newChild: T, refChild: Node | null): T;

  removeChild <T extends Node> (oldChild: Node): T;

  replaceChild <T extends Node> (newChild: Node, oldChild: T): T;

  getAttribute (attr: string): string | null;

  setAttribute (attr: string, value: string): void;

  getElementsByClassName (classNames: string): HTMLElement[];

  getElementsByTagName (tagName: string): HTMLElement[];

  matches (query: string): boolean;

  querySelector (selectors: string): HTMLElement | null;

  querySelectorAll (selectors: string): HTMLElement[];

  addEventListener (): void;

  removeEventListener (): void;

  blur (): void;

  click (): void;

  focus (): void;

  render (inner?: boolean): string;
}
