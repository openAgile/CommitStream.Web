'use strict';

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _translatorFactory = require('./translatorFactory');

var _translatorFactory2 = _interopRequireDefault(_translatorFactory);

var _uiDecoratorsUiDecoratorFactory = require('./uiDecorators/uiDecoratorFactory');

var _uiDecoratorsUiDecoratorFactory2 = _interopRequireDefault(_uiDecoratorsUiDecoratorFactory);

var getFamily = function getFamily(eventType) {
  return eventType.slice(0, -14);
};

exports['default'] = function (entries) {
  var commits = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(entries), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var entry = _step.value;

      try {
        var e = JSON.parse(entry.data);
        var family = getFamily(entry.eventType);
        var translator = _translatorFactory2['default'].getByFamily(family);
        var props = translator.getProperties(e);

        var commit = {
          commitDate: e.commit.committer.date,
          timeFormatted: (0, _moment2['default'])(e.commit.committer.date).fromNow(),
          author: e.commit.committer.name,
          sha1Partial: e.sha.substring(0, 6),
          family: family,
          action: 'committed',
          message: e.commit.message,
          commitHref: e.html_url,
          repo: props.repo,
          branch: e.branch,
          branchHref: props.branchHref,
          repoHref: props.repoHref,
          isCommitHref: true
        };
        var uiDecorator = _uiDecoratorsUiDecoratorFactory2['default'].create(family);

        if (uiDecorator) {
          commit = uiDecorator.decorateUIResponse(commit);
        }
        commits.push(commit);
      } catch (ex) {
        console.log(ex);
      }
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

  var response = {
    commits: commits
  };
  return response;
};

module.exports = exports['default'];
