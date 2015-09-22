#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
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
  shell.echo('usage: runtime-qemu [--net[=<type>]] [--netdump] [--kvm] [--curses] [--port=<portnum>]...');
  shell.echo('                    [--append=<value>] [--dry-run] [--verbose] [--virtio-rng]');
  shell.echo('                    [--kernel=<kernel>] [--kernelver=<ver>] <initrd>');
  return shell.exit(1);
}

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

getRuntime(kernelVer, kernelFile, function(err, runtimeFile) {
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
