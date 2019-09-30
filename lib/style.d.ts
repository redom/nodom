export class CSSStyleDeclaration {
  cssText: string;

  getPropertyValue (propertyName: string): string;

  removeProperty (propertyName: string): string;

  setProperty (propertyName: string, value: string): void;

  setValue (style: string): void;

  valueOf (): this;
}
