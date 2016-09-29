import { HTMLElement } from './htmlelement'
import { TextNode } from './textnode'

export function Document () {
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
