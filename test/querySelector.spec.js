import test from 'tape';

import { Document } from '../lib/document';
import { HTMLElement } from '../lib/element';

test('querySelector', t => {
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

  t.test('returns null with no results', t => {
    t.plan(2);
    t.equal(doc.querySelector('p.blooper'), null);
    t.equal(doc.querySelector('div div'), null);
  });

  t.test('select with tagName', t => {
    t.plan(1);
    const res = doc.querySelector('p');

    t.equal(res, p1);
  });

  t.test('select with className', t => {
    t.plan(1);
    const res = doc.querySelector('.hello');

    t.equal(res, p2);
  });

  t.test('select with id', t => {
    t.plan(1);
    const res = doc.querySelector('#world');

    t.equal(res, p3);
  });

  t.test('select with tagName and className', t => {
    t.plan(1);
    const res = doc.querySelector('p.hello-world');

    t.equal(res, p4);
  });

  t.test('descendant selector', t => {
    t.plan(1);
    const res = doc.querySelector('section p');

    t.equal(res, p1);
  });

  t.test('immediate child selector', t => {
    t.plan(1);
    const res = doc.querySelector('div > p');

    t.equal(res, p1);
  });

  t.test('adjacent sibling selector', t => {
    t.plan(1);
    const res = doc.querySelector('p + p');

    t.equal(res, p2);
  });

  t.test('general sibling selector', t => {
    t.plan(1);
    const res = doc.querySelector('div ~ div.bzzt');

    t.equal(res, div3);
  });

  t.test('subtree query', t => {
    t.plan(1);
    const res = section.querySelector('p');

    t.equal(res, p1);
  });
});
