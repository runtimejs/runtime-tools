var getPrebuilt = require('./get-prebuilt');

module.exports = function(kernelVer, kernelFile, cb) {
  if (!kernelFile) {
    return getPrebuilt(kernelVer, cb);
  } else {
    return cb(null, kernelFile);
  }
};
