/**
 * Returns an object with parsed CLI input options
 * - args: {array of strings},
 * - opts: {array of objects},
 * - raw:  {unparsed input args}
 *
 * @return {object}
 */

var _cleanUpOptionName = function (str) {
  if (str[0] === '-' && str[1] === '-') {
    return str.substr(2);
  } else if (str[0] === '-') {
    return str.substr(1);
  } else {
    return str;
  }
}

var clarg = function () {
  var rawArgs = process.argv.slice(2);
  var reachedOpts = false;

  var rtn = {
    args: [],
    opts: [],
    raw: rawArgs
  }

  for (var i = 0; i < rawArgs.length; i++) {
    var isOption = false;
    var current = rawArgs[i];

    // detect opts
    if (current[0] === '-') {
      reachedOpts = true;
      isOption = true;
    }

    // parse all arguments
    if (!reachedOpts) {
      rtn.args.push(current);
    } else {
      if (isOption) {
        // set option to true
        var curName = _cleanUpOptionName(current);
        var curNameSplit = curName.split('=');
        if (curNameSplit[1]) {
          rtn.opts[curNameSplit[0]] = curNameSplit[1];
        } else {
          rtn.opts[curNameSplit[0]] = true;
        }
      } else {
        // or set a value to it
        var prevName = _cleanUpOptionName(rawArgs[i-1]);
        rtn.opts[prevName] = current;
      }
    }
  }

  return rtn;
};

module.exports = clarg;
