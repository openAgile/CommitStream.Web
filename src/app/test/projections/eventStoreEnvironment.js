global.streamResult = [];
global.events = [];

global.setEvents = function(events) {
    global.events = events;
};

global.getEvents = function() {
    return global.events;
};

global.getEventsByType = function(eventType) {
    var events = [];
    getEvents().forEach(function(evt) {
        if (evt.eventType && evt.eventType === eventType) {
            events.push(evt);
        }
    });
    return events;
};

global.getStream = function(name) {
    return streamResult[name];
};

global.getStreamsInCategoryCount = function(category) {
    var streamsInCategory = [];
    for (var streamName in streamResult) {
        if (streamName.indexOf(category) === 0) streamsInCategory.push(streamName);
    }
    return streamsInCategory.length;
};


global.fromStream = function(streamSource) {
    return {
        when: function(eventSpec) {
            for (var eventType in eventSpec) {
                if (eventType === '$any') {
                    var callback = eventSpec[eventType];
                    getEvents().forEach(function(element) {
                        callback(null, element);
                    });
                }
                else {
                    var callback = eventSpec[eventType];
                    var evts = getEventsByType(eventType);
                    evts.forEach(function(evt) {
                        callback(null, evt);
                    });
                }
            }
        }
    }
};
global.fromCategory = global.fromStream; // These fakes do the same thing!


global.linkTo = function(name, value) {
    if (streamResult[name])
        streamResult[name].push(value);
    else {
        streamResult[name] = [value];
    }
};

global.emit = function(name, type, value) {
    if (streamResult[name])
        streamResult[name].push(value);
    else {
        streamResult[name] = [value];
    }
};