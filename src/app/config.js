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

  config.protocol = nconf.get('protocol') || null;
  config.eventStoreUser = nconf.get('eventStoreUser') || '';
  config.eventStorePassword = nconf.get('eventStorePassword') || '';
  config.eventStoreBaseUrl = nconf.get('eventStoreBaseUrl') || 'http://localhost:2113';
  config.eventStoreAssetStreamUrl = config.eventStoreBaseUrl + '/streams/asset-';
  config.eventStoreAllowSelfSignedCert = nconf.get('eventStoreAllowSelfSignedCert') === 'true';
  config.eventStoreAssetQueryParams = nconf.get('eventStoreAssetQueryParams') || '/head/backward/5?embed=content';
  var notSet = nconf.get('production') == undefined;
  config.production = nconf.get('production') === 'true' || notSet;
  config.controllerResponseDelay = nconf.get('controllerResponseDelay') || 1000;
  var showChildrenFeature = nconf.get('showChildrenFeature');
  if (showChildrenFeature === 'true') showChildrenFeature = true;
  else if (showChildrenFeature === 'false') showChildrenFeature = false
  else showChildrenFeature = true;
  config.showChildrenFeatureToggle = showChildrenFeature;
  config.azureTableConnectionString = nconf.get('storageConnectionString') || '';
  config.azureTableName = nconf.get('azureTableName') || '';
  config.azureLoggerConfigured = config.storageConnectionString !== '' && config.azureTableName !== '';

})(module.exports);
