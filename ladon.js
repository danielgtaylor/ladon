#!/usr/bin/env node
var argv, async, exec, glob, _help, mkdirp, os, parser, path;

async  = require('async');
exec   = require('child_process').exec;
glob   = require('glob');
mkdirp = require('mkdirp');
os     = require('os');
path   = require('path');

// Setup argument parser and options
parser = require('yargs')
    .usage('$0 ' + require('./package.json').version +
           ' via nodejs-' + process.versions.node + '\n' +
           'Usage: $0 [options] glob -- command [args]')
    .example('$0 "**/*.txt" -- echo RELPATH', 'List all text files')
    .example('$0 "**/*.txt" -- cat FULLPATH >combined.txt', 'Combine all text files')
    .example('', '')
    .example('https://github.com/danielgtaylor/ladon#readme', 'More examples')
    .options('f', {
        alias: 'fail',
        describe: 'Fail on first error',
        boolean: true
    })
    .options('m', {
        alias: 'makedirs',
        describe: 'Make directories (supports variables)',
        string: true
    })
    .options('p', {
        alias: 'processes',
        describe: 'Maximum number of processes',
        'default': os.cpus().length
    })
    .options('v', {
        alias: 'verbose',
        describe: 'Verbose output to sdterr',
        boolean: true,
        'default': false
    });

// Print extra help information
_help = parser.help;
parser.help = function () {
    var helpStr = _help();
    var variables = [
        ['FULLPATH', 'Full path, equivalent to DIRNAME' + path.sep + 'BASENAME.EXT'],
        ['DIRNAME', 'Directory name'],
        ['BASENAME', 'File name without extension'],
        ['EXT', 'File name extension'],
        ['RELDIR', 'Relative directory name'],
        ['RELPATH', 'Relative file path']
    ];
    
    helpStr += '\n\nVariables:\n';
    helpStr += variables.map(function (x) {
        var str = '  ' + x[0];

        for (var i = x[0].length; i < 10; i++) {
            str += ' '
        }

        return str + x[1];
    }).join('\n');

    return helpStr;
}

argv = parser.argv;

if (argv._.length < 2) {
    parser.showHelp();
    return 1;
}

// Handle basic home directory expansion
if (argv._[0][0] == '~') {
    argv._[0] = (process.env.HOME || process.env.USERPROFILE) + argv._[0].substr(1);
}

// Get relative start position for paths for RELDIR and RELNAME
var relativeStart = argv._[0].indexOf('**');
if (relativeStart == -1) {
    relativeStart = process.cwd().length;
}

// Surround a string with quotes
function quote(str) {
    return '"' + str + '"';
}

// Render a path template with the given filename
function render(filename, relStart, doQuote, template) {
    var ext = filename.split('.').pop();
    var q = doQuote ? quote : function (s) { return s; };

    return template
        .replace(new RegExp('FULLPATH', 'g'), q(filename))
        .replace(new RegExp('DIRNAME', 'g'), q(path.dirname(filename)))
        .replace(new RegExp('BASENAME', 'g'), q(path.basename(filename, ext)))
        .replace(new RegExp('EXT', 'g'), q(ext))
        .replace(new RegExp('RELDIR', 'g'), q(path.dirname(filename).substr(relStart)))
        .replace(new RegExp('RELPATH', 'g'), q(filename.substr(relStart)));
}

// Find and process files
glob(argv._[0], {
        nocase: true
    }, function(err, filenames) {
        var _process;

        if (argv.verbose)
            console.error('Processing ' + filenames.length + ' files...');

        _process = function(filename, done) {
            var cmd = render(filename, relativeStart, true, argv._.slice(1).join(' '));

            if (argv.makedirs) {
                // Ensure directories exist before running commands!
                mkdirp.sync(render(filename, relativeStart, false, argv.makedirs));
            }

            if (argv.verbose)
                console.error("Processing " + filename + '\n' + cmd);

            // Run the command and dump the output
            exec(cmd, function(err, stdout, stderr) {
                if (err) {
                    if (argv.fail) {
                        return done(err);
                    } else {
                        console.error(err);
                    }
                }

                if (stdout) process.stdout.write(stdout);
                if (stderr) process.stderr.write(stderr);

                done();
            });
        };

        return async.eachLimit(filenames, argv.p, _process, function(err) {
            if (err) console.error(err);
    });
});
