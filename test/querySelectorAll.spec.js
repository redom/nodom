import test from 'tape';

import { Document } from '../lib/document';
import { HTMLElement } from '../lib/element';

test('querySelectorAll', t => {
  const doc = new Document();

  doc.documentElement.className = 'up-doc';

  const section = doc.body.appendChild(new HTMLElement({ tagName: 'section' }));

  const div1 = section.appendChild(new HTMLElement({ tagName: 'div', id: 'hello', className: 'beep' }));
  const div2 = section.appendChild(new HTMLElement({ tagName: 'div', className: 'boop' }));
  const div3 = section.appendChild(new HTMLElement({ tagName: 'div', className: 'bzzt' }));

  const p1 = div1.appendChild(new HTMLElement({ tagName: 'p', className: 'beep boop' }));
  const p2 = div1.appendChild(new HTMLElement({ tagName: 'p', className: 'hello' }));
  const p3 = div2.appendChild(new HTMLElement({ tagName: 'p', id: 'world', className: 'beep boop' }));
  const p4 = div2.appendChild(new HTMLElement({ tagName: 'p', className: 'hello-world' }));

  t.test('returns empty array with no results', t => {
    t.plan(2);
    t.deepEqual(doc.querySelectorAll('p.blooper'), []);
    t.deepEqual(doc.querySelectorAll('div div'), []);
  });

  t.test('select with tagName', t => {
    t.plan(1);
    const res = doc.querySelectorAll('p');

    t.deepEqual(res, [p1, p2, p3, p4]);
  });

  t.test('select with className', t => {
    t.plan(1);
    const res = doc.querySelectorAll('.hello');

    t.deepEqual(res, [p2]);
  });

  t.test('select with id', t => {
    t.plan(1);
    const res = doc.querySelectorAll('#world');

    t.deepEqual(res, [p3]);
  });

  t.test('select with tagName and className', t => {
    t.plan(1);
    const res = doc.querySelectorAll('p.hello-world');

    t.deepEqual(res, [p4]);
  });

  t.test('descendant selector', t => {
    t.plan(1);
    const res = doc.querySelectorAll('section p');

    t.deepEqual(res, [p1, p2, p3, p4]);
  });

  t.test('immediate child selector', t => {
    t.plan(1);
    const res = doc.querySelectorAll('div > p');

    t.deepEqual(res, [p1, p2, p3, p4]);
  });

  t.test('adjacent sibling selector', t => {
    t.plan(1);
    const res = doc.querySelectorAll('p + p');

    t.deepEqual(res, [p2, p4]);
  });

  t.test('general sibling selector', t => {
    t.plan(1);
    const res = doc.querySelectorAll('div ~ div.bzzt');

    t.deepEqual(res, [div3]);
  });

  t.test('subtree query', t => {
    t.plan(1);
    const res = section.querySelectorAll('p');

    t.deepEqual(res, [p1, p2, p3, p4]);
  });
});
