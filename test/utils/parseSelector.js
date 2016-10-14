import test from 'tape';

import { parseSelector } from '../../lib/utils/parseSelector';

test('utils/parseSelector', t => {
  t.deepEqual(parseSelector('p'), [{
    tagName: 'p',
    id: null,
    classNames: null,
    relation: null
  }]);

  t.deepEqual(parseSelector('p.hello'), [{
    tagName: 'p',
    id: null,
    classNames: ['hello'],
    relation: null
  }]);

  t.deepEqual(parseSelector('p.hello.world'), [{
    tagName: 'p',
    id: null,
    classNames: ['hello', 'world'],
    relation: null
  }]);

  t.deepEqual(parseSelector('p#beep'), [{
    tagName: 'p',
    id: 'beep',
    classNames: null,
    relation: null
  }]);

  t.deepEqual(parseSelector('p#beep.boop'), [{
    tagName: 'p',
    id: 'beep',
    classNames: ['boop'],
    relation: null
  }]);

  t.deepEqual(parseSelector('p#beep.boop.bzzt'), [{
    tagName: 'p',
    id: 'beep',
    classNames: ['boop', 'bzzt'],
    relation: null
  }]);

  t.deepEqual(parseSelector('div p'), [{
    tagName: 'p',
    id: null,
    classNames: null,
    relation: ' '
  }, {
    tagName: 'div',
    id: null,
    classNames: null,
    relation: null
  }]);

  t.deepEqual(parseSelector('div > p'), [{
    tagName: 'p',
    id: null,
    classNames: null,
    relation: '>'
  }, {
    tagName: 'div',
    id: null,
    classNames: null,
    relation: null
  }]);

  t.deepEqual(parseSelector('div + p'), [{
    tagName: 'p',
    id: null,
    classNames: null,
    relation: '+'
  }, {
    tagName: 'div',
    id: null,
    classNames: null,
    relation: null
  }]);

  t.deepEqual(parseSelector('p ~ p'), [{
    tagName: 'p',
    id: null,
    classNames: null,
    relation: '~'
  }, {
    tagName: 'p',
    id: null,
    classNames: null,
    relation: null
  }]);

  t.end();
});
