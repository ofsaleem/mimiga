# clarg

The simplest command-line parsing utility for node.js

## Why create another library for this?

All of the existing libraries (i.e. commander or nomnom) require you to specify
upfront what options you expect.

Clarg simply returns you a full set of arguments it found allowing you
to bind everything in any way you want, anywhere you want.

No questions asked, no prescribed way of doing things. Just a simple object.


## Usage

Simply import clarg anywhere in your code and it will output an object.

You don't have to specify any options upfront, just require this module
and execute it.

It doesn't matter where in code you run it - you will always get the same result
which is really just a broken down list of arguments and options passed to the process.

It supports options specified with single dashes, double dashes and their values
after a space or an equal sign. Anything goes as long as your options come after arguments.

```
var arguments = require('clarg')();
console.log(arguments);
```

Running this script with
`node test.js start countdown --format=long -detach -parse=yes`
will produce something like this:

```
{
  args: [ 'start', 'countdown' ],
  opts: [ format: 'long', detach: true, parse: 'yes' ],
  raw: [ 'start', 'countdown', '--format=long', '-detach', '-parse=yes' ]
}
```
