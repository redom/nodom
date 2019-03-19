import { Node } from './node';

export function TextNode (text) {
  Node.apply(this);
  this.nodeType = 3;
  this.textContent = text;
}

TextNode.prototype = Object.create(Node.prototype);
TextNode.prototype.constructor = TextNode;

TextNode.prototype.render = function () {
  return this.textContent;
};

Object.defineProperty(TextNode.prototype, 'nodeValue', {
  get: function () { return this.textContent; }
});
