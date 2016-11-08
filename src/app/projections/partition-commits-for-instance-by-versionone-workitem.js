var getWorkitems = function(message) {
  var re = new RegExp("[A-Z,a-z]{1,2}-[0-9]+", "g");
  var matches = message.match(re);
  return matches;
}

var callback = function(state, ev) {
  if (ev.eventType[0] != '$' && ev.metadata && ev.metadata.instanceId 
      && ev.data && ev.data.commit && ev.data.commit.message) {
    var workItems = getWorkitems(ev.data.commit.message);
    var workItems = getWorkitems(ev.data.commit.message);
    var withOutDuplicates = workItems.filter(function (i, p) {
      return workItems.indexOf(i) == p;
    });
    withOutDuplicates.forEach(function(workItem) {
      workItem = workItem.toUpperCase();
      linkTo('versionOne_CommitsWithWorkitems-' + ev.metadata.instanceId + '_' + workItem, ev);
    });
  }
};

fromCategory('versionOne_CommitsWithWorkitemMention')
  .whenAny(callback);