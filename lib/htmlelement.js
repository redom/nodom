import { ClassList } from './classlist'
import { Node } from './node'
import { TextNode } from './textnode'
import { querySelector, querySelectorAll } from './utils/querySelector'

const voidElementLookup = 'area base br col command embed hr img input keygen link meta param source track wbr'.split(' ').reduce(function (lookup, tagName) {
  lookup[tagName] = true
  return lookup
}, {})

export function HTMLElement (options) {
  this.childNodes = []
  this.style = {}
  this.nodeType = 1

  for (const key in options) {
    this[key] = options[key]
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

const shouldNotRender = 'tagName view nodeType isVoidEl parent parentNode childNodes isMounted'.split(' ').reduce((lookup, key) => {
  lookup[key] = true
  return lookup
}, {})

HTMLElement.prototype.render = function (inner) {
  const isVoidEl = this.isVoidEl
  const attributes = []

  let hasChildren = false
  let content = ''

  for (const key in this) {
    if (key === 'isMounted' || !this.hasOwnProperty(key)) {
      continue
    }
    if (shouldNotRender[key] || !isVoidEl) {
      if (this.childNodes.length) {
        hasChildren = true
      }
    } else if (key === 'className') {
      attributes.push('class="' + this[key] + '"')
    } else if (key === '_innerHTML') {
      content = this._innerHTML
    } else if (key === 'style') {
      let styles = ''

      for (const styleName in this.style) {
        styles += styleName + ':' + this.style[styleName] + ';'
      }

      if (styles && styles.length) {
        attributes.push('style="' + styles + '"')
      }
    } else if (!shouldNotRender[key]) {
      if (typeof this[key] === 'function') {
        continue
      }
      attributes.push(key + '="' + this[key] + '"')
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
    const tagName = this.tagName
    const tagOpening = [tagName].concat(attributes).join(' ')
    const children = this.childNodes.map(childRenderer).join('')

    return `<${tagOpening}>${children}</${tagName}>`
  } else if (!isVoidEl && content) {
    const tagName = this.tagName
    const tagOpening = [this.tagName].concat(attributes).join(' ')

    return `<${tagOpening}>${content}</${tagName}>`
  } else {
    const tagName = this.tagName
    const tagOpening = [tagName].concat(attributes).join(' ')

    if (isVoidEl) {
      return `<${tagOpening}>`
    } else {
      return `<${tagOpening}></${this.tagName}>`
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
  if (this.isVoidEl) {
    return // Silently ignored
  }
  child.parentNode = this
  for (let i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1)
    }
  }
  this.childNodes.push(child)
  return child
}

HTMLElement.prototype.insertBefore = function (child, before) {
  if (this.isVoidEl) {
    return // Silently ignored
  }
  child.parentNode = this
  for (let i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === before) {
      this.childNodes.splice(i++, 0, child)
    } else if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1)
    }
  }
}

HTMLElement.prototype.replaceChild = function (child, replace) {
  if (this.isVoidEl) {
    return // Silently ignored
  }
  child.parentNode = this
  for (let i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === replace) {
      this.childNodes[i] = child
    }
  }
}

HTMLElement.prototype.removeChild = function (child) {
  if (this.isVoidEl) {
    return // Silently ignored
  }
  child.parentNode = null
  for (let i = 0; i < this.childNodes.length; i++) {
    if (this.childNodes[i] === child) {
      this.childNodes.splice(i, 1)
    }
  }
}

HTMLElement.prototype.getElementsByTagName = function (tagName) {
  const lowerTagName = tagName.toLowerCase()

  if (this.isVoidEl || this.childNodes.length === 0) {
    return []
  }

  return this.childNodes.reduce(function (results, child) {
    if (lowerTagName === '*' || child.tagName === lowerTagName) {
      return results.concat(child, child.getElementsByTagName(lowerTagName))
    }

    return results.concat(child.getElementsByTagName(lowerTagName))
  }, [])
}

HTMLElement.prototype.getElementsByClassName = function (classNames) {
  if (!Array.isArray(classNames)) {
    return this.getElementsByClassName(
      String(classNames)
        .split(' ')
        .map(cn => cn.trim())
        .filter(cn => cn.length > 0))
  } else if (classNames.length === 0) {
    return []
  }

  return this.childNodes.reduce(function (results, child) {
    const childMatches = classNames.every(cn => child.classList.contains(cn))

    return (childMatches
      ? results.concat(child, child.getElementsByClassName(classNames))
      : results.concat(child.getElementsByClassName(classNames)))
  }, [])
}

HTMLElement.prototype.querySelector = function (query) {
  return querySelector(query, this)
}

HTMLElement.prototype.querySelectorAll = function (query) {
  return querySelectorAll(query, this)
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
      return this.childNodes.filter(node => {
        return node instanceof TextNode
      }).map(node => node.textContent).join('')
    },
    set: function (str) {
      this.childNodes = [
        new TextNode(str)
      ]
    }
  },
  nextSibling: {
    get: function () {
      const siblings = this.parentNode.childNodes

      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i] === this) {
          return siblings[i + 1]
        }
      }
    }
  }
})

function childRenderer (child) {
  return child.render()
}
