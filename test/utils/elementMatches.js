import test from 'tape';

import { HTMLElement } from '../../lib/element';
import { elementMatches } from '../../lib/utils/elementMatches';

const tags = [
  new HTMLElement({ tagName: 'p' }),
  new HTMLElement({ tagName: 'p', className: 'beep boop' }),
  new HTMLElement({ tagName: 'p', className: 'boop beep', id: 'bzzt' })
];

test('utils/elementMatches', t => {
  tags.forEach(el => t.equal(elementMatches(el, {
    tagName: 'p',
    classNames: null,
    id: null
  }), true));

  tags.slice(1).forEach(el => t.equal(elementMatches(el, {
    tagName: 'p',
    classNames: ['beep'],
    id: null
  }), true));

  tags.slice(1).forEach(el => t.equal(elementMatches(el, {
    tagName: 'p',
    classNames: ['beep', 'boop'],
    id: null
  }), true));

  tags.slice(2).forEach(el => t.equal(elementMatches(el, {
    tagName: 'p',
    classNames: ['beep', 'boop'],
    id: 'bzzt'
  }), true));

  tags.forEach(el => t.equal(elementMatches(el, {
    tagName: 'div',
    classNames: null,
    id: null
  }), false));

  tags.forEach(el => t.equal(elementMatches(el, {
    tagName: 'p',
    classNames: ['brrt'],
    id: null
  }), false));

  tags.forEach(el => t.equal(elementMatches(el, {
    tagName: 'p',
    classNames: null,
    id: 'gnngh'
  }), false));

  t.end();
});
