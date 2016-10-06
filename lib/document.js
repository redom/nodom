import { HTMLElement } from './htmlelement'
import { TextNode } from './textnode'

export function Document () {
  this.documentElement = this.createElement('html')
  this.head = this.documentElement.appendChild(this.createElement('head'))
  this.body = this.documentElement.appendChild(this.createElement('body'))
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

Document.prototype.getElementsByTagName = function (tagName) {
  const lowerTagName = tagName.toLowerCase();

  if (lowerTagName === 'html') {
    return [this.documentElement];
  }

  return (lowerTagName === '*'
    ? [this.documentElement].concat(this.documentElement.getElementsByTagName(lowerTagName))
    : this.documentElement.getElementsByTagName(lowerTagName));
}

Document.prototype.getElementsByClassName = function (classNames) {
  if (!Array.isArray(classNames)) {
    return this.getElementsByClassName(
      String(classNames)
        .split(' ')
        .map(cn => cn.trim())
        .filter(cn => cn.length > 0))
  } else if (classNames.length === 0) {
    return []
  }

  const documentNodeMatches = classNames.every(cn => this.documentElement.classList.contains(cn))

  return this.documentElement.childNodes.reduce(function (results, child) {
    const childMatches = classNames.every(cn => child.classList.contains(cn))

    return (childMatches
      ? results.concat(child, child.getElementsByClassName(classNames))
      : results.concat(child.getElementsByClassName(classNames)))
  }, documentNodeMatches ? [this.documentElement] : [])
}

Document.prototype.getElementById = function (id) {
  if (this.documentElement.id === id) {
    return this.documentElement;
  }

  function matchIdInNodes(id, nodes) {
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
