# Things to clean up

## Smallish
* digestCommitsGet, instanceCommitsGet: revisit HAL approach for these responses
* We should have a smoke test that excercises this line from digestsFormatAsHal.js

  response._embedded.digests.push(createDigestHyperMediaResult(digest.content.data));

  The need for this is because digest.content.data. That digest object is what we get back from eventstore, and it's structure has changed in the past when we upgraded eventstore.

* In digestsGet.tests.js, revisit this comment

  describe('when there are no digests', function() {
    //TODO: find out how to test this
  });

## Bigger
* Handle ***UNKNOWN*** from EventStore
* Unit test micro-modules

## DONE
* MH: Update UI to incorporate instanceId and new RESTful routes for digestCommitsGet and instanceCommitsGet
* MK: Replace empty objs with spy in tests
* JG: Update Hypermedia URIs for restful /commits
* MK: instanceCommitsGet: throw a proper validation error after validating workitems/:workitems parameter
* JG: handlers: Figure out how to test setTimeout or a equivalent approach
* MK: pager.js: next link from eventstore, use _ to find it, not just use 3rd position
* JG: in digestInboxesGet, catch a specific error when reading a projection, not all errors to return empty result
* MH: in commitsGet.js, validate inputs or assert on them
* MK: See if we can just replace the code in instanceGet with `res.hal(instanceFormatAsHal(req.instance))` instead of all that extra code.

