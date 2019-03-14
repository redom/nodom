
import { dashToCamel, camelToDash } from './utils/notation';

export function CSSStyleDeclaration () {}

CSSStyleDeclaration.prototype = Object.create({});

CSSStyleDeclaration.prototype.setProperty = function (propertyName, value/*, priority */) {
  this[dashToCamel(propertyName)] = value;
};

CSSStyleDeclaration.prototype.valueOf = function () {
  return this;
};

CSSStyleDeclaration.prototype.toString = function () {
  let str = '';
  for (let p in this) {
    if (!this.hasOwnProperty(p)) {
      continue;
    }
    str += camelToDash(p) + ': ' + this[p] + '; ';
  }
  return str;
};

CSSStyleDeclaration.prototype.setValue = function (style) {
  let list = style.split(';');
  for (let p in list) {
    let pair = p.split(':');
    this[pair[0].trim()] = pair[1].trim();
  }
};

Object.defineProperty(CSSStyleDeclaration.prototype, 'cssText', {
  get: function () { return this.toString(); },
  set: function (text) { this.setValue(text); },
  enumerable: true
});
