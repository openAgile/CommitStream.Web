var assert = require('assert'),
  eventStoreEnvironment = require('./eventStoreEnvironment.js');

describe('projection to partitioner', function() {
  var sampleData = require('./sampleData');
  setEvents(sampleData.toBePartitioned);
  var partitioner = require('../../projections/partition-commits-for-instance-by-versionone-with-or-without-workitem.js');
  it('should have 2 events for the stream mention-with ', function(done) {
    assert.equal(getStream('versionOne_CommitsWithWorkitemMention-someId').length, 3);
    done();
  });
  it('should have  1 events for the stream mention-without', function(done) {
    assert.equal(getStream('versionOne_CommitsWithoutWorkitemMention-someId').length, 1);
    done();
  });
  it('should have 3 events corrupted for the error stream', function(done) {
    assert.equal(getStream('inboxCommitsError-someId').length, 3);
    done();
  });
});