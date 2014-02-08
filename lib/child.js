var vm = require('vm');

function run(env, script, data) {
  try {
    var sandbox = {};
    if (env) {
      sandbox = require(env).init(data);
    }
    vm.runInNewContext(script, sandbox);
    process.send({
      res: sandbox.res
    });
    process.exit(0);
  } catch (err) {
    return process.exit(2);
  }
}

process.on('message', function(m) {
  if ('script' in m) {
    run(m.env || '', m.script, m.data || '');
  } else {
    process.exit(1);
  }
});
