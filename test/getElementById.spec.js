import tape from 'tape';

import { Document } from '../lib/document';
import { HTMLElement } from '../lib/element';

tape('getElementsByClassName', t => {
  const randomId = () => (Math.random() * 1e8 | 0).toString(32);

  const doc = new Document();

  doc.documentElement.id = randomId();

  const div = doc.body.appendChild(new HTMLElement({ tagName: 'div', id: randomId() }));
  const p = div.appendChild(new HTMLElement({ tagName: 'p', id: randomId() }));
  const b = p.appendChild(new HTMLElement({ tagName: 'b', id: randomId() }));

  t.test('matches the documentElement', t => {
    t.plan(1);
    t.equal(doc.getElementById(doc.documentElement.id), doc.documentElement);
  });

  t.test('finds the element anywhere in the document', t => {
    t.plan(1);
    t.equal(doc.getElementById(b.id), b);
  });
});
