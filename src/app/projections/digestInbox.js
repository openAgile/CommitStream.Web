var callback = function(state, ev) {
  linkTo('digestInbox-' + ev.data.digestId, ev);
};

fromStream('inboxes').when({
  'InboxAdded': function(state, ev) {
    callback(state, ev);
  }
});