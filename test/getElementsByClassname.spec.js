import { Document } from '../lib/document';
import { HTMLElement } from '../lib/element';

const tape = require('tape');

tape('getElementsByClassName', t => {
  const doc = new Document();

  doc.documentElement.className = 'up-doc';

  const div1 = doc.body.appendChild(new HTMLElement({ tagName: 'div', className: 'beep' }));
  const div2 = doc.body.appendChild(new HTMLElement({ tagName: 'div', className: 'boop' }));

  const p1 = div1.appendChild(new HTMLElement({ tagName: 'p', className: 'beep boop' }));
  const p2 = div2.appendChild(new HTMLElement({ tagName: 'p', className: 'beep boop' }));

  t.test('empty query is always empty result', t => {
    t.plan(1);

    const res = doc.getElementsByClassName('');

    t.equal(res.length, 0);
  });

  t.test('single className matches', t => {
    t.plan(2);

    const res = doc.getElementsByClassName('beep');

    t.equal(res.length, 3);
    t.deepEqual(res, [div1, p1, p2]);
  });

  t.test('all classNames must match', t => {
    t.plan(2);

    const res = doc.getElementsByClassName('beep boop');

    t.equal(res.length, 2);
    t.deepEqual(res, [p1, p2]);
  });

  t.test('descends from element', t => {
    t.plan(2);

    const res = div1.getElementsByClassName('beep');

    t.equal(res.length, 1);
    t.deepEqual(res, [p1]);
  });

  t.test('matches documentElement', t => {
    t.plan(1);

    const res = doc.getElementsByClassName('up-doc');

    t.deepEqual(res, [doc.documentElement]);
  });
});
