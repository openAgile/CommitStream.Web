var assert = require('assert'),
    eventStoreEvnironment = require('./eventStoreEnvironment.js');

describe('projection by-asset', function () {
    var sampleData = require('./sampleData');
    setEvents(sampleData.byAsset);
    require('../../projections/by-asset.js');
    it('should have an stream with 2 events for the asset S-47665', function(done) {
        assert.equal(getStream('asset-S-47665').length, 2);
        done();
    });
    it('should have an stream with 1 event for the asset S-99999 ', function (done) {
        assert.equal(getStream('asset-S-99999').length, 1);
        done();
    });
});