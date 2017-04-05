/*
 Rationale: In the API, we decided that as a default, each commit should display 7 characters of the commit ID.  This is the convention
 of Github. As we expand and add new VCSes and if any have lenghth requirements different from the default, we add it to VcsFamilySpecificShaLengthTable
 */

//import VcsFamilies from '../helpers/vcsFamilies';
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _helpersVcsFamilySpecificShaLengthTable = require('../helpers/vcsFamilySpecificShaLengthTable');

var _helpersVcsFamilySpecificShaLengthTable2 = _interopRequireDefault(_helpersVcsFamilySpecificShaLengthTable);

var defaultFamilyShaLength = 7;

exports['default'] = function (family, sha) {

    if (_helpersVcsFamilySpecificShaLengthTable2['default'].hasOwnProperty(family)) {
        if (_helpersVcsFamilySpecificShaLengthTable2['default'][family] === Infinity) {
            return sha;
        } else {
            return sha.substring(0, _helpersVcsFamilySpecificShaLengthTable2['default'][family]);
        }
    } else {
        return sha.substring(0, defaultFamilyShaLength);
    }
};

module.exports = exports['default'];
