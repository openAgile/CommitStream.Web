var getAsset = function (message) {
    var re = new RegExp("[A-Z,a-z]{1,2}-[0-9]+", "");
    var matches = message.match(re);
    return matches[0];
}

var callback = function (state, ev) {
    var asset = getAsset(ev.data.commit.message).toUpperCase();
    linkTo('asset-' + asset, ev);
};

fromStream('mention-with')
     .whenAny(callback);