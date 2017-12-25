"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require("events").EventEmitter,
    ul = require("ul"),
    deffy = require("deffy"),
    typpy = require("typpy"),
    noop = require("noop6"),
    asyncer = require("asyncer.js"),
    fnResult = require("fn-result");

var Transformer = function (_EventEmitter) {
    _inherits(Transformer, _EventEmitter);

    /**
     * Transformer
     * Transforms the data using synchronous and asynchronous functions.
     *
     * @name transformer
     * @function
     * @param {Object} data The data object.
     * @param {Object} opts The options object:
     *
     *  - `autostart` (Boolean): If `true`, the functions will be executed,
     *    without calling the `start()` method.
     *
     * @return {Number} Return description.
     */
    function Transformer(data, opts) {
        _classCallCheck(this, Transformer);

        var _this = _possibleConstructorReturn(this, (Transformer.__proto__ || Object.getPrototypeOf(Transformer)).call(this));

        _this._originalData = data;

        _this._cUnordered = [];
        _this._lastFn = {};

        _this._asyncerTasks = [_this._parallel = [], _this._ordered = []];

        opts = ul.merge(opts, {
            autostart: true
        });

        _this.autostart = opts.autostart;
        process.nextTick(function () {
            _this.autostart && _this.start();
        });
        return _this;
    }

    _createClass(Transformer, [{
        key: "_wrapFn",
        value: function _wrapFn(fn) {
            var _this2 = this;

            return function (cb) {
                fnResult(fn, [_this2._originalData], cb);
            };
        }

        /**
         * add
         * Adds a new function.
         *
         * There are three levels where the functions are added to be executed:
         *
         * Parallel:               | <0: [.............................................]>
         * Unordered (don't wait): |                                <4a: [........]>
         *                         +                                <4b: [....]>
         *                         +                                <4c: [......]>
         * Ordered (wait):         | <1: [...]> <2: [.]> <3:[.....]>                <5: [....]>
         *
         * @name add
         * @function
         * @param {Function|Transformer} fn The function to add. Note you can add
         * an existing transformer instance as well.
         * @param {TransformerType} type One of the following:
         *
         *    - `Transformer.PARALLEL`: Used to append on the parallel timeline.
         *    - `Transformer.UNORDERED`: Grouped, but unordered.
         *    - `Transformer.ORDERED`: Grouped, but ordered.
         *
         * @return {Transformer} The current Transformer instance.
         *
         */

    }, {
        key: "add",
        value: function add(fn, type) {
            var _this3 = this;

            if (typeof type === "string") {
                type = Transformer[type];
                if (typeof type !== "number") {
                    throw new Error("Invalid type.");
                }
            }

            if (typpy(fn, Array)) {
                fn.forEach(function (c) {
                    return _this3.add(c, type);
                });
                return this;
            }

            type = deffy(type, Transformer.ORDERED);
            if (typpy(fn, Transformer)) {
                var tr = fn;
                tr.autostart = false;
                fn = function fn(data, cb) {
                    tr.start(data, cb);
                };
            }

            fn = this._wrapFn(fn);

            switch (type) {
                case Transformer.PARALLEL:
                    this._parallel.push(fn);
                    break;
                case Transformer.UNORDERED:
                    if (this._lastFn.type !== Transformer.UNORDERED) {
                        this._cUnordered = [];
                        this._ordered.push({
                            parallel: this._cUnordered
                        });
                    }
                    this._cUnordered.push(fn);
                    break;
                case Transformer.ORDERED:
                    this._ordered.push(fn);
                    break;
            }

            this._lastFn = {
                fn: fn,
                type: type
            };

            this._ordered.push();
            return this;
        }

        /**
         * start
         * Starts the function execution.
         *
         * @name start
         * @function
         * @param {Object} data The data object.
         * @param {Function} fn The callback function.
         */

    }, {
        key: "start",
        value: function start(data, fn) {
            var _this4 = this;

            if (fn) {
                this._originalData = data;
            } else {
                fn = data;
            }

            fn = fn || noop;
            asyncer(this._asyncerTasks, function (err) {
                _this4.emit("end", err, _this4._originalData);
                fn(err, _this4._originalData);
            });
        }
    }]);

    return Transformer;
}(EventEmitter);

Transformer.PARALLEL = 1;
Transformer.UNORDERED = 2;
Transformer.ORDERED = 3;

module.exports = Transformer;