'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _helpersVcsFamilies = require('../../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var tfvcUiDecorator = {
  shouldDecorate: function shouldDecorate(vcsFamily) {
    return vcsFamily === _helpersVcsFamilies2['default'].Tfvc ? true : false;
  }
};

exports['default'] = tfvcUiDecorator;
module.exports = exports['default'];
