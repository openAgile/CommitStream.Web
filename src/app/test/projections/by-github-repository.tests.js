var assert = require('assert'),
    eventStoreEvnironment = require('./eventStoreEnvironment.js');
var verifyAllMatch = function (repo) {
    var repo2 = repo.replace(/-/, "/");
    var result = true;
    getStream('repo-' + repo).forEach(function (event) {
        if (!(event.data.html_url.indexOf(repo2) > -1)) {
            return result = false;
        }
    });
    return result;
};

describe('projection by-repository', function () {
    var sampleData = require('./sampleData');
    setEvents(sampleData.byRepo);
    require('../../projections/by-github-repository.js');
    it('should have an stream with 2 events for the repo MatiasHeffel-EventStore-CommitMentions', function (done) {
        assert.equal(getStream('repo-MatiasHeffel-EventStore-CommitMentions').length, 2);
        done();
    });
    it('sould contain only links for the repo MatiasHeffel/EventStore-CommitMentions', function (done) {
        var result = verifyAllMatch('MatiasHeffel-EventStore-CommitMentions');
        assert.equal(result, true);
        done();
    });
    it('should have an stream with 1 event for the repo KunziMariano-EventStore-Demo', function (done) {
        assert.equal(getStream('repo-KunziMariano-EventStore-Demo').length, 1);
        done();
    });
    it('sould contain only links for the repo KunziMariano/EventStore-Demo', function (done) {
        var result = verifyAllMatch('KunziMariano-EventStore-Demo');
        assert.equal(result, true);
        done();
    });    
    it('should have an stream with 1 event for the repo KunziMariano-Anhoter-Demo', function (done) {
        assert.equal(getStream('repo-KunziMariano-Anhoter-Demo').length, 1);
        done();
    });
    it('sould contain only links for the repo KunziMariano/Anhoter-Demo', function (done) {
        var result = verifyAllMatch('KunziMariano-Anhoter-Demo');
        assert.equal(result, true);
        done();
    });    
    it('should have 2 events corrupted for the error stream', function (done) {
        assert.equal(getStream('github-repository-error').length, 2);
        done();
    });
});