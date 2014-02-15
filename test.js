var assert, ladon;

assert = require('assert');
ladon = require('./ladon');

describe ('ladon', function () {
    it ('Should provide a parser', function () {
        assert(ladon.parser);
    });

    it ('Should quote a string', function () {
        assert.equal('"test"', ladon.quote('test'));
    });

    it ('Should render a template with variables', function () {
        var filename, rendered, template;
        
        filename = '/home/dan/books/test.txt';
        template = 'FULLPATH'
        rendered = ladon.render(filename, 10, false, template);

        assert.equal(filename, rendered);

        template = 'RELDIR/BASENAME.EXT';
        rendered = ladon.render(filename, 10, false, template);

        assert.equal('books/test.txt', rendered);

        template = 'RELPATH RELPATH';
        rendered = ladon.render(filename, 10, true, template);

        assert.equal('"books/test.txt" "books/test.txt"', rendered);
    });

    it ('Should return a help string', function () {
        assert(ladon.parser.help());
    });

    it ('Should require at least a glob and command', function (done) {
        var showHelp = ladon.parser.showHelp;
        ladon.parser.showHelp = function () {};
        ladon.run({'_':[]}, function (err) {
            ladon.parser.showHelp = showHelp;
            
            assert(err);

            done();
        });
    });

    it ('Should run commands', function (done) {
        var argv, child_process, glob, tmp = {};

        argv = {
            processes: 2,
            _: ['*.js', 'echo', 'FULLPATH']
        };

        // Mock globbing
        glob = require('glob');
        tmp.Glob = glob.Glob;
        glob.Glob = function (globString, options, globDone) {
            tmp.GlobCalled = true;
            globDone(null, ['test.js', 'test2.js']);
            return {};
        }

        // Mock exec
        child_process = require('child_process');
        tmp.exec = child_process.exec
        child_process.exec = function (cmd, execDone) {
            tmp.execCalled = true;
            execDone(null, '', '');
        };

        ladon.run(argv, function (err) {
            glob.Glob = tmp.Glob;
            child_process.exec = tmp.exec;

            if (err) return done(err);

            assert(tmp.GlobCalled);
            assert(tmp.execCalled);

            done();
        });
    });
});
