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
    if (isLocalVCS(commit.repoHref)) {
      commit.isLocalVCS = true;
    }
    return commit;
  }
};

var isLocalVCS = function isLocalVCS(repoHref) {
  if (repoHref.startsWith('http')) {
    return false;
  }
  return true;
};

exports['default'] = p4vUiDecorator;
module.exports = exports['default'];
