export function Node () {
    this.childNodes = [];
}

Node.prototype.cloneNode = function (deep) {
  const Class = Object.getPrototypeOf(this);

  return new Class.constructor(this);
};

Node.prototype.cloneNode = function (deep) {
    if (!deep || 'childNodes' in this && Array.isArray(this.childNodes) && this.childNodes.length === 0) {
        var Class = Object.getPrototypeOf(this);
        return new Class.constructor(this);
    } else {
        Class = Object.getPrototypeOf(this);
        var object = new Class.constructor(this);

        var childNodes = [];

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
    get: function () { return this.childNodes[0]; }
});

Object.defineProperty(Node.prototype, 'lastChild', {
    get: function () { return this.childNodes[this.childNodes.length - 1]; }
});

Object.defineProperty(Node.prototype, 'nodeName', {
    get: function () { return this.tagName; }
});
