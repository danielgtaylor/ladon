Ladon
=====
A small, simple utility to process many files in parallel. It is meant for people comfortable with using a terminal but strives to be as easy to use as humanly possible.

Ladon is named after the multiheaded serpent dragon from Greek mythology, slain by Heracles and thrust into the sky as the constellation Draco. His many heads allow you to efficiently work on many files at once.

Features
--------
* Supports Windows, Mac OS X, Linux, etc
* Select files via a simple glob
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
ladon "**/*.txt" -- echo RELNAME

# Calculate SHA1 sums of all your PDFs and save them in a file
ladon "~/Documents/**/*.pdf" -- shasum FULLPATH >hashes.txt

# Generate thumbnails with ImageMagick and keep directory structure
ladon -m thumbs/RELDIR "**/*.jpg" -- convert FULLPATH -thumbnail 100x100^ -gravity center -extent 100x100 thumbs/RELNAME'
```

Variables
---------
The following variables can be used in both the command and the directory name when using the `--makedirs` option. The examples below assume that the _current working directory_ is `/home/dan/`.

| __Variable__ | __Description__                               | __Example__               |
| ------------ | --------------------------------------------- | ------------------------- |
| FULLPATH     | Full path, equivalent to DIRNAME/BASENAME.EXT | `/home/dan/books/foo.txt` |
| DIRNAME      | Directory name                                | `/home/dan/books`         |
| BASENAME     | File name without extension                   | `foo`                     |
| EXT          | File name extension                           | `txt`                     |
| RELDIR       | Relative directory name                       | `books`                   |
| RELPATH      | Relative file path                            | `books/foo.txt`           |

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
