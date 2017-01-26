'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _inboxesHalDecoratorsDecoratorFactory = require('../inboxes/halDecorators/decoratorFactory');

var _inboxesHalDecoratorsDecoratorFactory2 = _interopRequireDefault(_inboxesHalDecoratorsDecoratorFactory);

exports['default'] = function (href, instanceId, digest, state) {
	var inboxIds = _underscore2['default'].keys(state.inboxes);
	var formatted = {
		"_links": {
			"self": {
				"href": href('/api/' + instanceId + '/digests/' + digest.digestId + '/inboxes')
			},
			"digest": {
				"href": href('/api/' + instanceId + '/digests/' + digest.digestId)
			},
			"inbox-create": {
				"href": href('/api/' + instanceId + '/digests/' + digest.digestId + '/inboxes'),
				"method": "POST",
				"title": 'Endpoint for creating an inbox for a repository on digest ' + digest.digestId + '.'
			}
		},
		"count": inboxIds.length,
		"digest": {
			"description": digest.description,
			"digestId": digest.digestId
		},
		"_embedded": {
			"inboxes": []
		}
	};

	function createInboxHyperMediaResult(instanceId, inbox) {
		var result = {
			"_links": {
				"self": {
					"href": href('/api/' + instanceId + '/inboxes/' + inbox.inboxId)
				},
				"add-commit": {
					"href": href('/api/' + instanceId + '/inboxes/' + inbox.inboxId + '/commits')
				}
			}
		};

		var halDecorator = _inboxesHalDecoratorsDecoratorFactory2['default'].create(inbox.family);
		if (halDecorator) {
			result = halDecorator.decorateHalResponse(result);
		};
		result = _underscore2['default'].extend(result, _underscore2['default'].omit(inbox, 'digestId'));

		return result;
	}

	inboxIds.forEach(function (inboxId) {
		formatted._embedded.inboxes.push(createInboxHyperMediaResult(instanceId, state.inboxes[inboxId]));
	});

	return formatted;
};

module.exports = exports['default'];
