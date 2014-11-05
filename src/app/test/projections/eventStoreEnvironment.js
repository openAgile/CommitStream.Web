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