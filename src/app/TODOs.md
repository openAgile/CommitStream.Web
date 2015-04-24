# Things to clean up

## Quick fixes
* in commitsGet.js, validate inputs or assert on them

## Smallish
* digestCommitsGet, instanceCommitsGet: revisit HAL approach for these responses

## Bigger
* Handle ***UNKNOWN*** from EventStore
* Unit test micro-modules

## DONE
* MH:DONE Update UI to incorporate instanceId and new RESTful routes for digestCommitsGet and instanceCommitsGet
* MK:DONE Replace empty objs with spy in tests
* JG:DONE Update Hypermedia URIs for restful /commits
* MK:DONE instanceCommitsGet: throw a proper validation error after validating workitems/:workitems parameter
* JG:DONE handlers: Figure out how to test setTimeout or a equivalent approach
* MK:DONE pager.js: next link from eventstore, use _ to find it, not just use 3rd position
* JG:DONE in digestInboxesGet, catch a specific error when reading a projection, not all errors to return empty result

