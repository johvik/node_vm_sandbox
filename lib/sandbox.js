var path = require('path');
var cp = require('child_process');

var child = path.join(__dirname, 'child.js');

exports.run = function(options, callback) {
  var doneCalled = false;
  var timedOut = false;
  var res = {};

  // Done callback is used in error and exit
  // It must only be called once
  var done = function(err, exit) {
    if (doneCalled) {
      return;
    }
    doneCalled = true;

    clearTimeout(tooSlow);
    // Make sure child is killed
    if (exit !== true) {
      n.kill('SIGKILL');
    } else if (err !== 0) {
      // err = error code when exit
      switch (err) {
        case 1:
          err = 'Child did not get a script';
          break;
        case 2:
          err = 'Child threw an exception';
          break;
        default:
          err = 'Unexpected error code: ' + err;
          break;
      }
    } else {
      err = null;
    }

    // Check if it timed out
    if (timedOut === true) {
      err = 'Script timed out';
    }

    return callback(err, res);
  };

  // Start the child process
  var n = cp.fork(child);

  // Limit the run-time of the child
  var tooSlow = setTimeout(function() {
    timedOut = true;
    n.kill('SIGKILL');
  }, options.timeout || 1000);

  n.on('message', function(m) {
    if ('res' in m) {
      res = m.res;
    }
  });

  n.on('exit', function(code) {
    done(code, true);
  });

  n.on('error', function(err) {
    done(err, false);
  });

  // Child runs the script when data is sent
  n.send(options);
};
