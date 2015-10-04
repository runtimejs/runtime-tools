var getPrebuilt = require('./get-prebuilt');

module.exports = function(kernelVer, kernelFile, shouldBeLocal, cb) {
  if (!kernelFile) {
    return getPrebuilt(kernelVer, shouldBeLocal, cb);
  } else {
    return cb(null, kernelFile);
  }
};
