commitStreamUrlCleaner = (function(){

    function removeAngleBrackets(url) {
        return url.replace(/>|</g, '');
    }

    function removeJavaScriptTag(url) {
        return url.replace(/javascript/g, '');
    }

    return {
        clean: function (url) {
            var cleanedUrl;
            cleanedUrl = removeAngleBrackets(url);
            cleanedUrl = removeJavaScriptTag(cleanedUrl);
            return cleanedUrl;
        }
    }
}())