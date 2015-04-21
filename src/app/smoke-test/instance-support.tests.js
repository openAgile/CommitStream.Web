var chai = require('chai'),
  should = chai.should(),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  _ = require('underscore'),
  rp = require('request-promise'),
  base = require('./lib/base');

base.enableLogging(true);
_.extend(global, base);
_.extend(global, require('./testData'));

chai.use(sinonChai);
chai.config.includeStack = true;

var testCases = [{
  name: 'Create first valid instance and push commits to an inbox',
  instance: testData.instances.validInstance1,
  digest: {
    description: 'My new digest'
  },
  inbox: {
    'name': 'PrettyCool.Code',
    'family': 'GitHub'
  },
  commits: testData.commits.wellFormedCommitsSample1,
  expectedMessage: 'The commits have been added to the CommitStream inbox.',
  workItemToQueryFor: 'S-11111'
}, {
  name: 'Create second valid instance and push commits to an inbox',
  instance: testData.instances.validInstance2,
  digest: {
    description: 'My new digest (on different instance)'
  },
  inbox: {
    'name': 'PrettyCool.CodeUnderMyOwnAccount',
    'family': 'GitHub'
  },
  commits: testData.commits.wellFormedCommitsSample2,
  expectedMessage: 'The commits have been added to the CommitStream inbox.',
  workItemToQueryFor: 'S-11111'
}];

// TODO use Chai as Promised to finish this...

function instanceTest(testCase, it) {
  it(testCase.name, function(done) {
    post('/instances', testCase.instance)
      .then(postToLink('digest-create', testCase.digest))
      .then(postToLink('inbox-create', testCase.inbox))
      .then(postToLink('add-commit', testCase.commits, {
        'x-github-event': 'push'
      }))
      .then(function(addCommitResponse) {
        addCommitResponse.message.should.equal(testCase.expectedMessage);
        console.log('```json\n' + JSON.stringify(addCommitResponse.message, ' ', 2) + '\n```\n\n');
        var query = get('/' + testCase.instance.instanceId + '/query?workitem=' + testCase.workItemToQueryFor + '&apiKey=' + getApiKey());
        console.log(query);
        //return rp(query);
      })
      /*
      .then(function(queryResponse) {
        console.log('```json\n' + JSON.stringify(queryResponse, ' ', 2) + '\n```\n\n');
        var firstMessage = queryResponse.commits[0].message;
        firstMessage.should.equal(testCase.commits.commits[0].message);
        console.log("Here is the first commit:");
        console.log(firstMessage);
        console.log("\n");
      })
      */
      .catch(console.error)
      .finally(done);
  });
}

describe("Smoke test", function() {
  testCases.forEach(function(testCase) {
    instanceTest(testCase, it);
  });
});