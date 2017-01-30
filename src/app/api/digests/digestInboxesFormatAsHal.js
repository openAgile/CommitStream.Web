'use strict';

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _inboxesHalDecoratorsDecoratorFactory = require('../inboxes/halDecorators/decoratorFactory');

var _inboxesHalDecoratorsDecoratorFactory2 = _interopRequireDefault(_inboxesHalDecoratorsDecoratorFactory);

exports['default'] = function (href, instanceId, digest, state) {
  var inboxIds = _underscore2['default'].keys(state.inboxes);
  var formatted = {
    "_links": {
      "self": {
        "href": href('/api/' + instanceId + '/digests/' + digest.digestId + '/inboxes')
      },
      "digest": {
        "href": href('/api/' + instanceId + '/digests/' + digest.digestId)
      },
      "inbox-create": {
        "href": href('/api/' + instanceId + '/digests/' + digest.digestId + '/inboxes'),
        "method": "POST",
        "title": 'Endpoint for creating an inbox for a repository on digest ' + digest.digestId + '.'
      }
    },
    "count": inboxIds.length,
    "digest": {
      "description": digest.description,
      "digestId": digest.digestId
    },
    "_embedded": {
      "inboxes": []
    }
  };

  function createInboxHyperMediaResult(instanceId, inbox) {
    var result = {
      "_links": {
        "self": {
          "href": href('/api/' + instanceId + '/inboxes/' + inbox.inboxId)
        },
        "add-commit": {
          "href": href('/api/' + instanceId + '/inboxes/' + inbox.inboxId + '/commits')
        }
      }
    };

    var halDecorator = _inboxesHalDecoratorsDecoratorFactory2['default'].create(inbox.family);
    if (halDecorator) {
      result = halDecorator.decorateHalResponse(result);
    };
    result = _underscore2['default'].extend(result, _underscore2['default'].omit(inbox, 'digestId'));
    return result;
  }

  if (inboxIds) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(inboxIds), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var inboxId = _step.value;

        formatted._embedded.inboxes.push(createInboxHyperMediaResult(instanceId, state.inboxes[inboxId]));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  return formatted;
};

module.exports = exports['default'];
