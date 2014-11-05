var assert = require('assert'),
    eventStoreEvnironment = require('./eventStoreEnvironment.js');

var checkIntoStream = function(asset) {
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
    it('should have an stream with 2 events for the asset S-47665', function (done) {
        assert.equal(getStream('asset-S-47665').length, 2);
        done();
    });
    it('sould contain only mentions for the asset S-47665', function (done) {
        var result = checkIntoStream('S-47665');
        assert.equal(result, true);
        done();
    });
    it('should have an stream with 1 event for the asset S-99999 ', function (done) {
        assert.equal(getStream('asset-S-99999').length, 1);
        done();
    });
    it('sould contain only mentions for the asset S-99999', function (done) {
        var result = checkIntoStream('S-99999');
        assert.equal(result, true);
        done();
    });
});