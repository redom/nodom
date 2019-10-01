import { HTMLElement, SVGElement } from './element';
import { TextNode } from './textnode';
import { querySelector, querySelectorAll } from './utils/querySelector';

export class Document {
  constructor () {
    this.documentElement = this.createElement('html');
    this.head = this.documentElement.appendChild(this.createElement('head'));
    this.body = this.documentElement.appendChild(this.createElement('body'));
    this.nodeType = 9;
  }

  createElement (tagName) {
    const element = new HTMLElement({
      tagName: tagName
    });

    // element.ownerDocument = this;

    if (!('ownerDocument' in element)) {
      Object.defineProperty(element, 'ownerDocument', {
        enumerable: false,
        get: (function (t) { return function () { return t; }; })(this)
      });
    }

    return element;
  }

  createElementNS (ns, tagName) {
    let element;
    if (tagName === 'http://www.w3.org/2000/svg') {
      element = new SVGElement({
        tagName: tagName
      });
    } else {
      element = new HTMLElement({
        tagName: tagName
      });
    }

    // element.ownerDocument = this;

    if (!('ownerDocument' in element)) {
      Object.defineProperty(element, 'ownerDocument', {
        enumerable: false,
        get: (function (t) { return function () { return t; }; })(this)
      });
    }

    return element;
  }

  createDocumentFragment () {
    return (new Document()).body;
  }

  createTextNode (text) {
    const textNode = new TextNode(text);

    // element.textNode = this;

    if (!('ownerDocument' in textNode)) {
      Object.defineProperty(textNode, 'ownerDocument', {
        enumerable: false,
        get: (function (t) { return function () { return t; }; })(this)
      });
    }

    return textNode;
  }

  getElementsByTagName (tagName) {
    const lowerTagName = tagName.toLowerCase();

    if (lowerTagName === 'html') {
      return [this.documentElement];
    }

    return (lowerTagName === '*'
      ? [this.documentElement].concat(this.documentElement.getElementsByTagName(lowerTagName))
      : this.documentElement.getElementsByTagName(lowerTagName));
  }

  getElementsByClassName (classNames) {
    if (!Array.isArray(classNames)) {
      return this.getElementsByClassName(
        String(classNames)
          .split(' ')
          .map(cn => cn.trim())
          .filter(cn => cn.length > 0));
    } else if (classNames.length === 0) {
      return [];
    }

    const documentNodeMatches = classNames.every(cn => this.documentElement.classList.contains(cn));

    return this.documentElement.childNodes.reduce(function (results, child) {
      const childMatches = classNames.every(cn => child.classList.contains(cn));

      return (childMatches
        ? results.concat(child, child.getElementsByClassName(classNames))
        : results.concat(child.getElementsByClassName(classNames)));
    }, documentNodeMatches ? [this.documentElement] : []);
  }

  getElementById (id) {
    if (this.documentElement.id === id) {
      return this.documentElement;
    }

    function matchIdInNodes (id, nodes) {
      let nextContext = [];

      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
          return nodes[i];
        }

        nextContext = nextContext.concat(nodes[i].childNodes);
      }

      if (nextContext.length > 0) {
        return matchIdInNodes(id, nextContext);
      }

      return null;
    }

    return matchIdInNodes(id, this.documentElement.childNodes);
  }

  querySelector (query) {
    return querySelector(query, this);
  }

  querySelectorAll (query) {
    return querySelectorAll(query, this);
  }
}

Document.prototype.implementation = Object.create(null);

Document.prototype.implementation.hasFeature = function (feature/*, version */) {
  switch (feature) {
    default:
      return false;
  }
};

Document.prototype.implementation.createHTMLDocument = function (textContent) {
  const document = new Document();
  document.outerHTML = textContent;
  return document;
};
