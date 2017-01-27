'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _nconf = require('nconf');

var _nconf2 = _interopRequireDefault(_nconf);

var configFile = 'config.json';

if (process.env['commitStreamConfigFile']) configFile = process.env['commitStreamConfigFile'];

_nconf2['default'].file(configFile).env();

var config = {};

config.port = _nconf2['default'].get('commitStreamServerPort') || 6565;

if (process.env.PORT) {
  config.port = process.env.PORT;
}

config.protocol = _nconf2['default'].get('protocol') || 'http';
config.eventStoreUser = _nconf2['default'].get('eventStoreUser') || 'admin';
config.eventStorePassword = _nconf2['default'].get('eventStorePassword') || 'changeit';
config.eventStoreBaseUrl = _nconf2['default'].get('eventStoreBaseUrl') || 'http://localhost:2113';
config.eventStoreAssetStreamUrl = config.eventStoreBaseUrl + '/streams/asset-';
config.eventStoreAllowSelfSignedCert = _nconf2['default'].get('eventStoreAllowSelfSignedCert') === 'true';
config.eventStoreAssetQueryParams = _nconf2['default'].get('eventStoreAssetQueryParams') || '/head/backward/5?embed=content';

var notSet = _nconf2['default'].get('production') == false;
config.production = _nconf2['default'].get('production') === 'true' || notSet;
config.controllerResponseDelay = _nconf2['default'].get('controllerResponseDelay') || 1000;

var showChildrenFeature = _nconf2['default'].get('showChildrenFeature');
if (showChildrenFeature === 'true') showChildrenFeature = true;else if (showChildrenFeature === 'false') showChildrenFeature = false;else showChildrenFeature = true;
config.showChildrenFeatureToggle = showChildrenFeature;
config.storageConnectionString = _nconf2['default'].get('AzureTableToSumo_storageConnectionString') || '';
config.azureTableName = _nconf2['default'].get('AzureTableToSumo_azureTableName') || '';
config.azureLoggerConfigured = config.storageConnectionString !== '' && config.azureTableName !== '';

exports['default'] = config;
module.exports = exports['default'];
