const tape = require('tape');

const { Document, HTMLElement } = require('../dist/nodom');

tape('getElementsByTagName', t => {
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
});
