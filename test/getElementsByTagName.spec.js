const tape = require('tape');

const { Document, HTMLElement } = require('../dist/nodom');

tape('getElementsByTagName', t => {
  t.test('the root HTML element is returned', t => {
    t.plan(2);

    const doc = new Document();
    const res = doc.getElementsByTagName('html');

    t.equal(res.length, 1);
    t.equal(doc.documentElement, res[0]);
  });

  t.test('all elements with matching tags are returned', t => {
    t.plan(1);

    const doc = new Document();

    doc.body.appendChild(new HTMLElement({ tagName: 'p' }));
    doc.body.appendChild(new HTMLElement({ tagName: 'p' }));
    doc.body.appendChild(new HTMLElement({ tagName: 'p' }));
    doc.body.appendChild(new HTMLElement({ tagName: 'p' }));

    const res = doc.getElementsByTagName('p');

    t.equal(res.length, 4);
  });

  t.test('matching is case-insensitive', t => {
    t.plan(1);

    const doc = new Document();

    doc.body.appendChild(new HTMLElement({ tagName: 'p' }));
    doc.body.appendChild(new HTMLElement({ tagName: 'p' }));
    doc.body.appendChild(new HTMLElement({ tagName: 'p' }));
    doc.body.appendChild(new HTMLElement({ tagName: 'p' }));

    const res = doc.getElementsByTagName('P');

    t.equal(res.length, 4);
  });
});
