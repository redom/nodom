import test from 'tape';

import { Document } from '../lib/document';
import { HTMLElement } from '../lib/element';

test('getElementsByTagName', t => {
  const doc = new Document();

  const div1 = doc.body.appendChild(new HTMLElement({ tagName: 'div' }));
  const div2 = doc.body.appendChild(new HTMLElement({ tagName: 'div' }));

  const p1 = div1.appendChild(new HTMLElement({ tagName: 'p' }));
  const p2 = div1.appendChild(new HTMLElement({ tagName: 'p' }));
  const p3 = div2.appendChild(new HTMLElement({ tagName: 'p' }));
  const p4 = div2.appendChild(new HTMLElement({ tagName: 'p' }));

  t.test('the root HTML element is returned', t => {
    t.plan(2);

    const res = doc.getElementsByTagName('html');

    t.equal(res.length, 1);
    t.equal(doc.documentElement, res[0]);
  });

  t.test('all elements with matching tags are returned', t => {
    t.plan(2);

    const res = doc.getElementsByTagName('div');

    t.equal(res.length, 2);
    t.deepEqual(res, [div1, div2]);
  });

  t.test('matching is case-insensitive', t => {
    t.plan(2);

    const res = doc.getElementsByTagName('P');

    t.equal(res.length, 4);
    t.deepEqual(res, [p1, p2, p3, p4]);
  });

  t.test('* matches all tags in traversal order', t => {
    t.plan(2);

    const res = doc.getElementsByTagName('*');

    t.equal(res.length, 9);
    t.deepEqual(res, [doc.documentElement, doc.head, doc.body, div1, p1, p2, div2, p3, p4]);
  });

  t.test('* matches all tags below the query root element', t => {
    t.plan(2);

    const res = div2.getElementsByTagName('*');

    t.equal(res.length, 2);
    t.deepEqual(res, [p3, p4]);
  });
});
