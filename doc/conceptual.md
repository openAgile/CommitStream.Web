# CommitStream Conceptual Model (roughly speaking)

![http://yuml.me/893d5504](http://yuml.me/893d5504)

# Definitions

## Instance
> An Instance in CommitStream logically corresponds to a single VersionOne instance. 

* Within a single VersionOne instance, the workitem numbers `S-11111`, `D-01992`, `AT-99881`, etc are unique. 
  * They are not unique across multiple instances. 
* VersionOne instances are separate physical installations
* CommitStream Instances are separate `data partitions` within in a single hosted service
  * EventStore's clustering support will provide redundancy
  
## Digest

> A Digest in CommitStream aggregates commits from one or more code repositories for the purpose of associating them with VersionOne workitems. Some Digests may aggregate commits from a single repository, while others may aggregate over dozens of repositories.

* In our VersionOne production testing setup, we have a Digest for Core, and a Digest for openAgile.

## Inbox
> An Inbox in CommitStream corresponds to a single code repository and provides a unique URL to which WebHooks send commit messages

* In our VersionOne production testing setup, for our two Digests we currently have:
  * Core Digest (for private repos):
    * `Core`
  * openAgile Digest (for all open source public repos):
    * `CommitStream.Web`
    * `VersionOne.SDK.Java.APIClient`
    * `VersionOne.Integration.TFS.Core`
    * `VersionOne.SDK.NET.APIClient`
    * `VersionOne.Integration.TFS.Listener`
    * `VersionOne.Integration.TFS.Policy.VS2012`
    * `VersionOne.Integration.TFS.Policy.VS2013`
    * `VersionOne.Integration.TFS.Policy`
    * `VersionOne.Integration.TFS.Scripts`
    * `VersionOne.Integration.BugZilla`
    * `VersionOne.Integration.ClarityPPM`

## Commit

> A Commit in CommitStream represents a single commit message from a VCS system

* Currently, we process GitHub WebHook commit messages with a [gitHubTranslator](https://github.com/openAgile/CommitStream.Web/blob/develop/src/app/api/translators/githubTranslator.js) module.
* We will abstract this into a plugin-based approach in order to add suppot to translate commit messags from other systems, and provide an **open API** for other third-parties to proactively contribute translator plugins that pass a set of required unit tests before we will accept them as pull-requests into the code base.
* A few of the known VCS tools that support WebHooks
  * [VisualStudioOnline](https://www.visualstudio.com/en-us/webhooks-and-vso-vs.aspx)
  * [GitLabs](https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/web_hooks/web_hooks.md)*
  * [GitHub Enterprise](https://developer.github.com/webhooks/)*
  * [BitBucket](https://bitbucket.org/StephenHowells/webhook)
  * [Stash](https://confluence.atlassian.com/display/STASH/POST+service+webhook+for+Stash)
  * [XP-Dev.com](https://xp-dev.com/docs/user-guide/repositories/webhooks.html)

* indicates that prospect early-access customers have already asked about these VCS tools

## VersionOne_WorkitemMention

> In CommitStream, a VersionOne_WorkitemMention indicates that a VersionOne workitem has been mentioned in a commit message. VersionOne workitem numbers examples include `S-12345`, `D-89771`, `AT-56732`, etc.

* Currently, we surface these commits that contain workitem mentions within:
  * Workitem detail lightboxes
    * Two early-access customers have asked if child workitems, such as Tasks and Tests and related Defects could be "rolled up" to appear in the workitem panel for stories. We believe we could achieve this with EventStore's `ad-hoc query` mechanism.
  * Optional TeamRoom Digest Web Panel


# Example automated smoke test

After our Testing Summit on 3/3/2015, we [Mob Programmed](http://mobprogramming.org/) a declarative, simple approach that Shawn Marie wanted to have for writing test cases. We then pulled out some abstractions that help us quickly write end-to-end scenario tests. 

## Hypermedia with links via HAL

HAL is Hypermedia Application Language. It's one of a handful of hypermedia formats. We can't say it's "the best". It's just where we started and it's proving helpful in its limited way of providing links within each API response that point to valid "next steps". RAML looks like a more complete specification language that can build on top of JSON-schema for more advanced capabilities like validation.

* [HAL Spec](https://github.com/mikekelly/hal_specification)
* [Mike Kelly's interview about HAL adoption](http://www.infoq.com/articles/web-apis-hal)
* [HAL in an Amazon AppStream](http://docs.aws.amazon.com/appstream/latest/developerguide/appstream-api-rest.html)
* [RAML: RESTful API Modeling Language](http://raml.org/)
* [FizzBuzz with Hypermedia](http://smizell.com/weblog/2014/solving-fizzbuzz-with-hypermedia)
* [Designing Evolvable Web APIs with ASP.NET](http://chimera.labs.oreilly.com/books/1234000001708) -- Free book that discusses hypermedia APIs with ASP.NET examples.

Here's a complete example:

```javascript
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
  expectedMessage: 'Your push event has been queued to be added to CommitStream.',
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
  expectedMessage: 'Your push event has been queued to be added to CommitStream.',
  workItemToQueryFor: 'S-11111'
}];

// TODO use Chai as Promised to finish this...

function instanceTest(testCase, it) {
  it(testCase.name, function(done) {
    post('/instances' + getAdminApiKeyAsParam(), testCase.instance)
      .then(postToLink('digest-create', testCase.digest))
      .then(postToLink('inbox-create', testCase.inbox))
      .then(postToLink('add-commit', testCase.commits, {
        'x-github-event': 'push'
      }))
      .then(function(addCommitResponse) {
        addCommitResponse.message.should.equal(testCase.expectedMessage);
        var query = get('/' + testCase.instance.instanceId + '/query?workitem=' + testCase.workItemToQueryFor + '&apiKey=' + getApiKey());
        return rp(query);
      })
      .then(function(queryResponse) {
        var firstMessage = queryResponse.commits[0].message;
        firstMessage.should.equal(testCase.commits.commits[0].message);
        console.log("Here is the first commit:");
        console.log(firstMessage);
        console.log("\n");
      })
      .catch(console.error)
      .finally(done);
  });
}

describe("Smoke test", function() {
  testCases.forEach(function(testCase) {
    instanceTest(testCase, it);
  });
});
```
## Code highlights

* The function `postToLink` returns a new function closed over the two parameters that will then accept the parsed HAL/JSON response of the previous Promise, and then returns a new Promise for the next step. 
  * This Leads to an easy chain of request and response processing to coordinate the entire scenario test in a highly declartive way.
  * Laureano's [hackweek spike for a StackOverflow CommitStream plugin](https://github.com/lremedi/stackoverflow-questions/blob/master/lib/job/index.js#L87-L103) was helpful in motivating this approach.
  * This [article by Solution Optimist](http://solutionoptimist.com/2013/12/27/javascript-promise-chains-2/) was as well.

```javascript
  function postToLink(linkName, data, extraHeaders) {
    return function(halResponse) {
      if (halResponse.apiKey) apiKey = halResponse.apiKey; // Cheap n dirty
      var link = getLink(halResponse, linkName);
      if (apiKey !== null) link += "?apiKey=" + apiKey;
      return rp(postOptions(link, data, extraHeaders));
    };
  }
```
* The references to `testData.commits.wellFormedCommitsSample1` and other items point to common shared test data in this separate module.
  * Having shared test data with well-named example cases will make it easier for Shawn Marie to write automated scenarios without duplication

# Smoke test API request and response chain

## Step 1: Create a new Instance within CommitStream

`post('/instances' + getAdminApiKeyAsParam(), testCase.instance)`

After getting this HAL response:

```json
{
  "_links": {
    "self": {
      "href": "http://localhost:6565/api/instances/2ef2b90b-52ae-4a2a-a606-09cb0c4d33c5"
    },
    "digests": {
      "href": "http://localhost:6565/api/2ef2b90b-52ae-4a2a-a606-09cb0c4d33c5/digests"
    },
    "digest-create": {
      "href": "http://localhost:6565/api/2ef2b90b-52ae-4a2a-a606-09cb0c4d33c5/digests",
      "method": "POST",
      "title": "Endpoint for creating a digest on instance 2ef2b90b-52ae-4a2a-a606-09cb0c4d33c5."
    }
  },
  "instanceId": "2ef2b90b-52ae-4a2a-a606-09cb0c4d33c5",
  "apiKey": "b5ec65fd-c02d-4d1e-9d25-aa3dc87e5718"
}
```
## Step 2: Create a Digest within the new Instance

We then extract the `digest-create` link from the `_links` property, returning:


`http://localhost:6565/api/2ef2b90b-52ae-4a2a-a606-09cb0c4d33c5/digests?apiKey=b5ec65fd-c02d-4d1e-9d25-aa3dc87e5718`.


And then POST the following JSON body to that link:


```json
{
  "description": "My new digest"
}
```


<hr/>

## Step 3: Create an Inbox within the new Digest

After getting this HAL response:


```json
{
  "_links": {
    "self": {
      "href": "http://localhost:6565/api/2ef2b90b-52ae-4a2a-a606-09cb0c4d33c5/digests/7b93dc05-dbe8-4aff-a6de-762bacc08940"
    },
    "digests": {
      "href": "http://localhost:6565/api/2ef2b90b-52ae-4a2a-a606-09cb0c4d33c5/digests"
    },
    "inbox-create": {
      "href": "http://localhost:6565/api/2ef2b90b-52ae-4a2a-a606-09cb0c4d33c5/digests/7b93dc05-dbe8-4aff-a6de-762bacc08940/inboxes",
      "method": "POST",
      "title": "Endpoint for creating an inbox for a repository on digest 7b93dc05-dbe8-4aff-a6de-762bacc08940."
    }
  },
  "digestId": "7b93dc05-dbe8-4aff-a6de-762bacc08940"
}
```


We then extract the `inbox-create` link from the `_links` property, returning:


`http://localhost:6565/api/2ef2b90b-52ae-4a2a-a606-09cb0c4d33c5/digests/7b93dc05-dbe8-4aff-a6de-762bacc08940/inboxes?apiKey=b5ec65fd-c02d-4d1e-9d25-aa3dc87e5718`.


And then POST the following JSON body to that link:


```json
{
  "name": "PrettyCool.Code",
  "family": "GitHub"
}
```


<hr/>

## Step 4: POST sample GitHub commits to the new Inbox

After getting this HAL response:


```json
{
  "_links": {
    "self": {
      "href": "http://localhost:6565/api/2ef2b90b-52ae-4a2a-a606-09cb0c4d33c5/inboxes/f6254e9c-0818-4b69-beae-f8c98b3dd537"
    },
    "add-commit": {
      "href": "http://localhost:6565/api/2ef2b90b-52ae-4a2a-a606-09cb0c4d33c5/inboxes/f6254e9c-0818-4b69-beae-f8c98b3dd537/commits"
    }
  },
  "inboxId": "f6254e9c-0818-4b69-beae-f8c98b3dd537"
}
```


We then extract the `add-commit` link from the `_links` property, returning:


`http://localhost:6565/api/2ef2b90b-52ae-4a2a-a606-09cb0c4d33c5/inboxes/f6254e9c-0818-4b69-beae-f8c98b3dd537/commits?apiKey=b5ec65fd-c02d-4d1e-9d25-aa3dc87e5718`.


And then POST the following JSON body to that link:


```json
{
  "ref": "refs/heads/master",
  "commits": [
    {
      "id": "b42c285e1506edac965g92573a2121700fc92f8b",
      "distinct": true,
      "message": "S-11111 Hey all this stuff broke today, what's wrong?",
      "timestamp": "2014-10-03T15:57:14-03:00",
      "url": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/b42c285e1506edac965g92573a2121700fc92f8b",
      "author": {
        "name": "marieshawn",
        "email": "abbott.shawn@versionone.com",
        "username": "shawnmarie"
      },
      "committer": {
        "name": "marieshawn",
        "email": "abbott.shawn@versionone.com",
        "username": "marieshawn"
      },
      "added": [],
      "removed": [],
      "modified": [
        "README.md"
      ]
    }
  ],
  "repository": {
    "id": 23355501,
    "name": "CommitService.DemoRepo"
  }
}
```


<hr/>

## Step 5: Query the CommitStream Instance for commits containing an expected VersionOne Workitem Mention:

After getting this JSON response:

```json
{ 
 "message": "Your push event has been queued to be added to CommitStream."
}
```

We then (manually for now since this response doesn't yet have HAL `_links`) execute a GET query at:

`http://localhost:6565/api/453fcccd-3717-411d-8f87-3421b9effd79/query?workitem=S-11111&apiKey=1cb0ea2b-8115-4ca8-9ff9-de161ed6d629`

* **Note:** this route will change to something like `http://localhost:6565/api/:instanceId/commits/tags/versionone/workitems/S-11233` to allow for the concept of provider-specific integrations (like VersionOne in this case), underneath a general resource category of "tags"

## Step 6: Verify the presence of the expected commit message

After getting this JSON response (not HALified yet):

```json
{
  "commits": [
    {
      "commitDate": "2014-10-03T15:57:14-03:00",
      "timeFormatted": "5 months ago",
      "author": "shawnmarie",
      "sha1Partial": "b42c28",
      "action": "committed",
      "message": "S-11111 Updated Happy Path Validations!",
      "commitHref": "https://github.com/kunzimariano/CommitService.DemoRepo/comm
it/b42c285e1506edac965g92573a2121700fc92f8b",
      "repo": "kunzimariano/CommitService.DemoRepo",
      "branch": "master",
      "branchHref": "https://github.com/kunzimariano/CommitService.DemoRepo/tree
/master",
      "repoHref": "https://github.com/kunzimariano/CommitService.DemoRepo"
    }
  ]
}
```

We verify that first commit message matches the expected commit message:

Here is the first commit:

`S-11111 Hey all this stuff broke today, what's wrong?`
