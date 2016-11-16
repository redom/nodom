(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.nodom = global.nodom || {})));
}(this, (function (exports) { 'use strict';

function ClassList (el) {
  this.reset(el.className);
}

ClassList.prototype = [];

ClassList.prototype.reset = function (className) {
  var this$1 = this;

  var classNames = (className || '').split(' ');

  this.length = classNames.length;

  for (var i = 0; i < classNames.length; i++) {
    this$1[i] = classNames[i];
  }
};

ClassList.prototype.add = function (className) {
  if (!this.contains(className)) {
    this.push(className);
  }
};

ClassList.prototype.contains = function (className) {
  var this$1 = this;

  for (var i = 0; i < this.length; i++) {
    if (this$1[i] === className) {
      return true;
    }
  }
  return false;
};

ClassList.prototype.remove = function (className) {
  var this$1 = this;

  var classNames = this.classNames;

  for (var i = 0; i < this.length; i++) {
    if (classNames[i] === className) {
      this$1.splice(i, 1);
    }
  }
};

ClassList.prototype.toString = function () {
  return this.join(' ').trim();
};

function Node () {}

Node.prototype.cloneNode = function (deep) {
  var Class = Object.getPrototypeOf(this);

  return new Class.constructor(this);
};

function TextNode (text) {
  this.nodeType = 3;
  this.textContent = text;
}

TextNode.prototype = Object.create(Node.prototype);
TextNode.prototype.constructor = TextNode;

TextNode.prototype.render = function () {
  return this.textContent;
};

var combinators = ' >+~';
var ws = new RegExp('\\s*([' + combinators + '])\\s*', 'g');
var terms = new RegExp('(^|[' + combinators + '])([^' + combinators + ']+)', 'ig');

var id = new RegExp('#[^.' + combinators + ']+', 'g');
var tagName = new RegExp('^(?:[' + combinators + '])?([^#.' + combinators + '\\[\\]]+)');
var classNames = new RegExp('\\.[^.' + combinators + ']+', 'g');

var fst = function (a) { return a != null ? a[0] : null; };
var snd = function (a) { return Array.isArray(a) && a.length > 1 ? a[1] : null; };
var map = function (fn) { return function (as) { return Array.isArray(as) ? as.map(fn) : null; }; };

var trimFirst = function (s) { return s.substr(1); };
var trimId = function (id) { return id != null ? trimFirst(id) : null; };
var trimClassNames = map(trimFirst);

function parseSelector (selector) {
  if (selector == null || selector.length === 0) {
    return null;
  }

  return selector
    .replace(ws, '$1')
    .match(terms)
    .map(function (term, i) { return ({
      tagName: (snd(term.match(tagName)) || '').toLowerCase(),
      id: trimId(fst(term.match(id))),
      classNames: trimClassNames(term.match(classNames)),
      relation: i > 0 ? term[0] : null
    }); })
    .reverse();
}

function elementMatches (el, selector) {
  if (el == null) {
    return false;
  }

  if (selector.tagName && el.tagName !== selector.tagName) {
    return false;
  }

  if (selector.id && el.id !== selector.id) {
    return false;
  }

  if (selector.classNames && !selector.classNames.every(function (cn) { return el.classList.contains(cn); })) {
    return false;
  }

  return true;
}

function isMatching (el, terms) {
  var curr = el;

  var loop = function ( i ) {
    switch (terms[i - 1].relation) {
      case ' ':
        // descendant, walk up the tree until a matching node is found
        do {
          curr = curr.parentNode;
        } while (curr != null && !elementMatches(curr, terms[i]));
        break;
      case '>':
        // immediate child
        if (!elementMatches(curr.parentNode, terms[i])) {
          return { v: false };
        }
        break;
      case '+':
        // adjacent sibling selector
        if (!elementMatches(curr.parentNode.childNodes.find(function (c) { return c.nextSibling === curr; }), terms[i])) {
          return { v: false };
        }
        break;
      case '~':
        // general sibling selector
        if (!curr.parentNode.childNodes.slice(0, curr.parentNode.childNodes.indexOf(curr)).some(function (el) { return elementMatches(el, terms[i]); })) {
          return { v: false };
        }
        break;
    }
  };

  for (var i = 1; i < terms.length; i++) {
    var returned = loop( i );

    if ( returned ) return returned.v;
  }

  return curr != null;
}

function querySelectorAll (query, root, takeN) {
  var terms = parseSelector(query);

  if (terms == null) {
    return [];
  }

  var init = root.getElementsByTagName(terms[0].tagName || '*');
  var ret = [];

  for (var i = 0; i < init.length; i++) {
    if (elementMatches(init[i], terms[0]) && isMatching(init[i], terms)) {
      ret.push(init[i]);

      if (takeN != null && ret.length >= takeN) {
        break;
      }
    }
  }

  return ret;
}

function querySelector (query, root) {
  return querySelectorAll(query, root, 1)[0] || null;
}

var voidElementLookup = 'area base br col command embed hr img input keygen link meta param source track wbr'.split(' ').reduce(function (lookup, tagName) {
  lookup[tagName] = true;
  return lookup;
}, {});

function HTMLElement (options) {
  var this$1 = this;

  this.childNodes = [];
  this.style = {};
  this.nodeType = 1;

  for (var key in options) {
    this$1[key] = options[key];
  }

  if (!this.tagName) {
    this.tagName = 'div';
  }

  this.tagName = this.tagName.toLowerCase();

  Object.defineProperty(this, 'isVoidEl', {
    value: voidElementLookup[this.tagName]
  });
}

HTMLElement.prototype = Object.create(Node.prototype);
HTMLElement.prototype.constructor = HTMLElement;

var noOp = function () { return undefined; };
var noOpMethods = 'blur click focus';

noOpMethods.split(' ').forEach(function (fn) { return (HTMLElement.prototype[fn] = noOp); });

var shouldNotRender = 'tagName view nodeType isVoidEl parent parentNode childNodes isMounted'.split(' ').reduce(function (lookup, key) {
  lookup[key] = true;
  return lookup;
}, {});

HTMLElement.prototype.render = function (inner) {
  var this$1 = this;

  var isVoidEl = this.isVoidEl;
  var attributes = [];

  var hasChildren = false;
  var content = '';

  for (var key in this) {
    if (key === 'isMounted' || !this$1.hasOwnProperty(key)) {
      continue;
    }
    if (shouldNotRender[key] || !isVoidEl) {
      if (this$1.childNodes.length) {
        hasChildren = true;
      }
    } else if (key === 'className') {
      attributes.push('class="' + this$1[key] + '"');
    } else if (key === '_innerHTML') {
      content = this$1._innerHTML;
    } else if (key === 'style') {
      var styles = '';

      for (var styleName in this.style) {
        styles += styleName + ':' + this$1.style[styleName] + ';';
      }

      if (styles && styles.length) {
        attributes.push('style="' + styles + '"');
      }
    } else if (!shouldNotRender[key]) {
      if (typeof this$1[key] === 'function') {
        continue;
      }
      attributes.push(key + '="' + this$1[key] + '"');
    }
  }

  if (inner) {
    if (!isVoidEl && hasChildren) {
      return this.childNodes.map(childRenderer).join('');
    } else if (!isVoidEl && content) {
      return content;
    } else {
      return '';
    }
  }

  if (!isVoidEl && hasChildren) {
    var tagName = this.tagName;
    var tagOpening = [tagName].concat(attributes).join(' ');
    var children = this.childNodes.map(childRenderer).join('');

    return ("<" + tagOpening + ">" + children + "</" + tagName + ">");
  } else if (!isVoidEl && content) {
    var tagName$1 = this.tagName;
    var tagOpening$1 = [this.tagName].concat(attributes).join(' ');

    return ("<" + tagOpening$1 + ">" + content + "</" + tagName$1 + ">");
  } else {
    var tagName$2 = this.tagName;
    var tagOpening$2 = [tagName$2].concat(attributes).join(' ');

    if (isVoidEl) {
      return ("<" + tagOpening$2 + ">");
    } else {
      return ("<" + tagOpening$2 + "></" + (this.tagName) + ">");
    }
  }
};

HTMLElement.prototype.addEventListener = function () {};
HTMLElement.prototype.removeEventListener = function () {};

HTMLElement.prototype.setAttribute = function (attr, value) {
  this[attr] = value;
};

HTMLElement.prototype.getAttribute = function (attr) {
  return this[attr];
};

HTMLElement.prototype.appendChild = function (child) {
  var this$1 = this;

  if (this.isVoidEl) {
    return; // Silently ignored
  }
  child.parentNode = this;
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this$1.childNodes[i] === child) {
      this$1.childNodes.splice(i, 1);
    }
  }
  this.childNodes.push(child);
  return child;
};

HTMLElement.prototype.insertBefore = function (child, before) {
  var this$1 = this;

  if (this.isVoidEl) {
    return; // Silently ignored
  }
  child.parentNode = this;
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this$1.childNodes[i] === before) {
      this$1.childNodes.splice(i++, 0, child);
    } else if (this$1.childNodes[i] === child) {
      this$1.childNodes.splice(i, 1);
    }
  }
};

