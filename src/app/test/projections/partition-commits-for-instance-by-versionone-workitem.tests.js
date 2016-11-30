var assert = require('assert'),
  eventStoreEnvironment = require('./eventStoreEnvironment.js');

describe('projection to partitioner', function() {
  var sampleData = require('./sampleData');
  setEvents(sampleData.byMentions);
  var partitioner = require('../../projections/partition-commits-for-instance-by-versionone-workitem.js');
  it('should have 1 events for the stream versionOne_CommitsWithWorkitems-id_S-47665 which has 2 mentions ', function(done) {
    assert.equal(getStream('versionOne_CommitsWithWorkitems-id_S-47665').length, 1);
    done();
  });
  it('should have 1 events for the stream versionOne_CommitsWithWorkitems-id_S-47664 which has 1 mention ', function(done) {
    assert.equal(getStream('versionOne_CommitsWithWorkitems-id_S-47664').length, 1);
    done();
  });
});