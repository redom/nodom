(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.nodom = {}));
}(this, function (exports) { 'use strict';

  var ClassList = /*@__PURE__*/(function (Array) {
    function ClassList (el) {
      Array.call(this);
      this.reset(el.className);
    }

    if ( Array ) ClassList.__proto__ = Array;
    ClassList.prototype = Object.create( Array && Array.prototype );
    ClassList.prototype.constructor = ClassList;

    ClassList.prototype.reset = function reset (className) {
      var classNames = (className || '').split(' ');

      this.length = classNames.length;

      for (var i = 0; i < classNames.length; i++) {
        this[i] = classNames[i];
      }
    };

    ClassList.prototype.add = function add (className) {
      if (!this.contains(className)) {
        this.push(className);
      }
    };

    ClassList.prototype.contains = function contains (className) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] === className) {
          return true;
        }
      }
      return false;
    };

    ClassList.prototype.item = function item (index) {
      return this[index] || null;
    };

    ClassList.prototype.remove = function remove (className) {
      var classNames = this.classNames;

      for (var i = 0; i < this.length; i++) {
        if (classNames[i] === className) {
          this.splice(i, 1);
        }
      }
    };

    ClassList.prototype.toggle = function toggle (className) {
      var idx = this.indexOf(className);

      if (idx >= 0) {
        this.splice(idx, 1);
        return false;
      } else {
        this.push(className);
        return true;
      }
    };

    ClassList.prototype.toString = function toString () {
      return this.join(' ').trim();
    };

    return ClassList;
  }(Array));

  ClassList.prototype.constructor = Array;

  var Node = function Node () {
    this.childNodes = [];
  };

  var prototypeAccessors = { nodeValue: { configurable: true },children: { configurable: true },firstChild: { configurable: true },lastChild: { configurable: true },nodeName: { configurable: true } };

  Node.prototype.cloneNode = function cloneNode (deep) {
    if (!deep || ('childNodes' in this && Array.isArray(this.childNodes) && this.childNodes.length === 0)) {
      var Class = Object.getPrototypeOf(this);
      return new Class.constructor(this);
    } else {
      var Class$1 = Object.getPrototypeOf(this);
      var object = new Class$1.constructor(this);

      var childNodes = [];

      this.childNodes.map(function (e) { return childNodes.push(e.cloneNode(true)); });

      object.childNodes = childNodes;
      return object;
    }
  };

  prototypeAccessors.nodeValue.get = function () {
    return null;
  };

  prototypeAccessors.children.get = function () {
    return this.childNodes;
  };

  prototypeAccessors.firstChild.get = function () {
    return this.childNodes[0] || null;
  };

  prototypeAccessors.lastChild.get = function () {
    return this.childNodes[this.childNodes.length - 1] || null;
  };

  prototypeAccessors.nodeName.get = function () {
    return this.tagName;
  };

  Object.defineProperties( Node.prototype, prototypeAccessors );

  var htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };

  function escapeHTML (str) {
    return (str || '').replace(/[&<>]/g, function (c) { return htmlEntities[c]; });
  }

  var TextNode = /*@__PURE__*/(function (Node) {
    function TextNode (text) {
      Node.call(this);
      this.nodeType = 3;
      this.textContent = String(text);
    }

    if ( Node ) TextNode.__proto__ = Node;
    TextNode.prototype = Object.create( Node && Node.prototype );
    TextNode.prototype.constructor = TextNode;

    var prototypeAccessors = { nodeValue: { configurable: true } };

    TextNode.prototype.render = function render () {
      return escapeHTML(this.textContent);
    };

    prototypeAccessors.nodeValue.get = function () {
      return this.textContent;
    };

    Object.defineProperties( TextNode.prototype, prototypeAccessors );

    return TextNode;
  }(Node));

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

  function Attributes () { }
  Attributes.prototype = {};

  // See https://eslint.org/docs/rules/no-prototype-builtins.
  function hasOwnProperty (obj, propName) {
    return Object.prototype.hasOwnProperty.call(obj, propName);
  }

  function dashToCamel (dashedName) {
    var dashPositions = [];
    var dashedChars = dashedName.split('');
    dashedChars.map(function (e, i) {
      if (e === '-') { dashPositions.push(i); }
    });
    var camelChars = dashedName.split('');
    dashPositions.map(function (e, offset) {
      var capLetter = dashedChars[e + 1].toUpperCase();
      camelChars.splice(e - offset, 2, capLetter);
    });
    return camelChars.join('');
  }

  function camelToDash (camelName) {
    var capPositions = [];
    var camelChars = camelName.split('');
    camelChars.map(function (e, i) {
      if (/^[A-Z]/.test(e)) { capPositions.push(i); }
    });
    var dashedChars = camelName.split('');
    capPositions.map(function (e) {
      dashedChars.splice(e, 1, '-' + camelChars[e].toLowerCase());
    });
    return dashedChars.join('');
  }

  function CSSStyleDeclaration () {}

  CSSStyleDeclaration.prototype = Object.create({});

  CSSStyleDeclaration.prototype.getPropertyPriority = function (_propertyName) {
    return ''; // we don't store property priority
  };

  CSSStyleDeclaration.prototype.getPropertyValue = function (propertyName) {
    propertyName = dashToCamel(propertyName);
    return hasOwnProperty(this, propertyName) ? this[propertyName] : '';
  };

  CSSStyleDeclaration.prototype.setProperty = function (propertyName, value/*, priority */) {
    this[dashToCamel(propertyName)] = value;
  };

  CSSStyleDeclaration.prototype.removeProperty = function (propertyName) {
    var oldValue = this.getPropertyValue(propertyName);
    if (oldValue) {
      delete this[dashToCamel(propertyName)];
    }
    return oldValue;
  };

  CSSStyleDeclaration.prototype.valueOf = function () {
    return this;
  };

  CSSStyleDeclaration.prototype.toString = function () {
    var str = '';
    for (var p in this) {
      if (!hasOwnProperty(this, p)) {
        continue;
      }
      str += camelToDash(p) + ': ' + this[p] + '; ';
    }
    return str;
  };

  CSSStyleDeclaration.prototype.setValue = function (style) {
    var list = style.split(';');
    for (var p in list) {
      var pair = p.split(':');
      this[pair[0].trim()] = pair[1].trim();
    }
  };

  Object.defineProperty(CSSStyleDeclaration.prototype, 'cssText', {
    get: function () { return this.toString(); },
    set: function (text) { this.setValue(text); },
    enumerable: true
  });

  function Dataset () { }
  Dataset.prototype = {};

  var voidElementLookup = 'area base br col command embed hr img input keygen link meta param source track wbr'.split(' ').reduce(function (lookup, tagName) {
    lookup[tagName] = true;
    return lookup;
  }, {});

  var shouldNotRender = 'tagName view nodeType isVoidEl parent parentNode childNodes isMounted'.split(' ').reduce(function (lookup, key) {
    lookup[key] = true;
    return lookup;
  }, {});

  var HTMLElement = /*@__PURE__*/(function (Node) {
    function HTMLElement (options) {
      Node.call(this);

      this.attributes = new Attributes();
      this.style = new CSSStyleDeclaration();
      this.dataset = new Dataset();

      this.nodeType = 1;

      for (var key in options) {
        this[key] = options[key];
      }

      if (!this.tagName) {
        this.tagName = 'div';
      }

      this.tagName = this.tagName.toLowerCase();

      Object.defineProperty(this, 'isVoidEl', {
        value: voidElementLookup[this.tagName]
      });
    }

    if ( Node ) HTMLElement.__proto__ = Node;
    HTMLElement.prototype = Object.create( Node && Node.prototype );
    HTMLElement.prototype.constructor = HTMLElement;

    var prototypeAccessors = { classList: { configurable: true },className: { configurable: true },innerHTML: { configurable: true },outerHTML: { configurable: true },firstChild: { configurable: true },textContent: { configurable: true },nextSibling: { configurable: true } };

    HTMLElement.prototype.render = function render (inner) {
      var this$1 = this;

      var isVoidEl = this.isVoidEl;
      var attributes = [];

      var hasChildren = false;
      var content = '';

      for (var key in this) {
        if (key === 'isMounted' ||
         key === 'style' ||
         key === 'attributes' ||
         key === 'dataset' ||
         key === '_classList' ||
         !hasOwnProperty(this, key)) {
          continue;
        }
        if (shouldNotRender[key]/* || !isVoidEl */) { // FIXME: no need?
          if (this.childNodes.length) {
            hasChildren = true;
          }
        } else if (key === '_innerHTML') {
          content = this._innerHTML;
        } else if (!shouldNotRender[key]) {
          // Attributes will be rendered later; avoid rendering them twice.
          if (key in this.attributes) {
            continue;
          }
          if (typeof this[key] === 'function') {
            continue;
          }

          var value = (void 0);
          switch (typeof this[key]) {
            case 'string':
            case 'number':
              value = '"' + this[key] + '"';
              break;

            default:
              // FIXME: is it better to use 'data-${key}' for jQuery .data(key) ?
              value = "'" + JSON.stringify(this[key]) + "'";
          }
          attributes.push(key + '=' + value);
        }
      }

      if (this.className) {
        attributes.push('class="' + this.className + '"');
      }

      var cssText = this.style.cssText;
      if (cssText.length > 0) {
        attributes.push('style="' + cssText + '"');
      }

      var attrNames = Object.keys(this.attributes);
      if (attrNames.length > 0) {
        attrNames
          .filter(function (e) { return e !== 'style' && e !== '_classList'; })
          .map(function (e) { return attributes.push(e + '="' + this$1.attributes[e] + '"'); });
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

    HTMLElement.prototype.setAttribute = function setAttribute (attr, value) {
      var this$1 = this;

      if (attr === 'class') {
        this.classList.splice(0, this.classList.length);
        var classes = value.split(' ');
        classes.forEach(function (cls) { return this$1.classList.add(cls); });
        return;
      }

      var propertyName = attr;

      if (/^data-/.test(attr)) {
        propertyName = dashToCamel(attr);
        this.dataset[propertyName] = value;

        Object.defineProperty(this, propertyName, {
          get: (function (t, a) {
            return function () { return t.dataset[a]; };
          })(this, propertyName),
          enumerable: false,
          configurable: true
        });
      } else if (!hasOwnProperty(this, propertyName)) {
        Object.defineProperty(this, propertyName, {
          get: (function (t, a) {
            return function () { return t.attributes[a]; };
          })(this, propertyName),
          enumerable: true,
          configurable: true
        });
      }

      this.attributes[attr] = value;
    };

    HTMLElement.prototype.getAttribute = function getAttribute (attr) {
      return this.attributes[attr] || this[attr] || null;
    };

    HTMLElement.prototype.removeAttribute = function removeAttribute (attr) {
      if (attr === 'class') {
        this.classList.reset();
        return;
      }
      if (/^data-/.test(attr)) {
        delete this.dataset[dashToCamel(attr)];
      }
      // FIXME: this does not remove attributes set directly on the element
      if (hasOwnProperty(this.attributes, attr)) {
        delete this.attributes[attr];
        delete this[attr];
      }
    };

    HTMLElement.prototype.appendChild = function appendChild (child) {
      if (this.isVoidEl) {
        return child; // Silently ignored
      }
      child.parentNode = this;
      for (var i = 0; i < this.childNodes.length; i++) {
        if (this.childNodes[i] === child) {
          this.childNodes.splice(i, 1);
        }
      }
      this.childNodes.push(child);
      return child;
    };

    HTMLElement.prototype.insertBefore = function insertBefore (child, before) {
      var this$1 = this;

      if (this.isVoidEl) {
        return child; // Silently ignored
      }
      child.parentNode = this;
      if (before == null) {
        this$1.childNodes.push(child);
      } else {
        for (var i = 0; i < this.childNodes.length; i++) {
          if (this$1.childNodes[i] === before) {
            this$1.childNodes.splice(i++, 0, child);
          } else if (this$1.childNodes[i] === child) {
            this$1.childNodes.splice(i, 1);
          }
        }
      }
      return child;
    };

    HTMLElement.prototype.replaceChild = function replaceChild (child, replace) {
      if (this.isVoidEl) {
        return replace; // Silently ignored
      }
      child.parentNode = this;
      for (var i = 0; i < this.childNodes.length; i++) {
        if (this.childNodes[i] === replace) {
          this.childNodes[i] = child;
        }
      }
      return replace;
    };

    HTMLElement.prototype.removeChild = function removeChild (child) {
      if (this.isVoidEl) {
        return child; // Silently ignored
      }
      child.parentNode = null;
      for (var i = 0; i < this.childNodes.length; i++) {
        if (this.childNodes[i] === child) {
          this.childNodes.splice(i, 1);
        }
      }
      return child;
    };

    HTMLElement.prototype.getElementsByTagName = function getElementsByTagName (tagName) {
      var lowerTagName = tagName.toLowerCase();

      if (this.isVoidEl || this.childNodes.length === 0) {
        return [];
      }

      return this.childNodes.reduce(function (results, child) {
        if (child.getElementsByTagName) {
          if (lowerTagName === '*' || child.tagName === lowerTagName) {
            return results.concat(child, child.getElementsByTagName(lowerTagName));
          }

          return results.concat(child.getElementsByTagName(lowerTagName));
        } else {
          return results;
        }
      }, []);
    };

    HTMLElement.prototype.getElementsByClassName = function getElementsByClassName (classNames) {
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

    HTMLElement.prototype.querySelector = function querySelector$1 (query) {
      return querySelector(query, this);
    };

    HTMLElement.prototype.querySelectorAll = function querySelectorAll$1 (query) {
      return querySelectorAll(query, this);
    };

    HTMLElement.prototype.matches = function matches (query) {
      var terms = parseSelector(query);
      if (terms == null || terms.length > 1) {
        return false;
      }
      return elementMatches(this, terms[0]);
    };

    prototypeAccessors.classList.get = function () {
      if (!this._classList) {
        this._classList = new ClassList(this);
      }
      return this._classList;
    };

    prototypeAccessors.className.set = function (v) {
      this.classList.reset(v);
    };

    prototypeAccessors.className.get = function () {
      return this._classList == null ? '' : this._classList.toString();
    };

    prototypeAccessors.innerHTML.get = function () {
      return this._innerHTML || this.render(true);
    };

    prototypeAccessors.innerHTML.set = function (value) {
      this._innerHTML = value;
    };

    prototypeAccessors.outerHTML.get = function () {
      return this.render();
    };

    prototypeAccessors.firstChild.get = function () {
      return this.childNodes[0] || null;
    };

    prototypeAccessors.textContent.get = function () {
      return this.childNodes.filter(function (node) {
        return node instanceof TextNode;
      }).map(function (node) { return node.textContent; }).join('');
    };

    prototypeAccessors.textContent.set = function (str) {
      this.childNodes = [
        new TextNode(str)
      ];
    };

    prototypeAccessors.nextSibling.get = function () {
      var siblings = this.parentNode.childNodes;

      for (var i = 0; i < siblings.length; i++) {
        if (siblings[i] === this) {
          return siblings[i + 1];
        }
      }
      return null;
    };

    Object.defineProperties( HTMLElement.prototype, prototypeAccessors );

    return HTMLElement;
  }(Node));

  Object.defineProperty(HTMLElement.prototype, '_classList', {
    value: null,
    enumerable: false,
    configurable: false,
    writable: true
  });

  'addEventListener blur click focus removeEventListener'.split(' ').forEach(function (fn) {
    HTMLElement.prototype[fn] = function () { return undefined; };
  });

  var SVGElement = /*@__PURE__*/(function (HTMLElement) {
    function SVGElement () {
      HTMLElement.apply(this, arguments);
    }if ( HTMLElement ) SVGElement.__proto__ = HTMLElement;
    SVGElement.prototype = Object.create( HTMLElement && HTMLElement.prototype );
    SVGElement.prototype.constructor = SVGElement;

    

    return SVGElement;
  }(HTMLElement));

  function childRenderer (child) {
    return child.render();
  }

  var Document = function Document () {
    this.documentElement = this.createElement('html');
    this.head = this.documentElement.appendChild(this.createElement('head'));
    this.body = this.documentElement.appendChild(this.createElement('body'));
    this.nodeType = 9;
  };

  Document.prototype.createElement = function createElement (tagName) {
    var element = new HTMLElement({
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
  };

  Document.prototype.createElementNS = function createElementNS (ns, tagName) {
    var element;
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
  };

  Document.prototype.createDocumentFragment = function createDocumentFragment () {
    return (new Document()).body;
  };

  Document.prototype.createTextNode = function createTextNode (text) {
    var textNode = new TextNode(text);

    // element.textNode = this;

    if (!('ownerDocument' in textNode)) {
      Object.defineProperty(textNode, 'ownerDocument', {
        enumerable: false,
        get: (function (t) { return function () { return t; }; })(this)
      });
    }

    return textNode;
  };

  Document.prototype.getElementsByTagName = function getElementsByTagName (tagName) {
    var lowerTagName = tagName.toLowerCase();

    if (lowerTagName === 'html') {
      return [this.documentElement];
    }

    return (lowerTagName === '*'
      ? [this.documentElement].concat(this.documentElement.getElementsByTagName(lowerTagName))
      : this.documentElement.getElementsByTagName(lowerTagName));
  };

  Document.prototype.getElementsByClassName = function getElementsByClassName (classNames) {
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

  Document.prototype.getElementById = function getElementById (id) {
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

  Document.prototype.querySelector = function querySelector$1 (query) {
    return querySelector(query, this);
  };

  Document.prototype.querySelectorAll = function querySelectorAll$1 (query) {
    return querySelectorAll(query, this);
  };

  Document.prototype.implementation = Object.create(null);

  Document.prototype.implementation.hasFeature = function (feature/*, version */) {
    switch (feature) {
      default:
        return false;
    }
  };

  Document.prototype.implementation.createHTMLDocument = function (textContent) {
    var document = new Document();
    document.outerHTML = textContent;
    return document;
  };

  function render (view, inner) {
    var el = view.el || view;

    return el.render(inner);
  }

  exports.Document = Document;
  exports.HTMLElement = HTMLElement;
  exports.Node = Node;
  exports.SVGElement = SVGElement;
  exports.TextNode = TextNode;
  exports.render = render;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
