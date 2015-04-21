(function() {
  module.exports = function(headers) {
    if (!headers.hasOwnProperty('x-github-event')) {
      throw new Error('The "x-github-event" header was not present.');
    }
    var eventType = headers['x-github-event'];
    if (eventType !== 'push' && eventType !== 'ping') {
      throw new Error('The x-github-event was not a valid one.');
    }
    return eventType;
  };
}());