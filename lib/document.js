import { HTMLElement } from './htmlelement'
import { TextNode } from './textnode'

export function Document () {
  this.documentElement = this.createElement('html')
  this.head = this.createElement('head')
  this.body = this.createElement('body')
  this.nodeType = 9

  this.documentElement.appendChild(this.head);
  this.documentElement.appendChild(this.body);
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

  return this.documentElement.getElementsByTagName(lowerTagName);
}
