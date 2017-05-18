"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var catchAsyncErrors = function catchAsyncErrors(fn) {
    return function (req, res, next) {
        for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
            rest[_key - 3] = arguments[_key];
        }

        var routePromise = fn.apply(undefined, [req, res, next].concat(rest));
        if (routePromise["catch"]) {
            routePromise["catch"](function (err) {
                next(err);
            });
        }
    };
};

exports["default"] = catchAsyncErrors;
module.exports = exports["default"];
