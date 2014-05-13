Ladon
=====

[![Dependency Status](https://david-dm.org/danielgtaylor/ladon.png)](https://david-dm.org/danielgtaylor/ladon) [![Build Status](https://travis-ci.org/danielgtaylor/ladon.png?branch=master)](https://travis-ci.org/danielgtaylor/ladon) [![NPM version](https://badge.fury.io/js/ladon.png)](http://badge.fury.io/js/Ladon)

A small, simple utility to process many files in parallel. It is meant for people comfortable with using a terminal but strives to be as easy to use as humanly possible.

Ladon is named after the multiheaded serpent dragon from Greek mythology, slain by Heracles and thrust into the sky as the constellation Draco. His many heads allow you to efficiently work on many files at once.

Features
--------
* Supports Windows, Mac OS X, Linux, etc
* Select files via a simple [glob](https://www.npmjs.org/package/glob)
* Autodetects system CPU count
* Configurable parallel process count
* Simple command template syntax
* Built-in templated `mkdir -p` support

Installation
------------
The only dependency is [Node.js](http://nodejs.org/). Standard global installation via NPM applies:

```bash
sudo npm install -g ladon
```

Examples
--------
The following are some examples of what is possible:

```bash
# Print all text file names relative to the current directory
ladon "**/*.txt" -- echo RELPATH

# Calculate SHA1 sums of all your PDFs and save them in a file
ladon "~/Documents/**/*.pdf" -- shasum FULLPATH >hashes.txt

# Generate thumbnails with ImageMagick and keep directory structure
ladon -m thumbs/RELDIR "**/*.jpg" -- convert FULLPATH -thumbnail 100x100^ -gravity center -extent 100x100 thumbs/RELNAME'
```

You can also replace common `bash`-isms with true parallel processing:

```bash
# Typical bash for loop
for f in ~/Music/*.wav; do lame -V 2 $f ${f%.*}.mp3; done

# Parallelized via ladon to use all CPUs
ladon "~/Music/*.wav" -- lame -V 2 FULLPATH DIRNAME/BASENAME.mp3
```

Tutorial
--------
The following is a brief walkthrough of how to use `ladon`.

### Command Structure
The basic command structure consists of two parts that are split by `--`. The first part consists of the `ladon` command and its options, while the second consists of the command you want to run in parallel. The only required `ladon` option is a file selector glob.

```bash
ladon [options] glob -- command
```

Ladon works by selecting files via a glob, which supports wildcards like `*` and `**` to match any file or any directory recursively. For example, `*.txt` would select all the text files in the current directory, while `**/*.txt` would select all the text files in the current directory __and__ any child directories. [Read the full glob syntax](https://www.npmjs.org/package/glob).

The second half of the command structure is the command you wish to run in parallel over the selected files. It can be anything you want and can use special variables (documented below).

### Using Variables
A full variable reference can be found below. The most common use case is to get the full path to a file that you wish to process, and this can be done via the `FULLPATH` variable. For example, to print out the full path to each file that is selected by your glob:

```bash
ladon "*" -- echo FULLPATH
```

You can also safely mix variables with normal text to construct new paths:

```bash
ladon "*" -- echo RELDIR/BASENAME.zip
```

### Making Directories
Many commands will generate a new file. Sometimes you want to overwrite existing files, but other times you'd rather create a copy. Ladon has built-in support for a templated `mkdir -p` feature which will recursively ensure directories exist before running your command on a selected file. The `RELDIR` variable is very useful here. This is perhaps best illustrated via example:

```bash
# Recursively copy all files and keep directory structure
ladon -m foo/RELDIR "myfiles/**/*" -- cp FULLPATH foo/RELPATH
```

In the example above every file and directory in the `myfiles` directory will be copied over to the new directory `foo`. If there is a `myfiles/docs/test.txt` then there will be a `foo/docs/test.txt` file created.

Variable Reference
------------------
The following variables can be used in both the command and the directory name when using the `--makedirs` option. The examples below assume that the _current working directory_ is `/home/dan/`.

| __Variable__ | __Description__                               | __Example__               |
| ------------ | --------------------------------------------- | ------------------------- |
| FULLPATH     | Full path, equivalent to DIRNAME/BASENAME.EXT | `/home/dan/books/foo.txt` |
| DIRNAME      | Directory name                                | `/home/dan/books`         |
| BASENAME     | File name without extension                   | `foo`                     |
| EXT          | File name extension                           | `txt`                     |
| RELDIR       | Relative directory name                       | `books`                   |
| RELPATH      | Relative file path                            | `books/foo.txt`           |

Use as a Library
----------------
You can also use ladon as a basic library in Node.js.

```bash
npm install ladon
```

Then, just `require` and use it:

```javascript
var ladon = require('ladon');

// The command parser (based on yargs)
var args = ladon.parser.parse(['ladon', '**/*.txt', '--', 'echo', 'FULLPATH']);

// Run the command
ladon.run(args, function (err) {
    if (err) console.error(err.toString());
});
```

Alternatives
------------

* [xargs](http://offbytwo.com/2011/06/26/things-you-didnt-know-about-xargs.html)
* [GNU Parallel](http://www.gnu.org/software/parallel/)

License
-------
Copyright &copy; 2014 Daniel G. Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
