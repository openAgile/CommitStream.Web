# Background info

Given a Customer ID: VersionOne-suhefuishf8y324342423
and an InstanceId: qwer12345
and an Instance URL: https://www7.v1host.com/v1production

Then, API routes now need to take the InstanceId into account, like:

`/api/qwer12345/etc...`

# API Routes

## Current routes:

* GET `/api/digests`
* GET `/api/digests/:digestId`
* GET `/api/digests/:digestId/inboxes`
* POST `/api/inboxes`
* GET `/api/inboxes/:uuid`
* POST `/api/inboxes/:uuid/commits`
* GET `/api/query`
* POST `/api/importHistory` <- Invalidated by inboxes and digests

## Changes needed to routes to incorporate InstanceId

PUT `/api/:instanceId` : Create a new instance (New idea)
	Notes: only with the appropriate "admin key" can this operation succeed. If the an instanceId already exists then don't overwrite.

GET	`/api/:instanceId` : Get details of an instance

GET `/api/:instanceId/digests` : List all digests for this instance

POST `/api/:instanceId/digests` : Create a new digest

GET `/api/:instanceId/digests/:digestId` : Get details for a digest

GET `/api/:instanceId/digests/:digestId/commits` : Get all commits associated with a digest (Replaces `/api/query?digestId=:digestId&workitem=ALL`)

POST `/api/:instanceId/digests/:digestId/inboxes` : Create a new inbox for a digest (Replaces POST `/api/inboxes` where the client is required to feed the digestId as a JSON parameter)

GET `/api/:instanceId/digests/:digestId/inboxes` : List all inboxes associated with a digest

GET `/api/:instanceId/inboxes/:uuid` : Get details for an inbox

POST `/api/:instanceId/inboxes/:uuid/commits` : Post commit messages to an inbox

GET `/api/:instanceId/inboxes/:uuid/commits` : Get all commits associated with an inbox (New idea)

## TODO: refine route and domain concepts below

GET `/api/:instanceId/commits/tags/:tagValue`: Get all commits matching a given tag value (Replaces `/api/query?workitem=:workitem`)
	Example: GET `/api/qwer12345/commits?tags=S-12345`, : This will be used by the Workitem sidebar panel to fetch commits "tagged" with a particular workitem mention pattern

### Blue Sky

Customers have asked to be able to get roll up of a story and its child items in the workitem sidepanel.

Given a story with number S-12345, VersionOne can query for its child items and then post a query to CommitStream, something like:

POST `/api/:instanceId/commits/query?tags=S-12345,T-00001,T-00002,AT-00001,AT-00002,D-00009,D-00010`
	- Redirect to query URL

# Authentication and Authorization

Currently, we rely on a single `key=:apiKey` query string parameter where `apiKey` is a GUID that corresponds to a privately specificied environment setting in the Azure web site's **App settings** section. For instances, we must make this value correspond the `instanceId` component of the incoming request's route.

## Example

Given a request for `/api/qwer12345/digests?key=abcde09876` 
Then validate that `abcde09876` is the correct key for the instanceId of `qwer12345`.

## TODO

