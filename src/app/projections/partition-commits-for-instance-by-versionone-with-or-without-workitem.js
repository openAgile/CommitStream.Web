var matchWorkitem = function(message) {
  var re = new RegExp("[A-Z,a-z]{1,2}-[0-9]+", "");
  var matches = message.match(re);
  return matches && 0 < matches.length;
};

var callback = function(state, ev) {
  if (!(ev.data && ev.data.commit && ev.data.commit.message)) {
    emit("inboxCommitsError-" + ev.metadata.inboxId, "missingCommitOrMessageFound", ev.data);
  } else if (matchWorkitem(ev.data.commit.message)) {
    linkTo('versionOne_CommitsWithWorkitemMention-' + ev.metadata.inboxId, ev);
  } else {
    linkTo('versionOne_CommitsWithoutWorkitemMention-' + ev.metadata.inboxId, ev);
  }
};

fromCategory('inboxCommits').when({
   '$any' : callback
});
