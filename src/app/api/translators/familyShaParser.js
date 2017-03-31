/*
 Rationale: In the API, we decided that as a default, each commit should display 7 characters of the commit ID.  This is the convention
 of Github. As we expand and add new VCSes, we add to VcsFamilySpecificShaTable
 */

'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _VcsFamilySpecificShaTable;

exports['default'] = getFamilySpecificSha;

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var defaultFamilyShaLength = 7;

//If sha length to be displayed is a specific length
var VcsFamilySpecificShaTable = (_VcsFamilySpecificShaTable = {}, _defineProperty(_VcsFamilySpecificShaTable, _helpersVcsFamilies2['default'].VsoGit, 8), _defineProperty(_VcsFamilySpecificShaTable, _helpersVcsFamilies2['default'].Svn, Infinity), _VcsFamilySpecificShaTable);

function getFamilySpecificSha(family, sha) {
    //return (VcsFamilySpecificShaTable[family] ?  sha.substring(0,VcsFamilySpecificShaTable[family]) : sha.substring(0,defaultFamilyShaLength));
    if (VcsFamilySpecificShaTable.hasOwnProperty(family)) {
        if (VcsFamilySpecificShaTable[family] === Infinity) {
            return sha;
        } else {
            sha.substring(0, VcsFamilySpecificShaTable[family]);
        }
    } else {
        sha.substring(0, defaultFamilyShaLength);
    }
}

;
module.exports = exports['default'];
