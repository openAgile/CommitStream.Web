import express from 'express';
const app = express();
import cors from 'cors';
import config from './config';
import exphbs from 'express-handlebars';
import validation from './configValidation';
import csErrorHandler from './middleware/csErrorHandler';
import instanceAuthenticator from './middleware/instanceAuthenticator';
import instanceToDigestValidator from './middleware/instanceToDigestValidator';
import instanceToInboxValidator from './middleware/instanceToInboxValidator';
import apiRoutesRequireContentTypeAppJson from './middleware/apiRoutesRequireContentTypeAppJson';
import appConfigure from './middleware/appConfigure';
import Promise from 'bluebird';
import domainMiddleware from 'express-domain-middleware';
import methodOverride from 'method-override';
import api from "./api";
import bootstrapper from './bootstrapper';
import instancesController from './api/instances/instancesController';
import catchAsyncErrors from './middleware/catchAsyncErrors';

// DO NOT MOVE THIS. It is here to wrap routes in a domain to catch unhandled errors
app.use(domainMiddleware);

// DO NOT MOVE THIS. It is here to handle unhandled rejected Promises cleanly
Promise.onPossiblyUnhandledRejection(err => {
  throw err;
});

validation.validateConfig();
validation.validateEventStore(error => {
  if (error) {
    throw new Error(error);
  }
});

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'))

app.get('/version', (req, res) => {
  res.json({
    version: "0.0.0"
  });
});

// Boot the system, and create EventStore projections if needed
bootstrapper.boot(config);

// Wire up express-handlebars as the view engine for express.
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// NOTE: Do not rearrange the order of these app.* statements becaused they
// are crucial for the order of operations in the pipeline of middleware
// functions!
app.use(cors());

app.use(express.static(`${__dirname}/client`));

app.get('/instances', (req, res) => {
  res.render('instances');
});

// Ensure that all routes with :instanceId parameters are properly authenticated
app.param('instanceId', catchAsyncErrors(instanceAuthenticator));
app.param('digestId', catchAsyncErrors(instanceToDigestValidator));
app.param('inboxId', catchAsyncErrors(instanceToInboxValidator));

// NOTE: See above warning. Why are you even considering moving these?
// Think thrice.
appConfigure(app);

// SPIKE: Provide a public entry point for the API
app.get('/api/public', (req, res) => {
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
app.use((req, res, next) => {
  res.setHeader("X-CommitStream-API-Docs", "https://github.com/openAgile/CommitStream.Web");
  return next();
});

// This must happen here, before we cover additional routes with Content-Type validation
instancesController.init(app);

// Ensure all API routes have consistent Content-Type validation
app.all('/api/*', apiRoutesRequireContentTypeAppJson);

// Map API the routes
api.init(app);

// DO NOT MOVE THIS. It must be here to catch unhandled errors.
app.use(csErrorHandler);

const getHostSettings = req => ({
  protocol: config.protocol || req.protocol,
  host: req.get('host'),
  key: req.query.key
});

app.get('/app', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  const settings = getHostSettings(req);

  res.render('app', {
    apiUrl: `${settings.protocol}://${settings.host}/api/`,
    protocol: settings.protocol,
    resourcePath: `${settings.protocol}://${settings.host}/`,
    showChildrenFeatureToggle: config.showChildrenFeatureToggle.toString()
  });
});

app.listen(config.port, () => {
  console.log(`CommitStream Web Server listening on port ${config.port}`);
});