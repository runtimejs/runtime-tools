var getPrebuilt = require('./get-prebuilt');
var defaultKernelVersion = require('./package.json').runtimejsKernelVersion;

module.exports = function(kernelFile, cb) {
  if (!kernelFile) {
    return getPrebuilt(defaultKernelVersion, cb);
  } else {
    return cb(null, kernelFile);
  }
};
