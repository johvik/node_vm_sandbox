node vm sandbox
===============
[![Build Status](https://travis-ci.org/johvik/node_vm_sandbox.png?branch=master)](https://travis-ci.org/johvik/node_vm_sandbox)
[![Coverage Status](https://coveralls.io/repos/johvik/node_vm_sandbox/badge.png?branch=master)](https://coveralls.io/r/johvik/node_vm_sandbox?branch=master)
[![Dependency Status](https://gemnasium.com/johvik/node_vm_sandbox.png)](https://gemnasium.com/johvik/node_vm_sandbox)

Runs a script string in a vm within a child process.

Example usage:
```JavaScript
var sandbox = require('node_vm_sandbox');
sandbox.run({
  script: 'res = "Hello world!"'
}, function(err, res) {
  console.log('Script returned:', res);
});
```

Usage:
```JavaScript
options = {
  script: 'res = "Hello world!"'; // String with JavaScript code. Set `res` with your results.
  env: path.join(__dirname, 'env.js'); // Optional, path to an environment file.
  data: 'abc'; // Optional, will be passed to the environment file.
  timeout: 1000; // Optional, time before the script is terminated, default: 1000.
};
callback = function(err, res) {
  // res will be 'Hello world!'
};
sandbox.run(options, callback);
```

To illustrate the intended usage of the environment file, this shows how to inject `cheerio` into the environment:
```JavaScript
var cheerio = require('cheerio');

exports.init = function(data) {
  // 'data' is passed from the options
  // This example assumes that data is a HTML page
  return {
    $: cheerio.load(data)
  };
  // Now you will be able to use jQuery inside your script!
};
```
