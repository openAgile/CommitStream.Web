'use strict';

(function (bitbucketTranslator) {
  var _ = require('underscore'),
      uuid = require('uuid-v4');

  var hasCorrectHeaders = function hasCorrectHeaders(headers) {
    //X-Event-Key: repo:push
    return headers.hasOwnProperty('User-Agent') && headers['User-Agent'] === 'Bitbucket-Webhooks/2.0';
  };

  bitbucketTranslator.canTranslate = function (request) {
    if (hasCorrectHeaders(request.headers)) {
      return true;
    }
    return false;
  };

  bitbucketTranslator.translatePush = function (pushEvent, instanceId, digestId, inboxId) {

    try {
      var _ret = (function () {
        var branch = pushEvent.push.changes[0]['new'].name;
        var repository = {
          id: pushEvent.repository.uuid,
          name: pushEvent.repository.name
        };
        var events = _.map(pushEvent.push.changes[0].commits, function (aCommit) {
          var commit = {
            sha: aCommit.hash,
            commit: {
              author: aCommit.author.user.username,
              // bitbucket does not have a commit.committer object. Using the same thing as author for now.
              committer: {
                name: aCommit.author.user.display_name,
                email: aCommit.author.raw,
                date: ''
              },
              message: aCommit.message
            },
            html_url: aCommit.links.html.href,
            repository: repository,
            branch: branch,
            originalMessage: aCommit
          };
          return {
            eventId: uuid(),
            eventType: 'BitbucketCommitReceived',
            data: commit,
            metadata: {
              instanceId: instanceId,
              digestId: digestId,
              inboxId: inboxId
            }
          };
        });

        return {
          v: events
        };
      })();

      if (typeof _ret === 'object') return _ret.v;
    } catch (ex) {
      console.log(ex);
      throw ex;
      //throw new BitbucketCommitMalformedError(ex, pushEvent);
    }
  };
})(module.exports);
