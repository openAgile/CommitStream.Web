# ChildWorkitem Rollup Query Load Test

## Goals

* Validate that M number of unique users can concurrently query N number of unique CS instances for X number of unique parent and child workitems.
  *  M: TODO
  *  N: TODO
  *  X: TODO
* Capture the average time that it takes to return the results
* Determine if there is a breaking point within EventStore for handling concurrent dynamic queries

## Background Data

* Analyze current usage data from log files

## Approach


* Execute scripts to create the N number of unique CS instances
* Capture the instanceId and apiKey into a JSON file
* Be able to execute with variable number of Concurrent users querying
* Execute the test 3 separate times, with batches of 100, 1000, and 10000 mentions distributed evenly across the X unique workitem matches
* Create a digest to house the commits
* Create 10 unique inboxes (Github format only is OK, or should we randmoly involve Bitbucket and Gitlab too?)
* POST commits into these inboxes
* Perform the query tests, and capture metrics

## Data Format

```javascript
[
    "https://v1cs-dev-test.azurewebsites.net/api/${instanceId}/commits/tags/versionone/workitems/S-01001,TK-01001,TK-01002,TK-01003,TK-10004,AT-01001,AT-01002,AT-01003,AT-01004,AT-01005?apiKey=${apiKey}",
    "etc..."
]
```