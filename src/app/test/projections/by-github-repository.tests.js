var assert = require('assert'),
    eventStoreEvnironment = require('./eventStoreEnvironment.js');

describe('projection by-repository', function () {
    var sampleData = require('./sampleData');
    setEvents(sampleData.byRepo);
    require('../../projections/by-github-repository.js');
    it('should have an stream with 2 events for the repo MatiasHeffel-EventStore-CommitMentions', function (done) {
        assert.equal(getStream('repo-MatiasHeffel-EventStore-CommitMentions').length, 2);
        done();
    });
    it('should have an stream with 1 event for the repo KunziMariano-EventStore-Demo', function (done) {
        assert.equal(getStream('repo-KunziMariano-EventStore-Demo').length, 1);
        done();
    });
    it('should have an stream with 1 event for the repo KunziMariano-Anhoter-Demo', function (done) {
        assert.equal(getStream('repo-KunziMariano-Anhoter-Demo').length, 1);
        done();
    });
    it('should have 2 events corrupted for the error stream', function (done) {
        assert.equal(getStream('repo-error').length, 2);
        done();
    });
});