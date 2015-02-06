var matchAsset = function(message) {
  var re = new RegExp("[A-Z,a-z]{1,2}-[0-9]+", "");
  var matches = message.match(re);
  if (matches && 0 < matches.length)
    return true;
  else
    return false;
};
var callback = function(state, ev) {
  if (!(ev.data && ev.data.commit && ev.data.commit.message)) {
    emit("github-events-error", "missingCommitOrMessageFound", ev.data);
  } else if (matchAsset(ev.data.commit.message)) {
    linkTo('mention-with', ev);
  } else {
    linkTo('mention-without', ev);
  }
};

fromCategory('inboxCommits')
  .whenAny(callback);