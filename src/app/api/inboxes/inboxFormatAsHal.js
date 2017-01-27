"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _halDecoratorsDecoratorFactory = require('./halDecorators/decoratorFactory');

var _halDecoratorsDecoratorFactory2 = _interopRequireDefault(_halDecoratorsDecoratorFactory);

exports["default"] = function (href, instanceId, inbox) {
    var result = {
        "_links": {
            "self": {
                "href": href("/api/" + instanceId + "/inboxes/" + inbox.inboxId)
            },
            "digest-parent": {
                "href": href("/api/" + instanceId + "/digests/" + inbox.digestId)
            },
            "add-commit": {
                "href": href("/api/" + instanceId + "/inboxes/" + inbox.inboxId + "/commits")
            },
            "inbox-remove": {
                "href": href("/api/" + instanceId + "/inboxes/" + inbox.inboxId)
            }
        },
        "inboxId": inbox.inboxId,
        "family": inbox.family,
        "name": decodeURIComponent(inbox.name),
        "url": inbox.url
    };

    var halDecorator = _halDecoratorsDecoratorFactory2["default"].create(inbox.family);
    if (halDecorator) {
        result = halDecorator.decorateHalResponse(result);
    };

    return result;
};

module.exports = exports["default"];
