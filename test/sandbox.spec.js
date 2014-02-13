process.env.NODE_ENV = 'test';

var path = require('path');
var should = require('should');

var sandbox = require('../');

describe('sandbox', function() {
  it('should not run', function(done) {
    sandbox.run.should.throwError();
    done();
  });

  it('should callback', function(done) {
    sandbox.run({
      script: 'res = 123;'
    }, function(err, res) {
      should.not.exist(err);
      res.should.equal(123);
      done();
    });
  });

  it('should timeout', function(done) {
    sandbox.run({
      script: 'while(1);'
    }, function(err) {
      err.should.equal('Script timed out');
      done();
    });
  });

  it('should return error', function(done) {
    sandbox.run({}, function(err) {
      err.should.equal('Child did not get a script');
      done();
    });
  });

  it('should throw', function(done) {
    sandbox.run({
      script: 'throw 1;'
    }, function(err) {
      err.should.equal('Child threw an exception');
      done();
    });
  });

  it('should use env and data', function(done) {
    sandbox.run({
      env: path.join(__dirname, 'test_env.js'),
      script: 'res = env;',
      data: 'abc'
    }, function(err, res) {
      should.not.exist(err);
      res.should.equal('abc');
      done();
    });
  });

  it('should handle object data', function(done) {
    sandbox.run({
      env: path.join(__dirname, 'test_env.js'),
      script: 'res = env.test;\n' +
        'res.ret = env.s;',
      data: {
        test: {
          a: 'b',
          c: 1.5
        },
        s: 'abc'
      }
    }, function(err, res) {
      should.not.exist(err);
      res.should.eql({
        a: 'b',
        c: 1.5,
        ret: 'abc'
      });
      done();
    });
  });
});