HTMLElement.prototype.replaceChild = function (child, replace) {
  var this$1 = this;

  if (this.isVoidEl) {
    return; // Silently ignored
  }
  child.parentNode = this;
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this$1.childNodes[i] === replace) {
      this$1.childNodes[i] = child;
    }
  }
};

HTMLElement.prototype.removeChild = function (child) {
  var this$1 = this;

  if (this.isVoidEl) {
    return; // Silently ignored
  }
  child.parentNode = null;
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this$1.childNodes[i] === child) {
      this$1.childNodes.splice(i, 1);
    }
  }
};

HTMLElement.prototype.getElementsByTagName = function (tagName) {
  var lowerTagName = tagName.toLowerCase();

  if (this.isVoidEl || this.childNodes.length === 0) {
    return [];
  }

  return this.childNodes.reduce(function (results, child) {
    if (lowerTagName === '*' || child.tagName === lowerTagName) {
      return results.concat(child, child.getElementsByTagName(lowerTagName));
    }

    return results.concat(child.getElementsByTagName(lowerTagName));
  }, []);
};

HTMLElement.prototype.getElementsByClassName = function (classNames) {
  if (!Array.isArray(classNames)) {
    return this.getElementsByClassName(
      String(classNames)
        .split(' ')
        .map(function (cn) { return cn.trim(); })
        .filter(function (cn) { return cn.length > 0; }));
  } else if (classNames.length === 0) {
    return [];
  }

  return this.childNodes.reduce(function (results, child) {
    var childMatches = classNames.every(function (cn) { return child.classList.contains(cn); });

    return (childMatches
      ? results.concat(child, child.getElementsByClassName(classNames))
      : results.concat(child.getElementsByClassName(classNames)));
  }, []);
};

