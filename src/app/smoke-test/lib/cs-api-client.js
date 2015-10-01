'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Symbol = require('babel-runtime/core-js/symbol')['default'];

var _Reflect$ownKeys = require('babel-runtime/core-js/reflect/own-keys')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Symbol$iterator = require('babel-runtime/core-js/symbol/iterator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _familyPayloadExamples = require('./family-payload-examples');

var _familyPayloadExamples2 = _interopRequireDefault(_familyPayloadExamples);

var loggingSeparator = '<hr/>';

var getLink = function getLink(obj, linkName) {
  return obj._links[linkName].href;
};

var postOptions = function postOptions(uri, data, extraHeaders) {
  var headers = {
    'Content-Type': 'application/json'
  };

  if (extraHeaders) headers = _Object$assign(headers, extraHeaders);

  return {
    uri: uri,
    method: 'POST',
    headers: headers,
    transform: function transform(body) {
      return JSON.parse(body);
    },
    body: JSON.stringify(data)
  };
};

var _postToLink = function _postToLink(client, halResponse, linkName, data, extraHeaders) {
  if (client.loggingEnabled) {
    console.log('After getting this HAL response:\n\n');
    console.log('```json\n' + JSON.stringify(halResponse, ' ', 2) + '\n```\n\n');
    if (halResponse._links['teamroom-view']) {
      console.log('TEAMROOM LINK:');
      console.log(halResponse._links['teamroom-view'].href + '&apiKey=' + client.apiKey);
    }
  }
  if (halResponse.apiKey) {
    client.apiKey = halResponse.apiKey; // Cheap n dirty
    client.instanceId = halResponse.instanceId;
  }
  var link = getLink(halResponse, linkName);
  if (client.apiKey !== null) link += "?apiKey=" + client.apiKey;

  if (client.loggingEnabled) {
    console.log('We then extract the `' + linkName + '` link from the `_links` property, returning:\n\n');
    console.log('`' + link + '`.\n\n');
    console.log('And then POST the following JSON body to that link:\n\n');
    console.log('```json\n' + JSON.stringify(data, ' ', 2) + '\n```\n\n');
    console.log(loggingSeparator);
  }

  return (0, _requestPromise2['default'])(postOptions(link, data, extraHeaders));
};

var post = function post(client, path, data) {
  return (0, _requestPromise2['default'])(postOptions(client.href(path), data));
};

var getOptions = function getOptions(uri) {
  return {
    uri: uri,
    method: 'GET',
    transform: function transform(body) {
      return JSON.parse(body);
    },
    headers: {
      'Content-Type': 'application/json'
    }
  };
};

var _get2 = function _get2(client, uri, alreadyAbsolute) {
  uri = alreadyAbsolute ? uri : client.href(uri);
  return (0, _requestPromise2['default'])(getOptions(uri));
};

var _getFromLink = function _getFromLink(client, halResponse, linkName) {
  var link = getLink(halResponse, linkName);
  if (client.apiKey !== null) link += "?apiKey=" + client.apiKey;
  return _get2(client, link, true);
};

var postToInboxForFamily = function postToInboxForFamily(client, inbox, message, family, extraHeaders) {
  return _postToLink(client, inbox, 'add-commit', _familyPayloadExamples2['default'][family].validWithOneCommit(message), extraHeaders);
};

var families = {
  GitHub: {
    commitAdd: function commitAdd(client, inbox) {
      var message = arguments.length <= 2 || arguments[2] === undefined ? 'GitHub commit' : arguments[2];
      return postToInboxForFamily(client, inbox, message, 'GitHub', { 'x-github-event': 'push' });
    }
  },
  GitLab: {
    commitAdd: function commitAdd(client, inbox) {
      var message = arguments.length <= 2 || arguments[2] === undefined ? 'GitLab commit' : arguments[2];
      return postToInboxForFamily(client, inbox, message, 'GitLab', { 'x-gitlab-event': 'Push Hook' });
    }
  },
  Bitbucket: {
    commitAdd: function commitAdd(client, inbox) {
      var message = arguments.length <= 2 || arguments[2] === undefined ? 'Bitbucket commit' : arguments[2];
      return postToInboxForFamily(client, inbox, message, 'Bitbucket', { 'x-event-key': 'repo:push' });
    }
  }
};

var CSApiClient = (function () {
  function CSApiClient() {
    var baseUrl = arguments.length <= 0 || arguments[0] === undefined ? 'http://localhost:6565/api' : arguments[0];
    var loggingEnabled = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    _classCallCheck(this, CSApiClient);

    this._baseUrl = baseUrl;
    this._loggingEnabled = loggingEnabled;
    this._instanceId = null;
    this._apiKey = null;
  }

  _createClass(CSApiClient, [{
    key: 'instanceCreate',
    value: function instanceCreate() {
      return _regeneratorRuntime.async(function instanceCreate$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(Instance.create(this));

          case 2:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'instanceGet',
    value: function instanceGet(instanceId, apiKey) {
      return _regeneratorRuntime.async(function instanceGet$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(Instance.get(this, instanceId, apiKey));

          case 2:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'href',
    value: function href(path) {
      return '' + this.baseUrl + path;
    }
  }, {
    key: 'apiKey',
    get: function get() {
      return this._apiKey;
    },
    set: function set(val) {
      this._apiKey = val;
    }
  }, {
    key: 'instanceId',
    get: function get() {
      return this._instanceId;
    },
    set: function set(val) {
      this._instanceId = val;
    }
  }, {
    key: 'baseUrl',
    get: function get() {
      return this._baseUrl;
    },
    set: function set(val) {
      this._baseUrl = val;
    }
  }, {
    key: 'loggingEnabled',
    get: function get() {
      return this._loggingEnabled;
    },
    set: function set(val) {
      this._loggingEnabled = val;
    }
  }]);

  return CSApiClient;
})();

var resourceSymbol = _Symbol('resource');
var clientSymbol = _Symbol('client');

var Resource = (function () {
  function Resource(client, resource) {
    var _this = this;

    _classCallCheck(this, Resource);

    this[clientSymbol] = client;
    this[resourceSymbol] = resource;
    _Reflect$ownKeys(resource).slice(1).forEach(function (prop) {
      return _Object$defineProperty(_this, prop, {
        get: function get() {
          return resource[prop];
        },
        enumerable: true,
        configurable: true
      });
    });
  }

  _createClass(Resource, [{
    key: 'postToLink',
    value: function postToLink(linkName, data, ResourceWrapperClass) {
      var resource;
      return _regeneratorRuntime.async(function postToLink$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(_postToLink(this[clientSymbol], this[resourceSymbol], linkName, data));

          case 2:
            resource = context$2$0.sent;
            return context$2$0.abrupt('return', new ResourceWrapperClass(this[clientSymbol], resource));

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'getFromLink',
    value: function getFromLink(linkName, ResourceWrapperClass) {
      var resource;
      return _regeneratorRuntime.async(function getFromLink$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(_getFromLink(this[clientSymbol], this[resourceSymbol], linkName));

          case 2:
            resource = context$2$0.sent;
            return context$2$0.abrupt('return', new ResourceWrapperClass(this[clientSymbol], resource));

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'resource',
    get: function get() {
      return this[resourceSymbol];
    }
  }]);

  return Resource;
})();

var Instance = (function (_Resource) {
  _inherits(Instance, _Resource);

  function Instance() {
    _classCallCheck(this, Instance);

    _get(Object.getPrototypeOf(Instance.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Instance, [{
    key: 'digestCreate',
    value: function digestCreate(data) {
      return _regeneratorRuntime.async(function digestCreate$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(this.postToLink('digest-create', data, Digest));

          case 2:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'digestsGet',
    value: function digestsGet() {
      return _regeneratorRuntime.async(function digestsGet$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(this.getFromLink('digests', Digests));

          case 2:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'commitsForWorkItemsGet',
    value: function commitsForWorkItemsGet() {
      var workitems = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var url, commits;
      return _regeneratorRuntime.async(function commitsForWorkItemsGet$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            url = '/' + this[clientSymbol].instanceId + '/commits/tags/versionone/workitem?numbers=' + workitems.join(',') + '&apiKey=' + this[clientSymbol].apiKey;
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(_get2(this[clientSymbol], url));

          case 3:
            commits = context$2$0.sent;
            return context$2$0.abrupt('return', commits);

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }], [{
    key: 'create',
    value: function create(client) {
      var instanceResource;
      return _regeneratorRuntime.async(function create$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(post(client, '/instances', {}));

          case 2:
            instanceResource = context$2$0.sent;
            return context$2$0.abrupt('return', new Instance(client, instanceResource));

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'get',
    value: function get(client, instanceId, apiKey) {
      var url, instanceResource;
      return _regeneratorRuntime.async(function get$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            client.apiKey = apiKey;
            client.instanceId = instanceId;
            url = '/instances/' + instanceId + '?apiKey=' + apiKey;
            context$2$0.next = 5;
            return _regeneratorRuntime.awrap(_get2(client, url));

          case 5:
            instanceResource = context$2$0.sent;
            return context$2$0.abrupt('return', new Instance(client, instanceResource));

          case 7:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return Instance;
})(Resource);

;

var Digests = (function (_Resource2) {
  _inherits(Digests, _Resource2);

  function Digests() {
    _classCallCheck(this, Digests);

    _get(Object.getPrototypeOf(Digests.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Digests, [{
    key: _Symbol$iterator,
    value: _regeneratorRuntime.mark(function value() {
      var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, digest;

      return _regeneratorRuntime.wrap(function value$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            context$2$0.prev = 3;
            _iterator = _getIterator(this.resource._embedded['digests']);

          case 5:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              context$2$0.next = 12;
              break;
            }

            digest = _step.value;
            context$2$0.next = 9;
            return new Digest(this[clientSymbol], digest);

          case 9:
            _iteratorNormalCompletion = true;
            context$2$0.next = 5;
            break;

          case 12:
            context$2$0.next = 18;
            break;

          case 14:
            context$2$0.prev = 14;
            context$2$0.t0 = context$2$0['catch'](3);
            _didIteratorError = true;
            _iteratorError = context$2$0.t0;

          case 18:
            context$2$0.prev = 18;
            context$2$0.prev = 19;

            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }

          case 21:
            context$2$0.prev = 21;

            if (!_didIteratorError) {
              context$2$0.next = 24;
              break;
            }

            throw _iteratorError;

          case 24:
            return context$2$0.finish(21);

          case 25:
            return context$2$0.finish(18);

          case 26:
          case 'end':
            return context$2$0.stop();
        }
      }, value, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    })
  }]);

  return Digests;
})(Resource);

var Digest = (function (_Resource3) {
  _inherits(Digest, _Resource3);

  function Digest() {
    _classCallCheck(this, Digest);

    _get(Object.getPrototypeOf(Digest.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Digest, [{
    key: 'inboxesGet',

    // TODO: add inboxes link to the embedded results in digestsGet
    //async inboxesGet() {
    //console.log(JSON.stringify(this.resource));
    //  return await this.getFromLink('inboxes', Inboxes);
    //} 
    value: function inboxesGet() {
      var url, inboxes;
      return _regeneratorRuntime.async(function inboxesGet$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            url = '/' + this[clientSymbol].instanceId + '/digests/' + this.resource.digestId + '/inboxes?apiKey=' + this[clientSymbol].apiKey;
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(_get2(this[clientSymbol], url));

          case 3:
            inboxes = context$2$0.sent;
            return context$2$0.abrupt('return', new Inboxes(this[clientSymbol], inboxes));

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'inboxCreate',
    value: function inboxCreate(data) {
      return _regeneratorRuntime.async(function inboxCreate$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(this.postToLink('inbox-create', data, Inbox));

          case 2:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'commitsGet',
    value: function commitsGet() {
      var _ref,
          _ref$page,
          page,
          _ref$pageSize,
          pageSize,
          url,
          args$2$0 = arguments;

      return _regeneratorRuntime.async(function commitsGet$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            _ref = args$2$0.length <= 0 || args$2$0[0] === undefined ? {} : args$2$0[0];
            _ref$page = _ref.page;
            page = _ref$page === undefined ? 0 : _ref$page;
            _ref$pageSize = _ref.pageSize;
            pageSize = _ref$pageSize === undefined ? 25 : _ref$pageSize;
            url = '/' + this[clientSymbol].instanceId + '/digests/' + this.resource.digestId + '/commits?apiKey=' + this[clientSymbol].apiKey + '&page=' + page + '&pageSize=' + pageSize;
            context$2$0.next = 8;
            return _regeneratorRuntime.awrap(_get2(this[clientSymbol], url));

          case 8:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 9:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return Digest;
})(Resource);

var Inboxes = (function (_Resource4) {
  _inherits(Inboxes, _Resource4);

  function Inboxes() {
    _classCallCheck(this, Inboxes);

    _get(Object.getPrototypeOf(Inboxes.prototype), 'constructor', this).apply(this, arguments);
  }

  return Inboxes;
})(Resource);

var Inbox = (function (_Resource5) {
  _inherits(Inbox, _Resource5);

  function Inbox() {
    _classCallCheck(this, Inbox);

    _get(Object.getPrototypeOf(Inbox.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Inbox, [{
    key: 'commitCreate',
    value: function commitCreate(message) {
      var commitResponse;
      return _regeneratorRuntime.async(function commitCreate$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(families[this.family].commitAdd(this[clientSymbol], this[resourceSymbol], message));

          case 2:
            commitResponse = context$2$0.sent;
            return context$2$0.abrupt('return', commitResponse);

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return Inbox;
})(Resource);

exports['default'] = CSApiClient;

/* NOTE: Experimental code that could drive runtime class generation

const resourceSubClassDefinitions = [
  {
    name: 'Instance',
    postToLinkMethods: [
      ['digestCreate', 'digest-create', 'Digest']
    ]
  },
  {
    name: 'Digest',
    postToLinkMethods: [
      ['inboxCreate', 'inbox-create', 'Inbox']
    ]
  }
];

resourceSubClassDefinitions.forEach(def => {
  module[def.name] = class extends Resource {};
  def.postToLinkMethods.forEach(method => {
    const [name, link, resourceWrapperClassName] = method;
    module[def.name].prototype[name] = async function(data) {
      return await this.postToLink(link, module[resourceWrapperClassName]);
    }
  })
});

module.Instance.create = async function() {
  let instanceResource = await post('/instances', {});
  return new Instance(instanceResource);
}
*/
module.exports = exports['default'];
