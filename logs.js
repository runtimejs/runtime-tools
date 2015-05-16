var path = require('path');

exports.logPath = path.resolve(__dirname, 'runtime.log');
exports.netdumpPath = path.resolve(__dirname, 'netdump.pcap');
exports.netdumpLogPath = path.resolve(__dirname, 'netdump.log');
