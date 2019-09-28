import { Node } from './node';
import { escapeHTML } from './utils/escapeHTML';

export function TextNode (text) {
  Node.apply(this);
  this.nodeType = 3;
  this.textContent = String(text);
}

TextNode.prototype = Object.create(Node.prototype);
TextNode.prototype.constructor = TextNode;

TextNode.prototype.render = function () {
  return escapeHTML(this.textContent);
};

Object.defineProperty(TextNode.prototype, 'nodeValue', {
  get: function () { return this.textContent; }
});
