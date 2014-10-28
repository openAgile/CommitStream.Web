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
  config.apiKey = nconf.get('apiKey') || '';
  config.serverBaseUrl = nconf.get('serverBaseUrl') || 'http://localhost:' + config.port;
  config.eventStoreUser = nconf.get('eventStoreUser') || '';
  config.eventStorePassword = nconf.get('eventStorePassword') || '';
  config.eventStoreBaseUrl = nconf.get('eventStoreBaseUrl') || 'http://localhost:2113';
  config.eventStoreAssetStreamUrl = config.eventStoreBaseUrl + '/streams/asset-';
  config.eventStoreAllowSelfSignedCert = nconf.get('eventStoreAllowSelfSignedCert') === 'true';
  config.eventStoreAssetQueryParams = nconf.get('eventStoreAssetQueryParams') || '/head/backward/5?embed=content';
  config.assetDetailTemplateUrl = nconf.get('assetDetailTemplateUrl') || config.serverBaseUrl + ':' + config.port + '/assetDetailCommits.html';
})(module.exports);
