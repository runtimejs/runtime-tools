## SYNOPSIS

runtime.js tools

[![Build Status](https://travis-ci.org/runtimejs/runtime-tools.svg)](https://travis-ci.org/runtimejs/runtime-tools)

## USAGE

```
npm install -g runtime-tools
runtime-qemu ./initrd
```

List of options:

```
runtime-qemu [--net[=<type>]] [--netdump] [--kvm] [--curses] [--port=<portnum>]...
             [--append=<value>] [--dry-run] [--verbose] [--virtio-rng] [--nographic]
             [--kernel=<kernel>] [--kernelver=<ver>] <initrd>
runtime-qemu --print-log
runtime-qemu --print-netdump

  --net[=<type>=user]   Enable network (type can be "user", "tap" or "bridge",
                        defaults to user)
  --netdump             Save network activity to the file
  --kvm                 Enable Linux KVM (much faster virtualization)
  --curses              Text-mode graphics
  --port=<portnum>      Redirect TCP/UDP connections on the host port to the runtime.js
                        (port 9000 redirected by default automatically)
  --append=<value>      Append string to runtime.js command line
  --dry-run             Test input but do not launch QEMU
  --verbose             Output extra info like QEMU command line
  --virtio-rng          Enable VIRTIO-RNG entropy source for the runtime.js
  --nographic           Disable graphics
  --kernel=<kernel>     Specify local kernel file to use
  --kernelver=<ver>     Specify kernel version to download (defaults to latest)

  --print-log           Show log file written in curses mode (using less)
  --print-netdump       Show network log written in netdump mode (using less)

  <initrd>              Source code bundle
```

##LICENSE

Apache License, Version 2.0
