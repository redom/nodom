(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.nodom = global.nodom || {})));
}(this, (function (exports) { 'use strict';

function ClassList (el) {
  var this$1 = this;

  var classNames = (this.className && this.className.split(' ')) || []

  this.length = classNames.length

  for (var i = 0; i < classNames.length; i++) {
    this$1[i] = classNames[i]
  }

  this._updateClassName = function () {
    el.className = this.join(' ')
  }
}

ClassList.prototype = []

ClassList.prototype.add = function (className) {
  if (!this.contains(className)) {
    this.push(className)
    this._updateClassName()
  }
}

ClassList.prototype.contains = function (className) {
  var this$1 = this;

  for (var i = 0; i < this.length; i++) {
    if (this$1[i] === className) {
      return true
    }
  }
  return false
}

ClassList.prototype.remove = function (className) {
  var this$1 = this;

  var classNames = this.classNames

  for (var i = 0; i < this.length; i++) {
    if (classNames[i] === className) {
      this$1.splice(i, 1)
      this$1._updateClassName()
    }
  }
}

function Node () {}

Node.prototype.cloneNode = function (deep) {
  var Class = Object.getPrototypeOf(this)

  return new Class.constructor(this)
}

function TextNode (text) {
  this.nodeType = 3
  this.textContent = text
}

TextNode.prototype = Object.create(Node.prototype)
TextNode.prototype.constructor = TextNode

TextNode.prototype.render = function () {
  return this.textContent
}

var voidElementLookup = 'area base br col command embed hr img input keygen link meta param source track wbr'.split(' ').reduce(function (lookup, tagName) {
  lookup[tagName] = true
  return lookup
}, {})

function HTMLElement (options) {
  var this$1 = this;

  this.childNodes = []
  this.style = {}
  this.nodeType = 1

  for (var key in options) {
    this$1[key] = options[key]
  }

  if (!this.tagName) {
    this.tagName = 'div'
  }

  this.tagName = this.tagName.toLowerCase()

  Object.defineProperty(this, 'isVoidEl', {
    value: voidElementLookup[this.tagName]
  })
}

HTMLElement.prototype = Object.create(Node.prototype)
HTMLElement.prototype.constructor = HTMLElement

var shouldNotRender = 'tagName view nodeType isVoidEl parent parentNode childNodes isMounted'.split(' ').reduce(function (lookup, key) {
  lookup[key] = true
  return lookup
}, {})

HTMLElement.prototype.render = function (inner) {
  var this$1 = this;

  var isVoidEl = this.isVoidEl
  var attributes = []

  var hasChildren = false
  var content = ''

  for (var key in this) {
    if (key === 'isMounted' || !this$1.hasOwnProperty(key)) {
      continue
    }
    if (shouldNotRender[key] || !isVoidEl) {
      if (this$1.childNodes.length) {
        hasChildren = true
      }
    } else if (key === 'className') {
      attributes.push('class="' + this$1[key] + '"')
    } else if (key === '_innerHTML') {
      content = this$1._innerHTML
    } else if (key === 'style') {
      var styles = ''

      for (var styleName in this.style) {
        styles += styleName + ':' + this$1.style[styleName] + ';'
      }

      if (styles && styles.length) {
        attributes.push('style="' + styles + '"')
      }
    } else if (!shouldNotRender[key]) {
      if (typeof this$1[key] === 'function') {
        continue
      }
      attributes.push(key + '="' + this$1[key] + '"')
    }
  }

  if (inner) {
    if (!isVoidEl && hasChildren) {
      return this.childNodes.map(childRenderer).join('')
    } else if (!isVoidEl && content) {
      return content
    } else {
      return ''
    }
  }

  if (!isVoidEl && hasChildren) {
    var tagName = this.tagName
    var tagOpening = [tagName].concat(attributes).join(' ')
    var children = this.childNodes.map(childRenderer).join('')

    return ("<" + tagOpening + ">" + children + "</" + tagName + ">")
  } else if (!isVoidEl && content) {
    var tagName$1 = this.tagName
    var tagOpening$1 = [this.tagName].concat(attributes).join(' ')

    return ("<" + tagOpening$1 + ">" + content + "</" + tagName$1 + ">")
  } else {
    var tagName$2 = this.tagName
    var tagOpening$2 = [tagName$2].concat(attributes).join(' ')

    if (isVoidEl) {
      return ("<" + tagOpening$2 + ">")
    } else {
      return ("<" + tagOpening$2 + "></" + (this.tagName) + ">")
    }
  }
}

HTMLElement.prototype.addEventListener = function () {}
HTMLElement.prototype.removeEventListener = function () {}

HTMLElement.prototype.setAttribute = function (attr, value) {
  this[attr] = value
}

HTMLElement.prototype.getAttribute = function (attr) {
  return this[attr]
}

HTMLElement.prototype.appendChild = function (child) {
  var this$1 = this;

  if (this.isVoidEl) {
    return // Silently ignored
  }
  child.parentNode = this
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this$1.childNodes[i] === child) {
      this$1.childNodes.splice(i, 1)
    }
  }
  this.childNodes.push(child)
}

HTMLElement.prototype.insertBefore = function (child, before) {
  var this$1 = this;

  if (this.isVoidEl) {
    return // Silently ignored
  }
  child.parentNode = this
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this$1.childNodes[i] === before) {
      this$1.childNodes.splice(i++, 0, child)
    } else if (this$1.childNodes[i] === child) {
      this$1.childNodes.splice(i, 1)
    }
  }
}

