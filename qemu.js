var chalk = require('chalk');
var shell = require('shelljs');
var pathUtils = require('path');
var shellExec = require('./shell-exec');
var rawExec = require('./raw-exec');
var getRuntime = require('./get-runtime');
var logs = require('./logs');

var qemu = 'qemu-system-x86_64';

function testQemu() {
  if (!shell.which(qemu)) {
    shell.echo(chalk.red('error: qemu is not installed (qemu-system-x86_64)'));
    return shell.exit(1);
  }
}

function getQemuArgs(opts) {
  var initrdPath = opts.initrd;
  var kernelPath = opts.kernel;

  if (!initrdPath) {
    shell.echo(chalk.red('error: initrd file required'));
    return shell.exit(1);
  }

  if (!shell.test('-f', initrdPath)) {
    shell.echo(chalk.red('error: initrd file "' + initrdPath + '" does not exist'));
    return shell.exit(1);
  }

  if (!shell.test('-f', kernelPath)) {
    shell.echo(chalk.red('error: kernel file "' + kernelPath + '" does not exist'));
    return shell.exit(1);
  }

  var a = [
    '-m 512',
    '-smp 1',
    '-s',
    '-kernel ' + kernelPath,
    '-initrd ' + initrdPath,
  ];

  if (opts.net && opts.net !== 'none') {
    a.push('-net nic,model=virtio,macaddr=1a:46:0b:ca:bc:7c');

    switch (opts.net) {
    case 'tap':
    case 'bridge':
      a.push('-net bridge');
      break;
    case 'user':
      a.push('-net user,net=192.168.76.0/24,dhcpstart=192.168.76.9,hostfwd=udp::9000-:9000,hostfwd=tcp::9000-:9000');
      break;
    default:
      shell.echo(chalk.red('error: unknown network type (supported tap/bridge/user)'));
      return shell.exit(1);
    }
  }

  if (opts.nographic) {
    a.push('-nographic');
    a.push('-monitor none');
  }

  if (opts.netdump) {
    a.push('-net dump,file=' + logs.netdumpPath);
  }

  if (opts.virtioRng) {
    a.push('-device virtio-rng-pci');
  }

  if (opts.kvm) {
    a.push('-enable-kvm');
    a.push('-no-kvm-irqchip');
  }

  if (opts.curses) {
    a.push('-curses');
    a.push('-serial file:' + logs.logPath);
  } else {
    a.push('-serial stdio');
  }

  if (opts.append) {
    a.push('-append "' + opts.append + '"');
  }

  return a;
}

module.exports = function(opts) {
  testQemu();

  var qemuArgs = getQemuArgs(opts);
  var line = qemu + ' ' + qemuArgs.join(' ');

  if (opts.verbose) {
    console.log(line);
  }

  if (opts.dryRun) {
    shell.exit(0);
  }

  shell.echo(chalk.green(' --- starting qemu --- '));
  if (opts.curses) {
    rawExec(qemu, qemuArgs.join(' ').split(' '));
  } else {
    shellExec(line);
  }
};
