var assert = require('assert'),
    eventStoreEvnironment = require('./eventStoreEnvironment.js');

var verifyAllMatch  = function(asset) {
    var result = true;
    getStream('asset-' + asset).forEach(function(event) {
        if (!(event.data.commit.message.toUpperCase().indexOf(asset) > -1)) {
            return result = false;
        }
    });
    return result;
};

describe('projection by-asset', function () {
    var sampleData = require('./sampleData');
    setEvents(sampleData.byAsset);
    require('../../projections/by-asset.js');
    // S-47665
    it('should have an stream with 2 events for the asset S-47665', function (done) {
        assert.equal(getStream('asset-S-47665').length, 2);
        done();
    });    
    it('all events for asset-S-47665 should contain S-47665', function (done) {
        var result = verifyAllMatch ('S-47665');
        assert.equal(result, true);
        done();
    });

    /// S-99999
    it('should have an stream with 1 event for the asset S-99999 ', function (done) {
        assert.equal(getStream('asset-S-99999').length, 1);
        done();
    });
    it('all events for asset-S-99999 should contain S-99999', function (done) {
        var result = verifyAllMatch ('S-99999');
        assert.equal(result, true);
        done();
    });

    // 12345
    it('should have an stream with 1 event for the asset S-12345 ', function (done) {
        assert.equal(getStream('asset-S-12345').length, 1);
        done();
    });
    it('all events for asset-S-12345 should contain S-12345', function (done) {
        var result = verifyAllMatch ('S-12345');
        assert.equal(result, true);
        done();
    });

    // 98765
    it('should have an stream with 1 event for the asset S-98765 ', function (done) {
        assert.equal(getStream('asset-S-98765').length, 1);
        done();
    });
    it('all events for asset-S-98765 should contain S-98765', function (done) {
        var result = verifyAllMatch ('S-98765');
        assert.equal(result, true);
        done();
    });

    // 19285
    it('should have an stream with 1 event for the asset S-19285 ', function (done) {
        assert.equal(getStream('asset-S-19285').length, 1);
        done();
    });
    it('all events for asset-S-19285 should contain S-19285', function (done) {
        var result = verifyAllMatch ('S-19285');
        assert.equal(result, true);
        done();
    });
});