var callback = function(state, event) {
  if (event.metadata && event.metadata.digestId) {
    linkTo('digestCommits-' + event.metadata.digestId, event);
  }
};

fromCategory('inboxCommits').when({
  '$any': callback
});