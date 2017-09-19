var getAssets = function (message) {
    var re = new RegExp("[A-Z,a-z]{1,2}-[0-9]+", "g");
    var matches = message.match(re);
    return matches;
}

var callback = function (state, ev) {
    var assets = getAssets(ev.data.commit.message);
    assets.forEach(function(asset) {
    	asset = asset.toUpperCase();
    	linkTo('asset-' + asset, ev);
    });
};

fromStream('mention-with').when({
   '$any' : callback
});
