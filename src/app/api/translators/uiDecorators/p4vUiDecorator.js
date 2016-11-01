'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _helpersVcsFamilies = require('../../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var p4vUiDecorator = {
  shouldDecorate: function shouldDecorate(vcsFamily) {
    if (vcsFamily === _helpersVcsFamilies2['default'].P4V) {
      return true;
    }
    return false;
  },
  decorateUIResponse: function decorateUIResponse(commit) {
    if (isCommitHref(commit.commitHref)) {
      commit.isCommitHref = true;
    }
    return commit;
  }
};

var isCommitHref = function isCommitHref(commitHref) {
  if (commitHref.length > 0) {
    return true;
  }
  return false;
};

exports['default'] = p4vUiDecorator;
module.exports = exports['default'];
