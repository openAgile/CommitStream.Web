var assert = require('assert'),
    eventStoreEvnironment = require('./eventStoreEnvironment.js');

describe('projection digests-by-id', function () {
    var data = require('./digests');
    setEvents(data.digests);
    require('../../projections/digests-by-id');
    it('should partition into two streams', function(done) {
        assert.equal(2, getStreamsInCategoryCount('digest-'));
        done();
    });
    
    describe('stream digest-79f1da56-0ee3-4c6d-bed4-9380790e3475', function() {
        var stream = getStream('digest-79f1da56-0ee3-4c6d-bed4-9380790e3475');
        
        it('should have a stream named digest-79f1da56-0ee3-4c6d-bed4-9380790e3475 with 1 event', function (done) {
            assert.equal(stream.length, 1);
            done();
        });

        describe('the stream\'s event', function() {
            it('should have eventType of DigestAdded', function(done) {
                assert.equal(stream[0].eventType, 'DigestAdded');
                done();
            });
            it('should have data.description about BalZac Brat', function(done) {
                assert.equal(stream[0].data.description, 'This is my little buddy the BalZac Brat');
                done();
            });            
        });
    });

    describe('stream digest-a5163027-892f-4fa3-ac66-ba39af9cf727', function() {
        var stream = getStream('digest-a5163027-892f-4fa3-ac66-ba39af9cf727');
        
        it('should have a stream named digest-a5163027-892f-4fa3-ac66-ba39af9cf727 with 1 event', function (done) {
            assert.equal(stream.length, 1);
            done();
        });
        
        describe('the stream\'s event', function() {
            it('should have eventType of DigestAdded', function(done) {
                assert.equal(stream[0].eventType, 'DigestAdded');
                done();
            });
            it('should have data.description about BalZac YouTube video', function(done) {
                assert.equal(stream[0].data.description, 'Turn up the fun with BalZac (https://www.youtube.com/watch?v=iIBP0Mn5jq0)');
                done();
            });            
        });
    });
});