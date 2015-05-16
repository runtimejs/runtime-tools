// Copyright 2015 runtime.js project authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var chalk = require('chalk');
var shell = require('shelljs');
var running = [];

process.on('SIGINT', function() {
  running.forEach(function(p) {
    p.kill('SIGINT');
  });

  shell.echo(chalk.yellow(' --- interrupted --- '));
  process.exit(0);
});

function shellexec(cmd, cb) {
  var p = shell.exec(cmd, { async: true }, function(code, output) {
    var index = running.indexOf(p);
    if (index > -1) {
      running.splice(index);
    }

    if ('function' === typeof cb) {
      return cb(code, output);
    }
  });

  running.push(p);
}

module.exports = shellexec;
