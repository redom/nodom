export function Node () {
  this.childNodes = [];
}

Node.prototype.cloneNode = function (deep) {
  if (!deep || ('childNodes' in this && Array.isArray(this.childNodes) && this.childNodes.length === 0)) {
    const Class = Object.getPrototypeOf(this);
    return new Class.constructor(this);
  } else {
    const Class = Object.getPrototypeOf(this);
    const object = new Class.constructor(this);

    const childNodes = [];

    this.childNodes.map((e) => childNodes.push(e.cloneNode(true)));

    object.childNodes = childNodes;
    return object;
  }
};

Object.defineProperty(Node.prototype, 'nodeValue', {
  get: function () { return null; }
});

Object.defineProperty(Node.prototype, 'children', {
  get: function () { return this.childNodes; }
});

Object.defineProperty(Node.prototype, 'firstChild', {
  get: function () { return this.childNodes[0] || null; }
});

Object.defineProperty(Node.prototype, 'lastChild', {
  get: function () { return this.childNodes[this.childNodes.length - 1] || null; }
});

Object.defineProperty(Node.prototype, 'nodeName', {
  get: function () { return this.tagName; }
});
