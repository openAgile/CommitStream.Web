var chai = require('chai'),
  should = chai.should(),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  BitbucketCommitMalformedError = require('../../../middleware/bitbucketCommitMalformedError'),
  uuidStub = sinon.stub(),
  bitbucketTranslator = proxyquire('../../../api/translators/bitbucketTranslator', {
    'uuid-v4': uuidStub
  });


var pushEvent = {
  "push": {
    "changes": [{
      "new": {
        "name": "master",
        "target": {
          "hash": "24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
          "author": {
            "raw": "Mariano Kunzi <kunzi.mariano@gmail.com>",
            "user": {
              "display_name": "Mariano Kunzi",
              "uuid": "{ebc966b1-5081-461c-98dc-b297d932d25b}",
              "username": "kunzimariano",
              "type": "user",
              "links": {
                "html": {
                  "href": "https://bitbucket.org/kunzimariano/"
                },
                "self": {
                  "href": "https://api.bitbucket.org/2.0/users/kunzimariano"
                },
                "avatar": {
                  "href": "https://bitbucket.org/account/kunzimariano/avatar/32/"
                }
              }
            }
          },
          "type": "commit",
          "parents": [{
            "hash": "2bc4f8d850c67adf9d061755d4cf387cf63ce0dd",
            "type": "commit",
            "links": {
              "html": {
                "href": "https://bitbucket.org/kunzimariano/test/commits/2bc4f8d850c67adf9d061755d4cf387cf63ce0dd"
              },
              "self": {
                "href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test/commit/2bc4f8d850c67adf9d061755d4cf387cf63ce0dd"
              }
            }
          }],
          "date": "2015-08-18T18:43:11+00:00",
          "message": "README.md edited online with Bitbucket",
          "links": {
            "html": {
              "href": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22"
            },
            "self": {
              "href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test/commit/24480f9c4f1b4cff6c8ccec86416f6b258b75b22"
            }
          }
        },
        "type": "branch",
        "links": {
          "html": {
            "href": "https://bitbucket.org/kunzimariano/test/branch/master"
          },
          "self": {
            "href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test/refs/branches/master"
          },
          "commits": {
            "href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test/commits/master"
          }
        }
      },
      "commits": [{
        "hash": "24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
        "author": {
          "raw": "Mariano Kunzi <kunzi.mariano@gmail.com>",
          "user": {
            "display_name": "Mariano Kunzi",
            "username": "kunzimariano"
          }
        },
        "links": {
          "html": {
            "href": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22"
          }
        },
        "message": "README.md edited online with Bitbucket"
      }]
    }]
  },
  "repository": {
    "full_name": "kunzimariano/test",
    "uuid": "{9ad3f4a8-99d8-4b50-be5c-807459179855}",
    "links": {
      "html": {
        "href": "https://bitbucket.org/kunzimariano/test"
      },
      "self": {
        "href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test"
      },
      "avatar": {
        "href": "https://bitbucket.org/kunzimariano/test/avatar/16/"
      }
    },
    "name": "test",
    "type": "repository"
  }
};

describe('bitbucketTranslator', function() {

  describe('with appropriate headers', function() {

    it('canTranslate should return true when valid headers are present', function() {
      var request = {
        headers: {
          'x-event-key': 'repo:push'
        }
      };
      bitbucketTranslator.canTranslate(request).should.equal(true);
    });

  });

  describe('with incorrect headers', function() {

    it('canTranslate should return false when invalid headers are present', function() {
      var request = {
        headers: {
          'x-event-key': 'dummy value'
        }
      };
      bitbucketTranslator.canTranslate(request).should.equal(false);
    });

    it('canTranslate should return false when user-agent header isn\'t available', function() {
      var request = {
        headers: {}
      };
      bitbucketTranslator.canTranslate(request).should.equal(false);
    });

  });

  describe('with valid body', function() {
    uuidStub.returns(1234);

    var expected = [{
      eventId: 1234,
      eventType: 'BitbucketCommitReceived',
      data: {
        sha: '24480f9c4f1b4cff6c8ccec86416f6b258b75b22',
        commit: {
          author: "kunzimariano",
          committer: {
            date: "",
            email: "Mariano Kunzi <kunzi.mariano@gmail.com>",
            name: "Mariano Kunzi"
          },
          message: "README.md edited online with Bitbucket"
        },
        html_url: 'https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22',
        repository: {
          id: "{9ad3f4a8-99d8-4b50-be5c-807459179855}",
          name: "test"
        },
        branch: 'master',
        originalMessage: {
          "hash": "24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
          "author": {
            "raw": "Mariano Kunzi <kunzi.mariano@gmail.com>",
            "user": {
              "display_name": "Mariano Kunzi",
              "username": "kunzimariano"
            }
          },
          "links": {
            "html": {
              "href": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22"
            }
          },
          "message": "README.md edited online with Bitbucket"
        }
      },
      metadata: {
        instanceId: '111',
        digestId: '222',
        inboxId: '333'
      }
    }];

    it('returns the expected object', function() {
      var actual = bitbucketTranslator.translatePush(pushEvent, '111', '222', '333');
      actual.should.deep.equal(expected);

    });

  });

  describe('with invalid body', function() {

    var invokeTranslatePush = function() {
      bitbucketTranslator.translatePush({}, '111', '222', '333')
    }
    invokeTranslatePush.should.throw(BitbucketCommitMalformedError);
  });

});
