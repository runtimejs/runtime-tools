var child_process = require('child_process');

function exec(cmd, args, cb) {
  cb = cb || function() {};
  var p = child_process.spawn(cmd, args, {
    stdio: 'inherit',
    customFds: [process.stdin, process.stdout, process.stderr]
  });

  process.stdin.setRawMode(true);
  p.on('exit', function(code) {
    process.stdin.setRawMode(false);
    if ('function' === typeof cb) {
      return cb(code);
    }
  });
}

module.exports = exec;
