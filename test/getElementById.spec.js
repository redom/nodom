const tape = require('tape');

const { Document, HTMLElement } = require('../dist/nodom');

tape('getElementsByClassName', t => {
  const randomId = () => (Math.random() * 1e8 | 0).toString(32);

  const doc = new Document();

  doc.documentElement.id = randomId();

  const div1 = doc.body.appendChild(new HTMLElement({ tagName: 'div', id: randomId() }));
  const div2 = doc.body.appendChild(new HTMLElement({ tagName: 'div', id: randomId() }));

  const p1 = div1.appendChild(new HTMLElement({ tagName: 'p', id: randomId() }));
  const p2 = div1.appendChild(new HTMLElement({ tagName: 'p', id: randomId() }));
  const p3 = div2.appendChild(new HTMLElement({ tagName: 'p', id: randomId() }));
  const p4 = div2.appendChild(new HTMLElement({ tagName: 'p', id: randomId() }));

  const b1 = p3.appendChild(new HTMLElement({ tagName: 'b', id: randomId() }))

  t.test('matches the documentElement', t => {
    t.plan(1);
    t.equal(doc.getElementById(doc.documentElement.id), doc.documentElement);
  });

  t.test('finds the element anywhere in the document', t => {
    t.plan(1);
    t.equal(doc.getElementById(b1.id), b1);
  });
});