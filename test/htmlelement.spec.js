import test from 'tape';
import { HTMLElement } from '../lib/element';

test('HTMLElement', t => {
  t.test('initially has an ampty className', t => {
    t.plan(1);

    const el = new HTMLElement();

    t.equal(el.className, '');
  });

  t.test('className can be assigned to', t => {
    t.plan(1);

    const el = new HTMLElement();
    el.className = 'beep boop';
    t.equal(el.className, 'beep boop');
  });

  t.test('assigning to className updates classList', t => {
    t.plan(2);

    const el = new HTMLElement();
    el.className = 'beep boop';

    t.equal(el.classList.contains('beep'), true);
    t.equal(el.classList.contains('boop'), true);
  });

  t.test('updating classList updates className', t => {
    t.plan(1);

    const el = new HTMLElement();
    el.classList.add('beep');
    el.classList.add('boop');

    t.equal(el.className, 'beep boop');
  });

  t.test('className and classList are up to date from initial props', t => {
    t.plan(3);

    const el = new HTMLElement({ className: 'beep boop' });

    t.equal(el.className, 'beep boop');
    t.equal(el.classList.contains('beep'), true);
    t.equal(el.classList.contains('boop'), true);
  });

  t.test('has blur, click, and focus methods', t => {
    t.plan(3);

    const el = new HTMLElement();

    ['blur', 'click', 'focus'].forEach(fn => t.equal(typeof el[fn], 'function'));
  });

  t.test('should produce correct HTML', t => {
    t.plan(1);

    const el = new HTMLElement();

    el.classList.add('beep boop');

    t.equals(el.outerHTML, '<div class="beep boop"></div>');
  });
});
