var assert = require('assert');
describe('Partitioner', function () {
    
    before(function () {
        global.streamResult = [];
        global.events = [];
        
        global.setEvents = function (events) {
            global.events = events;
        };
        global.getEvents = function () {
            return global.events;
        };
        global.getStream = function (name) {
            return streamResult[name];
        };
        global.fromStream = function (streamSource) {
            return {
                whenAny: function (callback) {
                    getEvents().forEach(function (element) {
                        callback(null, element);
                    });
                }
            }
        };
        global.linkTo = function (name, value) {
            if (streamResult[name])
                streamResult[name].push(value);
            else {
                streamResult[name] = [value];
            }
        };
    });
    
    var commitEvent = [
            {
        data: {
            commit: {
                message: "S-47665 Take location.search.substring(1) to remove ?"
            }
        }
    },
            {
        data: {
            commit: {
                message: "S-99999 Take location.search.substring(1) to remove ?"
            }
        }
    },
            {
        data: {
            commit: {
                message: "Take location.search.substring(1) to remove ?"
            }
        }
    }
        ];
    
    it('shuld split event into the proper stream', function (done) {
        setEvents(commitEvent);
        var partitioner = require('../../projections/partitionate-with-or-without-mention.js');
        assert.equal(getStream('mention-with').length, 2);
        assert.equal(getStream('mention-without').length, 1);
        done();
    });

        //it('should find a match asset in the commit message', function(done) {
        //    assert.equal(partitioner.matchAsset(commitEvent[0].data.commit.message), true);
        //    done();
        //});
        //it('should not find a match asset in the commit message', function (done) {
        //    assert.equal(partitioner.matchAsset(commitEvent[1].data.commit.message), false);
        //    done();
        //});
});