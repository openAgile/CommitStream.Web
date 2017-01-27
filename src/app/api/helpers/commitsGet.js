'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _translatorsCommitEventsToApiResponse = require('../translators/commitEventsToApiResponse');

var _translatorsCommitEventsToApiResponse2 = _interopRequireDefault(_translatorsCommitEventsToApiResponse);

var _helpersEventStoreClient = require('../helpers/eventStoreClient');

var _helpersEventStoreClient2 = _interopRequireDefault(_helpersEventStoreClient);

var _helpersPager = require('../helpers/pager');

var _helpersPager2 = _interopRequireDefault(_helpersPager);

var _middlewareCsError = require('../../middleware/csError');

var _middlewareCsError2 = _interopRequireDefault(_middlewareCsError);

var InputRequired = (function (_CSError) {
  _inherits(InputRequired, _CSError);

  function InputRequired(objectType) {
    _classCallCheck(this, InputRequired);

    var message = objectType + ' is required';
    var errors = [message];
    _get(Object.getPrototypeOf(InputRequired.prototype), 'constructor', this).call(this, errors);
  }

  return InputRequired;
})(_middlewareCsError2['default']);

;

var validate = function validate(propertyName, property) {
  if (property === undefined || property === null || property == '') {
    throw new InputRequired(propertyName);
  }
};

exports['default'] = function callee$0$0(query, stream, buildUri, cache) {
  var pageSize, currentPage, args, response, links, apiResponse, pagedResponse;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        validate('stream', stream);
        validate('buildUri', buildUri);

        pageSize = _helpersPager2['default'].getPageSize(query);
        currentPage = cache.get(query.page);
        args = {
          name: stream,
          count: pageSize,
          pageUrl: currentPage,
          embed: 'tryharder'
        };
        context$1$0.prev = 5;
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(_helpersEventStoreClient2['default'].getFromStream(args));

      case 8:
        response = context$1$0.sent;

        console.log("AAAAAAAAAAAAAA" + response);
        links = response.links;
        apiResponse = (0, _translatorsCommitEventsToApiResponse2['default'])(response.entries);
        pagedResponse = _helpersPager2['default'].getPagedResponse(apiResponse, links, currentPage, buildUri, cache);
        return context$1$0.abrupt('return', pagedResponse);

      case 16:
        context$1$0.prev = 16;
        context$1$0.t0 = context$1$0['catch'](5);
        return context$1$0.abrupt('return', {
          commits: [],
          _links: {}
        });

      case 19:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[5, 16]]);
};

module.exports = exports['default'];