* Modify the middleware [apikey.js](../../src/app/apikey.js) which performs the config check to query EventStore (or some other credential cache) to match the key against the instance. This likely will mean that a stateful projection at `instance-qwer12345` returns a state like:
```json
{
	"instanceId": "qwer12345",
	"apiKey": "abcde09876"
}
```
* The ACL for the projection `instance-qwer12345` should be readable only by system admins
Note that if we need to support the ability to modify the apiKey for a given instance, then this stateful projection should update its state in accordance. This would be the case when a customer loses control of a repository, an employee becomes disgruntled who has access to some repositories, or other security reasons.
* Create an internal EventStore user per instance that has the same password as the apiKey and is used by the `eventstore-client` instance when communicating with EventStore.
  * ACLs for all streams created by this user should be limited to this user and $admins. See how this is done here: [EventStore Access Control Lists](http://docs.geteventstore.com/server/3.0.1/access-control-lists/). 
  For example, when creating an `inbox`, we would specify metadata like so:
  ```json
{
	"digestId": "digestId-goes-here", // as before
		"$acl" : {
			"$w"  : ["qwer12345", "$admins"],
			"$r"  : ["qwer12345", "$admins"],
			"$d"  : "$admins",
			"$mw" : "$admins",
			"$mr" : "$admins"
	}
}
  ```

# Projection Design

This is the most fun part of all, naturally.

Thinking about the current flow in the system, we start with creating a digest. Of course, the normal flow will soon be for an instance to be created. But, starting where we are now:

`POST api/digests` creates a `DigestAdded` event in the `digests` stream.

## digests-by-id

This projection listens on the `digests` stream and links to a virtual stream named `digest-:digestId`:

```javascript
var callback = function (state, ev) {
	linkTo('digest-' + ev.data.digestId, ev);
};

fromStream('digests').when({ 
	'DigestAdded': callback 
});
```

## digest

The `digest` projection listens on the `digest-` category and then creates a stateful partition for the `digestId`, currently paying attention only to `DigestAdded` events:

```javascript
fromCategory('digest')
.foreachStream()
.when({
    'DigestAdded': function(state, ev) {
        return {
            digestId: ev.data.digestId,
            description: ev.data.description
        }
    }
});
```

This allows us to query the "current state" of this digest's properties at the `projection/digest/state?partition=digests-:digestId`.

## inboxes-by-id

Then a client addes an inbox to a digest with an `InboxAdded` event posted to the `inboxes` stream.

This projection listens to that stream, and similarly to for digests above, it links to a virtual `inbox-:inboxId` stream:

```javascript
var callback = function (state, ev) {
	linkTo('inbox-' + ev.data.inboxId, ev);
};

fromStream('inboxes').when({ 
	'InboxAdded': callback 
});
```

## inbox

Similar to how the `digest` projection works, the `inbox` projection listens on the `inbox-` category and then creates a stateful partition for the `inboxId`, currently paying attention only to `InboxAdded` events:

This allows us to query the "current state" of this inbox's properties at the `projection/inbox/state?partition=inbox-:inboxId`.

```javascript			
fromCategory('inbox')
.foreachStream()
.when({
    'InboxAdded': function(state, ev) {
        return ev.data;
    }
});
```

## Commits posted to an `inboxCommits-:inboxId` stream

At this point, VCS systems, like GitHub, can send commit messages to CommitStream, and CommitStream will post them into a stream named after the `inboxId`. Because each `InboxAdded` event contains the `digestId` for the parent `digest`, when CommitStream creates a `GitHubCommitReceived` event, it enriches this event with the `digestId` inside the `metadata` of the EventStore event. This results in events within an inbox's stream that look like this:

```json
Data
{
  "sha": "b42c285e1506edac965g92573a2121700fc92f8b",
  "commit": {
    "author": {
      "name": "shawnmarie",
      "email": "shawn.abbott@versionone.com",
      "username": "shawnmarie"
    },
    "committer": {
      "name": "shawnmarie",
      "email": "shawn.abbott@versionone.com",
      "date": "2014-10-03T14:57:14-04:00"
    },
    "message": "S-11111 Updated Happy Path Validations!"
  } "committer": {
      "name": "shawnmarie",
      "email": "shawn.abbott@versionone.com",
      "username": "shawnmarie"
    },
    "added": [],
    "removed": [],
    "modified": [
      "README.md"
    ]
  }
}
				
Metdata
{
  "digestId": "a62d2e19-895d-4ce5-a0c5-e61157e7a9f2"
}
```

## partionate-with-or-without-mention

Now that commits exist within one or more streams inside the category of `inboxCommits-`, another critical projection can observe these commits and produce virtual streams needed by the next downstream projection. This first one simply divides commits into two streams, one for commits that have a message matching the VersionOne workitem mention pattern, and one for those that do not:

```javascript
var matchAsset = function(message) {
  var re = new RegExp("[A-Z,a-z]{1,2}-[0-9]+", "");
  var matches = message.match(re);
  if (matches && 0 < matches.length)
    return true;
  else
    return false;
};
var callback = function(state, ev) {
  if (!(ev.data && ev.data.commit && ev.data.commit.message)) {
    emit("inboxCommits-error", "missingCommitOrMessageFound", ev.data);
  } else if (matchAsset(ev.data.commit.message)) {
    linkTo('mention-with', ev);
  } else {
    linkTo('mention-without', ev);
  }
};

fromCategory('inboxCommits')
  .whenAny(callback);
```

## by-asset

This projection observes the `mention-with` virtual stream populated by the previous projection and links out to 1 - N virtual streams for matched mentions. For example, if a commit message contains: 

> Modified the router to fix broken response body for creating inboxes
> S-11233 D-12899 AT-09331

Then, this commit message will appear in streams named `asset-S-11233`, `asset-D-12899`, and `AT-09331`.

```javascript
var getAssets = function (message) {
    var re = new RegExp("[A-Z,a-z]{1,2}-[0-9]+", "g");
    var matches = message.match(re);
    return matches;
}

var callback = function (state, ev) {
    var assets = getAssets(ev.data.commit.message);
    assets.forEach(function(asset) {
    	asset = asset.toUpperCase();
    	linkTo('asset-' + asset, ev);
    });
};

fromStream('mention-with')
     .whenAny(callback);
```



## inboxCommits-to-digestCommits

In order to aggregate commits made to individual `inboxes` up the higher level of `digest`, there is one more projection which utilizes the `metadata` to facilitate this, linking every commit across the entire category of `inboxCommits` into the rightful `digestCommits-:digestId` virtual stream:

```javascript
var callback = function(state, event) {
  if (event.metadata && event.metadata.digestId) {
    linkTo('digestCommits-' + event.metadata.digestId, event);
  }
};

fromCategory('inboxCommits').when({
  '$any': callback
});
```

## digestInbox

We also need a stream to represent the relationship between a `digest` and its child `inboxes`. This stream listens to the `inboxes` stream and links each `InboxAdded` to a virtual stream named `digesstInbox-:digestId` to achieve this:

```javascript
var callback = function(state, ev) {
  linkTo('digestInbox-' + ev.data.digestId, ev);
};

fromStream('inboxes').when({
  'InboxAdded': function(state, ev) {
    callback(state, ev);
  }
});
```

## inboxes-for-digest

Lastly, in order to query for the total number of inboxes that belong to a given digest, we have a state-keeping projection that updates a state object per `digestId` that observes the `digestInbox` category like so:

```javascript
fromCategory('digestInbox')
.foreachStream()
.when({
  '$init': function (state, ev) {
    return { inboxes: {} }
  },
  'InboxAdded': function (state, ev) {
    state.inboxes[ev.data.inboxId] = ev.data;
  }
});
```

Similar to other stateful projections, this lets us query for all the `inboxes` that belong to a `digest` by hitting `/projection/inboxes-for-digest/state?partition=digestInbox-:digestId`.