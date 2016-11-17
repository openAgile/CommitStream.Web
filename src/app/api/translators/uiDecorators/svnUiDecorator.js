'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _helpersVcsFamilies = require('../../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var svnUiDecorator = {
  shouldDecorate: function shouldDecorate(vcsFamily) {
    if (vcsFamily === _helpersVcsFamilies2['default'].Svn) {
      return true;
    }
    return false;
  },
  decorateUIResponse: function decorateUIResponse(commit) {
    if (isCommitHref(commit.commitHref)) {
      commit.isCommitHref = true;
    } else {
      commit.isCommitHref = false;
    }
    return commit;
  }
};

var isCommitHref = function isCommitHref(commitHref) {
  if (commitHref.length > 0 && commitHref.startsWith('http')) {
    return true;
  }
  return false;
};

exports['default'] = svnUiDecorator;
module.exports = exports['default'];
