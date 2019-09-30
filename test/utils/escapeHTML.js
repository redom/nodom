import test from 'tape';

import { escapeHTML } from '../../lib/utils/escapeHTML';

test('utils/escapeHTML', t => {
  t.equal(escapeHTML('beep >&<'), 'beep &gt;&amp;&lt;');

  t.equal(escapeHTML('>>beep<<'), '&gt;&gt;beep&lt;&lt;');

  t.equal(escapeHTML('beep\n<boop>\n<brrt>'), 'beep\n&lt;boop&gt;\n&lt;brrt&gt;');

  t.end();
});