HTMLElement.prototype.replaceChild = function (child, replace) {
  var this$1 = this;

  if (this.isVoidEl) {
    return // Silently ignored
  }
  child.parentNode = this
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this$1.childNodes[i] === replace) {
      this$1.childNodes[i] = child
    }
  }
}

HTMLElement.prototype.removeChild = function (child) {
  var this$1 = this;

  if (this.isVoidEl) {
    return // Silently ignored
  }
  child.parentNode = null
  for (var i = 0; i < this.childNodes.length; i++) {
    if (this$1.childNodes[i] === child) {
      this$1.childNodes.splice(i, 1)
    }
  }
}

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
        this._classList = new ClassList(this)
      }
      return this._classList
    }
  },
  innerHTML: {
    get: function () {
      return this._innerHTML || this.render(true)
    },
    set: function (value) {
      this._innerHTML = value
    }
  },
  outerHTML: {
    get: function () {
      return this.render()
    }
  },
  firstChild: {
    get: function () {
      return this.childNodes[0]
    }
  },
  textContent: {
    get: function () {
      return this.childNodes.filter(function (node) {
        return node instanceof TextNode
      }).map(function (node) { return node.textContent; }).join('')
    },
    set: function (str) {
      this.childNodes = [
        new TextNode(str)
      ]
    }
  },
  nextSibling: {
    get: function () {
      var this$1 = this;

      var siblings = this.parentNode.childNodes

      for (var i = 0; i < siblings.length; i++) {
        if (siblings[i] === this$1) {
          return siblings[i + 1]
        }
      }
    }
  }
})

function childRenderer (child) {
  return child.render()
}

function Document () {
  this.head = this.createElement('head')
  this.body = this.createElement('body')
  this.nodeType = 9
}

Document.prototype.createElement = function (tagName) {
  return new HTMLElement({
    tagName: tagName
  })
}

Document.prototype.createElementNS = function (ns, tagName) {
  return new HTMLElement({
    tagName: tagName
  })
}

Document.prototype.createTextNode = function (text) {
  return new TextNode(text)
}

function render (view, inner) {
  var el = view.el || view

  return el.render(inner)
}

exports.Document = Document;
exports.HTMLElement = HTMLElement;
exports.Node = Node;
exports.render = render;
exports.TextNode = TextNode;

Object.defineProperty(exports, '__esModule', { value: true });

})));
