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

* Modify the middleware [../../src/app/apikey.js](apikey.js) which performs the config check to query EventStore (or some other credential cache) to match the key against the instance. This likely will mean that a stateful projection at `instance-qwer` returns a state like:
```json
{
	"instanceId": "qwer",
	"apiKey": "abcde09876"
}
```
* The ACL for the projection `instance-qwer` should be readable only by system admins
Note that if we need to support the ability to modify the apiKey for a given instance, then this stateful projection should update its state in accordance. This would be the case when a customer loses control of a repository, an employee becomes disgruntled who has access to some repositories, or other security reasons.
* Create an internal EventStore user per instance that has the same password as the apiKey and is used by the `eventstore-client` instance when communicating with EventStore.
  * ACLs for all streams created by this user should be limited to this user and $admins

# Projection Design


