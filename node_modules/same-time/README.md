
# same-time

 [![Patreon](https://img.shields.io/badge/Support%20me%20on-Patreon-%23e6461a.svg)][patreon] [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![AMA](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Version](https://img.shields.io/npm/v/same-time.svg)](https://www.npmjs.com/package/same-time) [![Downloads](https://img.shields.io/npm/dt/same-time.svg)](https://www.npmjs.com/package/same-time) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> Call functions in parallel and store the results.

If you want to run async functions synchronously, check out [`one-by-one.js`](https://github.com/IonicaBizau/one-by-one.js).

## :cloud: Installation

```sh
$ npm i --save same-time
```


## :clipboard: Example



```js
// Dependencies
var SameTime = require("same-time");

// Run functions same time and output the results
SameTime([
    function (cb) {
        setTimeout(function() {
            cb(null, "Something async")
        }, 3000);
    }
  , function (cb) {
        setTimeout(function() {
            cb(new Error("An error."))
        }, 500);
    }
  , function (cb) {
        setTimeout(function() {
            cb(null, null, 42)
        }, 2000);
    }
], function (err, data, something) {
    console.log(err, data, something);
    // After 3 seconds
    // [ null, [Error: An error.], null ] [ 'Something async', , null ] [ , , 42 ]
});
```

## :memo: Documentation


### `sameTime(arr, cb, store)`
Calls functions in parallel and stores the results.

#### Params
- **Array** `arr`: An array of functions getting the callback parameter in the first argument.
- **Function** `cb`: The callback function called with:
 - first parameter: `null` if there were no errors or an array containing the error values
 - `1 ... n` parameters: arrays containing the callback results
- **Array** `store`: An optional array to store the data in. If `null`, data won't be stored.

#### Return
- **sameTime** The `sameTime` function.



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## :moneybag: Donations

Another way to support the development of my open-source modules is
to [set up a recurring donation, via Patreon][patreon]. :rocket:

[PayPal donations][paypal-donations] are appreciated too! Each dollar helps.

Thanks! :heart:

## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`asyncer.js`](https://github.com/IonicaBizau/asyncer.js#readme)—Run groups of (a)sync functions.
 - [`babel-it`](https://github.com/IonicaBizau/babel-it#readme)—Babelify your code before `npm publish`.
 - [`blah`](https://github.com/IonicaBizau/blah)—A command line tool to optimize the repetitive actions.
 - [`bloggify-markdown-adapter`](https://github.com/IonicaBizau/bloggify-markdown-adapter#readme)—Markdown adapter for Bloggify.
 - [`bloggify-plugin-class`](https://github.com/IonicaBizau/bloggify-plugin-class#readme)—A library for managing plugin objects.
 - [`bloggify-viewer`](https://github.com/IonicaBizau/bloggify-viewer#readme)—Connects the CRUD operations with the renderer.
 - [`cdnjs-importer`](https://github.com/cdnjs/cdnjs-importer)—Easy way to import a library into CDNJS.
 - [`engine-builder`](https://github.com/IonicaBizau/engine-parser) (by jillix)—Engine composition parser.
 - [`engine-composition-crud`](https://github.com/jillix/engine-composition-crud#readme) (by jillix)—The default module for creating, reading, updating and deleting Engine instances.
 - [`engine-parser`](https://github.com/IonicaBizau/engine-parser) (by jillix)—Engine composition parser.
 - [`engine-tools`](https://github.com/jillix/engine-tools) (by jillix)—Engine Tools library and CLI app.
 - [`find-file-in-dirs`](https://github.com/IonicaBizau/find-file-in-dirs#readme)—Find a file in different directories.
 - [`fork-me`](https://github.com/IonicaBizau/fork-me#readme)—Delete multiple GitHub repositories.
 - [`fs-file-tree`](https://github.com/IonicaBizau/fs-file-tree#readme)—Get a directory file tree as an object.
 - [`gh-destroy`](https://github.com/IonicaBizau/gh-destroy#readme)—Delete multiple GitHub repositories.
 - [`gh-following`](https://github.com/IonicaBizau/gh-following#readme)—Fetches the users you follow but they don't follow you and the users that follow you but you don't.
 - [`gh-repeat`](https://github.com/IonicaBizau/gh-repeat#readme)—Repetitive actions on multiple GitHub repositories.
 - [`github-emojify`](https://github.com/IonicaBizau/github-emojifiy#readme)—Emojify your GitHub repository descriptions.
 - [`github-labeller`](https://github.com/IonicaBizau/github-labeller#readme)—Automagically create issue labels in your GitHub projects.
 - [`gm-tools`](https://github.com/IonicaBizau/gm-tools#readme)—Friendly tools for interacting with GraphicsMagick.
 - [`gpm`](https://github.com/IonicaBizau/gpm)—npm + git = gpm - Install NPM packages and dependencies from git repositories.
 - [`img-ssim`](https://github.com/IonicaBizau/img-ssim#readme)—Get the structural similarity between two images.
 - [`made-in`](https://github.com/IonicaBizau/made-in#readme)—Get GitHub projects created by users from a specific location.
 - [`mongof`](https://github.com/IonicaBizau/node-mongof)—Sync MongoDB collections with JSON files.
 - [`nodeice`](https://github.com/IonicaBizau/nodeice)—Another PDF invoice generator
 - [`npm-available-array`](https://github.com/IonicaBizau/npm-available-array#readme)—Having an array of package names, check which ones are available on npm.
 - [`package-dependents`](https://github.com/IonicaBizau/node-package-dependents#readme)—Get the npm dependents of a given package.
 - [`read-dir-and-stat`](https://github.com/IonicaBizau/read-dir-and-stat#readme)—Reads the directory files and adds the stat info.
 - [`same-time-limit`](https://github.com/IonicaBizau/same-time-limit#readme)—Run tasks in parallel with a limit.
 - [`showalicense.com`](https://github.com/IonicaBizau/showalicense.com#readme)—A site to provide an easy way to show licenses and their human-readable explanations.

## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[patreon]: https://www.patreon.com/ionicabizau
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2015#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
