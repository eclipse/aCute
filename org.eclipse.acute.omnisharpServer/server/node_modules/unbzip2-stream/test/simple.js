var unbzip2Stream = require('../');
var concat = require('concat-stream');
var test = require('tape');
var fs = require('fs');

test('one chunk of compressed data piped into unbzip2-stream results in original file content', function(t) {
    t.plan(1);
    var compressed = fs.readFileSync('test/fixtures/text.bz2');
    var unbz2 = unbzip2Stream();
    unbz2.pipe( concat(function(data) {
        var expected = "Hello World!\nHow little you are. now.\n\n";
        t.equal(data.toString('utf-8'), expected);
    }));

    unbz2.write(compressed);
    unbz2.end();

});

test('should emit error when stream is broken', function(t) {
    t.plan(1);
    var compressed = fs.readFileSync('test/fixtures/broken');
    var unbz2 = unbzip2Stream();
    unbz2.on('error', function(err) {
        t.ok(true, err.message);
    });
    unbz2.pipe( concat(function(data) {
        var expected = "Hello World!\nHow little you are. now.\n\n";
        t.ok(false, 'we should not get here');
    }));

    unbz2.write(compressed);
    unbz2.end();

});

test('should emit error when stream is broken in a different way?', function(t) {
    t.plan(1);
    // this is the smallest truncated file I found that reproduced the bug, but
    // longer files will also work.
    var truncated = 'test/fixtures/truncated.bz2';

    fs.createReadStream(truncated).
        on('error', function (err) {
            t.ok(false, "The file stream itself should not be failing.");
        }).
        pipe(unbzip2Stream()).
        on('error', function (err) {
            t.ok(true, err);
        }).
        on('close', function (err) {
            t.ok(false, "Should not reach end of stream without failing.");
        });
});