HTMLElement.prototype.querySelector = function (query) {
  return querySelector(query, this);
};

HTMLElement.prototype.querySelectorAll = function (query) {
  return querySelectorAll(query, this);
};

Object.defineProperties(HTMLElement.prototype, {
  _classList: {
    value: null,
    enumerable: false,
    configurable: false,
    writable: true
  },
  classList: {
    get: function () {
      if (!this._classList) {
        this._classList = new ClassList(this);
      }
      return this._classList;
    }
  },
  className: {
    set: function (v) {
      this.classList.reset(v);
    },
    get: function () {
      return this._classList == null ? '' : this._classList.toString();
    }
  },
  innerHTML: {
    get: function () {
      return this._innerHTML || this.render(true);
    },
    set: function (value) {
      this._innerHTML = value;
    }
  },
  outerHTML: {
    get: function () {
      return this.render();
    }
  },
  firstChild: {
    get: function () {
      return this.childNodes[0];
    }
  },
  textContent: {
    get: function () {
      return this.childNodes.filter(function (node) {
        return node instanceof TextNode;
      }).map(function (node) { return node.textContent; }).join('');
    },
    set: function (str) {
      this.childNodes = [
        new TextNode(str)
      ];
    }
  },
  nextSibling: {
    get: function () {
      var this$1 = this;

      var siblings = this.parentNode.childNodes;

      for (var i = 0; i < siblings.length; i++) {
        if (siblings[i] === this$1) {
          return siblings[i + 1];
        }
      }
    }
  }
});

function childRenderer (child) {
  return child.render();
}

function Document () {
  this.documentElement = this.createElement('html');
  this.head = this.documentElement.appendChild(this.createElement('head'));
  this.body = this.documentElement.appendChild(this.createElement('body'));
  this.nodeType = 9;
}

Document.prototype.createElement = function (tagName) {
  return new HTMLElement({
    tagName: tagName
  });
};

Document.prototype.createElementNS = function (ns, tagName) {
  return new HTMLElement({
    tagName: tagName
  });
};

Document.prototype.createTextNode = function (text) {
  return new TextNode(text);
};

Document.prototype.getElementsByTagName = function (tagName) {
  var lowerTagName = tagName.toLowerCase();

  if (lowerTagName === 'html') {
    return [this.documentElement];
  }

  return (lowerTagName === '*'
    ? [this.documentElement].concat(this.documentElement.getElementsByTagName(lowerTagName))
    : this.documentElement.getElementsByTagName(lowerTagName));
};

Document.prototype.getElementsByClassName = function (classNames) {
  var this$1 = this;

  if (!Array.isArray(classNames)) {
    return this.getElementsByClassName(
      String(classNames)
        .split(' ')
        .map(function (cn) { return cn.trim(); })
        .filter(function (cn) { return cn.length > 0; }));
  } else if (classNames.length === 0) {
    return [];
  }

  var documentNodeMatches = classNames.every(function (cn) { return this$1.documentElement.classList.contains(cn); });

  return this.documentElement.childNodes.reduce(function (results, child) {
    var childMatches = classNames.every(function (cn) { return child.classList.contains(cn); });

    return (childMatches
      ? results.concat(child, child.getElementsByClassName(classNames))
      : results.concat(child.getElementsByClassName(classNames)));
  }, documentNodeMatches ? [this.documentElement] : []);
};

Document.prototype.getElementById = function (id) {
  if (this.documentElement.id === id) {
    return this.documentElement;
  }

  function matchIdInNodes (id, nodes) {
    var nextContext = [];

    for (var i = 0; i < nodes.length; i++) {
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
};

Document.prototype.querySelector = function (query) {
  return querySelector(query, this);
};

Document.prototype.querySelectorAll = function (query) {
  return querySelectorAll(query, this);
};

function render (view, inner) {
  var el = view.el || view;

  return el.render(inner);
}

exports.Document = Document;
exports.HTMLElement = HTMLElement;
exports.Node = Node;
exports.render = render;
exports.TextNode = TextNode;

Object.defineProperty(exports, '__esModule', { value: true });

})));
