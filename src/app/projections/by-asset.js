 var getAsset = function (message) {
    var re = new RegExp("[A-Z]{1,2}-[0-9]+", "");
    var matches = message.match(re);
     return matches[0];
 }


fromStream('mention-with')
.whenAny(function (state, ev) {
    var asset = getAsset(ev.data.commit.message);
    linkTo('asset-' + asset, ev);
});