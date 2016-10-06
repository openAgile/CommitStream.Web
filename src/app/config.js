(function(config) {
  var configFile = 'config.json',
    nconf = require('nconf');

  if (process.env['commitStreamConfigFile'] != null) {
    configFile = process.env['commitStreamConfigFile'];
  }

  nconf.file(configFile).env();

  config.port = nconf.get('commitStreamServerPort') || 6565;

  if (process.env.PORT != null) {
    config.port = process.env.PORT;
  }

  config.protocol = nconf.get('protocol') || 'https';
  config.eventStoreUser = nconf.get('eventStoreUser') || 'admin';
  config.eventStorePassword = nconf.get('eventStorePassword') || 'changeit';
  config.eventStoreBaseUrl = nconf.get('eventStoreBaseUrl') || 'http://localhost:2113';
  config.eventStoreAssetStreamUrl = config.eventStoreBaseUrl + '/streams/asset-';
  config.eventStoreAllowSelfSignedCert = nconf.get('eventStoreAllowSelfSignedCert') === 'true';
  config.eventStoreAssetQueryParams = nconf.get('eventStoreAssetQueryParams') || '/head/backward/5?embed=content';
  var notSet = nconf.get('production') == false;
  config.production = nconf.get('production') === 'true' || notSet;
  config.controllerResponseDelay = nconf.get('controllerResponseDelay') || 1000;
  var showChildrenFeature = nconf.get('showChildrenFeature');
  if (showChildrenFeature === 'true') showChildrenFeature = true;
  else if (showChildrenFeature === 'false') showChildrenFeature = false
  else showChildrenFeature = true;
  config.showChildrenFeatureToggle = showChildrenFeature;
  config.storageConnectionString = nconf.get('AzureTableToSumo_storageConnectionString') || '';
  config.azureTableName = nconf.get('AzureTableToSumo_azureTableName') || '';
  config.azureLoggerConfigured = config.storageConnectionString !== '' && config.azureTableName !== '';

})(module.exports);
