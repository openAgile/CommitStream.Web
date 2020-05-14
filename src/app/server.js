'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _configValidation = require('./configValidation');

var _configValidation2 = _interopRequireDefault(_configValidation);

var _middlewareCsErrorHandler = require('./middleware/csErrorHandler');

var _middlewareCsErrorHandler2 = _interopRequireDefault(_middlewareCsErrorHandler);

var _middlewareInstanceAuthenticator = require('./middleware/instanceAuthenticator');

var _middlewareInstanceAuthenticator2 = _interopRequireDefault(_middlewareInstanceAuthenticator);

var _middlewareInstanceToDigestValidator = require('./middleware/instanceToDigestValidator');

var _middlewareInstanceToDigestValidator2 = _interopRequireDefault(_middlewareInstanceToDigestValidator);

var _middlewareInstanceToInboxValidator = require('./middleware/instanceToInboxValidator');

var _middlewareInstanceToInboxValidator2 = _interopRequireDefault(_middlewareInstanceToInboxValidator);

var _middlewareApiRoutesRequireContentTypeAppJson = require('./middleware/apiRoutesRequireContentTypeAppJson');

var _middlewareApiRoutesRequireContentTypeAppJson2 = _interopRequireDefault(_middlewareApiRoutesRequireContentTypeAppJson);

var _middlewareAppConfigure = require('./middleware/appConfigure');

var _middlewareAppConfigure2 = _interopRequireDefault(_middlewareAppConfigure);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _expressDomainMiddleware = require('express-domain-middleware');

var _expressDomainMiddleware2 = _interopRequireDefault(_expressDomainMiddleware);

var _methodOverride = require('method-override');

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _api = require("./api");

var _api2 = _interopRequireDefault(_api);

var _bootstrapper = require('./bootstrapper');

var _bootstrapper2 = _interopRequireDefault(_bootstrapper);

var _apiInstancesInstancesController = require('./api/instances/instancesController');

var _apiInstancesInstancesController2 = _interopRequireDefault(_apiInstancesInstancesController);

var _middlewareCatchAsyncErrors = require('./middleware/catchAsyncErrors');

var _middlewareCatchAsyncErrors2 = _interopRequireDefault(_middlewareCatchAsyncErrors);

// DO NOT MOVE THIS. It is here to wrap routes in a domain to catch unhandled errors

var app = (0, _express2['default'])();
app.use(_expressDomainMiddleware2['default']);

// DO NOT MOVE THIS. It is here to handle unhandled rejected Promises cleanly
_bluebird2['default'].onPossiblyUnhandledRejection(function (err) {
  throw err;
});

_configValidation2['default'].validateConfig();
_configValidation2['default'].validateEventStore(function (error) {
  if (error) {
    throw new Error(error);
  }
});

// override with the X-HTTP-Method-Override header in the request
app.use((0, _methodOverride2['default'])('X-HTTP-Method-Override'));

app.get('/version', function (req, res) {
  res.json({
    version: "0.0.0"
  });
});

// Boot the system, and create EventStore projections if needed
_bootstrapper2['default'].boot(_config2['default']);

// Wire up express-handlebars as the view engine for express.
app.engine('handlebars', (0, _expressHandlebars2['default'])());
app.set('view engine', 'handlebars');

// NOTE: Do not rearrange the order of these app.* statements becaused they
// are crucial for the order of operations in the pipeline of middleware
// functions!
app.use((0, _cors2['default'])());

app.use(_express2['default']['static'](__dirname + '/client'));

app.get('/instances', function (req, res) {
  res.render('instances');
});

// Ensure that all routes with :instanceId parameters are properly authenticated
app.param('instanceId', (0, _middlewareCatchAsyncErrors2['default'])(_middlewareInstanceAuthenticator2['default']));
app.param('digestId', (0, _middlewareCatchAsyncErrors2['default'])(_middlewareInstanceToDigestValidator2['default']));
app.param('inboxId', (0, _middlewareCatchAsyncErrors2['default'])(_middlewareInstanceToInboxValidator2['default']));

// NOTE: See above warning. Why are you even considering moving these?
// Think thrice.
(0, _middlewareAppConfigure2['default'])(app);

// SPIKE: Provide a public entry point for the API
app.get('/api/public', function (req, res) {
  res.set('Content-Type', 'application/hal+json');
  res.status(200).send({
    "_links": {
      "self": {
        "href": req.href("/api/public")
      },
      "instances": {
        "href": req.href("/api/instances")
      },
      "instance": {
        "href": req.href("/api/instances/{instanceId}"),
        templated: true
      },
      "digest": {
        "href": req.href('/api/{instanceId}/digests/{digestId}'),
        "templated": true
      }
    }
  });
});

// Return a URL as a special header for each request
app.use(function (req, res, next) {
  res.setHeader("X-CommitStream-API-Docs", "https://github.com/openAgile/CommitStream.Web");
  return next();
});

// This must happen here, before we cover additional routes with Content-Type validation
_apiInstancesInstancesController2['default'].init(app);

// Ensure all API routes have consistent Content-Type validation
app.all('/api/*', _middlewareApiRoutesRequireContentTypeAppJson2['default']);

// Map API the routes
_api2['default'].init(app);

// DO NOT MOVE THIS. It must be here to catch unhandled errors.
app.use(_middlewareCsErrorHandler2['default']);

var getHostSettings = function getHostSettings(req) {
  return {
    protocol: _config2['default'].protocol || req.protocol,
    host: req.get('host'),
    key: req.query.key,
    newStyling: req.query.newStyling
  };
};

app.get('/app', function (req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  var settings = getHostSettings(req);
  var appToRender = 'app';
  var themeMode = settings.newStyling;

  if (themeMode === 'true') {
    appToRender = 'app2';
  }

  res.render(appToRender, {
    apiUrl: settings.protocol + '://' + settings.host + '/api/',
    protocol: settings.protocol,
    resourcePath: settings.protocol + '://' + settings.host + '/',
    showChildrenFeatureToggle: _config2['default'].showChildrenFeatureToggle.toString()
    //newStyling: settings.newStyling.toString()
  });
});

app.listen(_config2['default'].port, function () {
  console.log('CommitStream Web Server listening on port ' + _config2['default'].port);
});
