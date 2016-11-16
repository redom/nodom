import test from 'tape';
import { ClassList } from '../lib/classlist';

test('ClassList', t => {
  t.test('returns a className represenation in toString', t => {
    t.plan(1);

    const c = new ClassList({ className: 'beep boop' });

    t.equal(c.toString(), 'beep boop');
  });

  t.test('replaces it\'s contents on reset', t => {
    t.plan(2);

    const c = new ClassList({ className: 'beep boop bzzt' });

    t.equal(c.toString(), 'beep boop bzzt');

    c.reset('hello world');

    t.equal(c.toString(), 'hello world');
  });
});
