'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _helpersVcsFamilies = require('../../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var vsoTfvcUiDecorator = {
  shouldDecorate: function shouldDecorate(vcsFamily) {
    return vcsFamily === _helpersVcsFamilies2['default'].VsoTfvc ? true : false;
  },
  decorateUIResponse: function decorateUIResponse(commit) {
    commit.isVsoTfvc = true;
    return commit;
  }
};

exports['default'] = vsoTfvcUiDecorator;
module.exports = exports['default'];
