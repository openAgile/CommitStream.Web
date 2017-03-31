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

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var _getFamilySpecificSha = require('./getFamilySpecificSha');

var _getFamilySpecificSha2 = _interopRequireDefault(_getFamilySpecificSha);

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
        var commitEvent = JSON.parse(entry.data);
        var family = getFamily(entry.eventType);
        var translator = _translatorFactory2['default'].getByFamily(family);
        var props = translator.getProperties(commitEvent);
        var sha1Partial = (0, _getFamilySpecificSha2['default'])(family, commitEvent.sha);

        var commit = {
          commitDate: commitEvent.commit.committer.date,
          timeFormatted: (0, _moment2['default'])(commitEvent.commit.committer.date).fromNow(),
          author: commitEvent.commit.committer.name,
          sha1Partial: sha1Partial,
          family: family,
          action: 'committed',
          message: commitEvent.commit.message,
          commitHref: commitEvent.html_url,
          repo: props.repo,
          branch: commitEvent.branch,
          branchHref: props.branchHref,
          repoHref: props.repoHref,
          isCommitHref: true,
          isVsoTfvc: false
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
