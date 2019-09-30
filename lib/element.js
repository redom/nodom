import { ClassList } from './classlist';
import { Node } from './node';
import { TextNode } from './textnode';
import { querySelector, querySelectorAll } from './utils/querySelector';
import { Attributes } from './attributes';
import { CSSStyleDeclaration } from './style';
import { Dataset } from './dataset';
import { dashToCamel } from './utils/notation';
import { elementMatches } from './utils/elementMatches';
import { hasOwnProperty } from './utils/hasOwnProperty';
import { parseSelector } from './utils/parseSelector';

const voidElementLookup = 'area base br col command embed hr img input keygen link meta param source track wbr'.split(' ').reduce(function (lookup, tagName) {
  lookup[tagName] = true;
  return lookup;
}, {});

export function HTMLElement (options) {
  Node.apply(this);

  this.attributes = new Attributes();
  this.style = new CSSStyleDeclaration();
  this.dataset = new Dataset();

  this.nodeType = 1;

  for (const key in options) {
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

export class SVGElement extends HTMLElement {}

HTMLElement.prototype = Object.create(Node.prototype);
HTMLElement.prototype.constructor = HTMLElement;

const noOp = () => undefined;
const noOpMethods = 'blur click focus';

noOpMethods.split(' ').forEach(fn => (HTMLElement.prototype[fn] = noOp));

const shouldNotRender = 'tagName view nodeType isVoidEl parent parentNode childNodes isMounted'.split(' ').reduce((lookup, key) => {
  lookup[key] = true;
  return lookup;
}, {});

HTMLElement.prototype.render = function (inner) {
  const isVoidEl = this.isVoidEl;
  const attributes = [];

  let hasChildren = false;
  let content = '';

  for (const key in this) {
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

      let value;
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

  const cssText = this.style.cssText;
  if (cssText.length > 0) {
    attributes.push('style="' + cssText + '"');
  }

  const attrNames = Object.keys(this.attributes);
  if (attrNames.length > 0) {
    attrNames
      .filter((e) => e !== 'style' && e !== '_classList')
      .map((e) => attributes.push(e + '="' + this.attributes[e] + '"'));
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
    const tagName = this.tagName;
    const tagOpening = [tagName].concat(attributes).join(' ');
    const children = this.childNodes.map(childRenderer).join('');

    return `<${tagOpening}>${children}</${tagName}>`;
  } else if (!isVoidEl && content) {
    const tagName = this.tagName;
    const tagOpening = [this.tagName].concat(attributes).join(' ');

    return `<${tagOpening}>${content}</${tagName}>`;
  } else {
    const tagName = this.tagName;
    const tagOpening = [tagName].concat(attributes).join(' ');

    if (isVoidEl) {
      return `<${tagOpening}>`;
    } else {
      return `<${tagOpening}></${this.tagName}>`;
    }
  }
};

HTMLElement.prototype.addEventListener = function () {};
HTMLElement.prototype.removeEventListener = function () {};

HTMLElement.prototype.setAttribute = function (attr, value) {
  if (attr === 'class') {
    this.classList.splice(0, this.classList.length);
    const classes = value.split(' ');
    classes.forEach((cls) => this.classList.add(cls));
    return;
  }

  let propertyName = attr;

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

HTMLElement.prototype.getAttribute = function (attr) {
  return this.attributes[attr] || this[attr] || null;
};

HTMLElement.prototype.removeAttribute = function (attr) {
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

HTMLElement.prototype.appendChild = function (child) {
  if (this.isVoidEl) {
    return child; // Silently ignored
  }
  child.parentNode = this;
  for (let i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1);
    }
  }
  this.childNodes.push(child);
  return child;
};

HTMLElement.prototype.insertBefore = function (child, before) {
  const this$1 = this;

  if (this.isVoidEl) {
    return child; // Silently ignored
  }
  child.parentNode = this;
  if (before == null) {
    this$1.childNodes.push(child);
  } else {
    for (let i = 0; i < this.childNodes.length; i++) {
      if (this$1.childNodes[i] === before) {
        this$1.childNodes.splice(i++, 0, child);
      } else if (this$1.childNodes[i] === child) {
        this$1.childNodes.splice(i, 1);
      }
    }
  }
  return child;
};

HTMLElement.prototype.replaceChild = function (child, replace) {
  if (this.isVoidEl) {
    return replace; // Silently ignored
  }
  child.parentNode = this;
  for (let i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === replace) {
      this.childNodes[i] = child;
    }
  }
  return replace;
};

HTMLElement.prototype.removeChild = function (child) {
  if (this.isVoidEl) {
    return child; // Silently ignored
  }
  child.parentNode = null;
  for (let i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1);
    }
  }
  return child;
};

HTMLElement.prototype.getElementsByTagName = function (tagName) {
  const lowerTagName = tagName.toLowerCase();

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

HTMLElement.prototype.getElementsByClassName = function (classNames) {
  if (!Array.isArray(classNames)) {
    return this.getElementsByClassName(
      String(classNames)
        .split(' ')
        .map(cn => cn.trim())
        .filter(cn => cn.length > 0));
  } else if (classNames.length === 0) {
    return [];
  }

  return this.childNodes.reduce(function (results, child) {
    const childMatches = classNames.every(cn => child.classList.contains(cn));

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

HTMLElement.prototype.matches = function (query) {
  const terms = parseSelector(query);
  if (terms == null || terms.length > 1) {
    return false;
  }
  return elementMatches(this, terms[0]);
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
      return this.childNodes[0] || null;
    }
  },
  textContent: {
    get: function () {
      return this.childNodes.filter(node => {
        return node instanceof TextNode;
      }).map(node => node.textContent).join('');
    },
    set: function (str) {
      this.childNodes = [
        new TextNode(str)
      ];
    }
  },
  nextSibling: {
    get: function () {
      const siblings = this.parentNode.childNodes;

      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i] === this) {
          return siblings[i + 1];
        }
      }
      return null;
    }
  }
});

function childRenderer (child) {
  return child.render();
}
