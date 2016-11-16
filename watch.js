const cp = require('child_process');
const chokidar = require('chokidar');

exec('npm', ['run', 'build']);
exec('npm', ['run', 'uglify']);

chokidar.watch('dist/nodom.js')
  .on('change', () => exec('npm', ['run', 'uglify']));

chokidar.watch('lib/**/*.js')
  .on('change', () => exec('npm', ['run', 'build']));

function exec (cmd, args) {
  const child = cp.spawn(cmd, args);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}
