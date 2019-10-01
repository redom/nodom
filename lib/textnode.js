import { Node } from './node';
import { escapeHTML } from './utils/escapeHTML';

export class TextNode extends Node {
  constructor (text) {
    super();
    this.nodeType = 3;
    this.textContent = String(text);
  }

  render () {
    return escapeHTML(this.textContent);
  }

  get nodeValue () {
    return this.textContent;
  }
}
