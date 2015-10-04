#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2), {
  boolean: ['kvm', 'verbose', 'nographic', 'dry-run', 'netdump', 'curses', 'virtio-rng', 'local']
});
var shell = require('shelljs');
var qemu = require('../qemu');
var getRuntime = require('../get-runtime');
var logs = require('../logs');
var rawExec = require('../raw-exec');
var shellExec = require('../shell-exec');
var chalk = require('chalk');

var printLog = argv['print-log'];
var printNetdump = argv['print-netdump'];

if (printLog) {
  return rawExec('less', [logs.logPath], function(err) {
    return shell.exit(err ? 1 : 0);
  })
}

if (printNetdump) {
  return shellExec('tcpdump -ns 0 -X -vvv -r ' + logs.netdumpPath + ' > ' + logs.netdumpLogPath, function(code, output) {
    if (0 !== code) {
      shell.echo(chalk.red('error: tcpdump failed'));
      return shell.exit(1);
    }

    return rawExec('less', [logs.netdumpLogPath], function(err) {
      return shell.exit(err ? 1 : 0);
    });
  });
}

var command = argv._[0];
if (!command) {
  shell.echo('runtime-qemu [--net[=<type>]] [--netdump] [--kvm] [--curses] [--port=<portnum>]...');
  shell.echo('             [--append=<value>] [--dry-run] [--verbose] [--virtio-rng] [--nographic]');
  shell.echo('             [--kernel=<kernel>] [--kernelver=<ver>] <initrd>');
  shell.echo('runtime-qemu --print-log');
  shell.echo('runtime-qemu --print-netdump');
  shell.echo('');
  shell.echo('  --net[=<type>=user]   Enable network (type can be "user", "tap" or "bridge",');
  shell.echo('                        defaults to user)');
  shell.echo('  --netdump             Save network activity to the file');
  shell.echo('  --kvm                 Enable Linux KVM (much faster virtualization)');
  shell.echo('  --curses              Text-mode graphics');
  shell.echo('  --port=<portnum>      Redirect TCP/UDP connections on the host port to the runtime.js');
  shell.echo('                        (port 9000 redirected by default automatically)');
  shell.echo('  --append=<value>      Append string to runtime.js command line');
  shell.echo('  --dry-run             Test input but do not launch QEMU');
  shell.echo('  --verbose             Output extra info like QEMU command line');
  shell.echo('  --virtio-rng          Enable VIRTIO-RNG entropy source for the runtime.js');
  shell.echo('  --nographic           Disable graphics');
  shell.echo('  --kernel=<kernel>     Specify local kernel file to use');
  shell.echo('  --local               Download the kernel locally (i.e. in the module\'s directory)');
  shell.echo('  --kernelver=<ver>     Specify kernel version to download (defaults to latest)');
  shell.echo('');
  shell.echo('  --print-log           Show log file written in curses mode (using less)');
  shell.echo('  --print-netdump       Show network log written in netdump mode (using less)');
  shell.echo('');
  shell.echo('  <initrd>              Source code bundle');
  return shell.exit(1);
}

// fix for QEMU stdout on Windows
process.env.SDL_STDIO_REDIRECT = 'no';

var kernelFile = String(argv.kernel || '');
var initrdFile = String(argv._[0] || '');

var qemuNet = 'user';
if (typeof argv.net === 'string') {
  qemuNet = argv.net;
}

var extraPorts = [];
if (typeof argv.port === 'number') {
  extraPorts = [argv.port];
}
if (argv.port instanceof Array) {
  extraPorts = argv.port;
}

var defaultKernelVersion = require('../package.json').runtimejsKernelVersion;
var kernelVer = argv.kernelver || defaultKernelVersion;

var qemuNetdump = !!argv.netdump;
var qemuCurses = !!argv.curses;
var qemuKVM = !!argv.kvm;
var qemuAppend = typeof argv.append === 'string' ? argv.append : '';
var qemuNographic = !!argv.nographic;
var qemuVirtioRng = !!argv['virtio-rng'];

var dryRun = !!argv['dry-run'];
var verbose = !!argv.verbose;

getRuntime(kernelVer, kernelFile, !!argv.local, function(err, runtimeFile) {
  if (err) {
    throw err;
  }

  kernelFile = runtimeFile;

  qemu({
    initrd: initrdFile,
    kernel: kernelFile,
    net: qemuNet,
    netdump: qemuNetdump,
    curses: qemuCurses,
    kvm: qemuKVM,
    append: qemuAppend,
    dryRun: dryRun,
    verbose: verbose,
    virtioRng: qemuVirtioRng,
    nographic: qemuNographic,
    ports: extraPorts
  });
});
