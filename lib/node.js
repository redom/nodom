export class Node {
  constructor () {
    this.childNodes = [];
  }

  cloneNode (deep) {
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
  }

  get nodeValue () {
    return null;
  }

  get children () {
    return this.childNodes;
  }

  get firstChild () {
    return this.childNodes[0] || null;
  }

  get lastChild () {
    return this.childNodes[this.childNodes.length - 1] || null;
  }

  get nodeName () {
    return this.tagName;
  }
}
