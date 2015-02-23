# Background info

Given a Customer ID: VersionOne-suhefuishf8y324342423
and an InstanceId: qwer12345
and an Instance URL: https://www7.v1host.com/v1production

Then, API routes now need to take the InstanceId into account, like:

`/api/qwer12345/etc...`

# Current routes:

* GET `/api/digests`
* GET `/api/digests/:digestId`
* GET `/api/digests/:digestId/inboxes`
* POST `/api/inboxes`
* GET `/api/inboxes/:uuid`
* POST `/api/inboxes/:uuid/commits`
* GET `/api/query`
* POST `/api/importHistory` <- Invalidated by inboxes and digests

# Changes needed to routes to incorporate InstanceId

GET `/api/:instanceId/digests` : List all digests for this instance

POST `/api/:instanceId/digests` : Create a new digest

GET `/api/:instanceId/digests/:digestId` : Get details for a digest

GET `/api/:instanceId/digests/:digestId/commits` : Get all commits associated with a digest (Replaces `/api/query?digestId=:digestId&workitem=ALL`)

POST `/api/:instanceId/digests/:digestId/inboxes` : Create a new inbox for a digest (Replaces POST `/api/inboxes` where the client is required to feed the digestId as a JSON parameter)

GET `/api/:instanceId/digests/:digestId/inboxes` : List all inboxes associated with a digest

GET `/api/:instanceId/inboxes/:uuid` : Get details for an inbox

POST `/api/:instanceId/inboxes/:uuid/commits` : Post commit messages to an inbox

GET `/api/:instanceId/inboxes/:uuid/commits` : Get all commits associated with an inbox (New idea)

TODO: refine route and domain concepts below

GET `/api/:instanceId/commits/tags/:tagValue`: Get all commits matching a given tag value (Replaces `/api/query?workitem=:workitem`)
	Example: GET `/api/qwer12345/commits?tags=S-12345`, : This will be used by the Workitem sidebar panel to fetch commits "tagged" with a particular workitem mention pattern

Blue Sky:

Customers have asked to be able to get roll up of a story and its child items in the workitem sidepanel.

Given a story with number S-12345, VersionOne can query for its child items and then post a query to CommitStream, something like:

POST /api/:instanceId/commits/query?tags=S-12345,T-00001,T-00002,AT-00001,AT-00002,D-00009,D-00010
	- Redirect to query URL





