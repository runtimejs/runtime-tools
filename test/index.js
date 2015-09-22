var execFile = require('child_process').execFile;
var path = require('path');
var test = require('tape');

test('runtime-qemu', function(t) {
  var args = [
    '--verbose',
    '--nographic',
    '--dry-run',
    path.resolve(__dirname, 'initrd')
  ];

  execFile(path.resolve(__dirname, '../bin/runtime-qemu.js'), args, function(error, stdout, stderr) {
    console.log(stdout.toString());
    t.notOk(error);
    t.end();
  });
});
