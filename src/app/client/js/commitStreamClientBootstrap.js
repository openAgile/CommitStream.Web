(function() {
    $(function() {
        function getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) == variable) {
                    return decodeURIComponent(pair[1]);
                }
            }
            return null;
        }

        function createSafeOrEmptyURL(url){
            if(isValidUrl(url))
                return url;
            return '';
        }

        function handleError(data, status) {
            $('#commits').html('<div class="commitStream-panel"><div class="stream-title-area"><h3>Error Contacting CommitStream</h3>Please try again.</h3></div></div>');
        }

        var apiKey = getQueryVariable('apiKey');

        if (!apiKey) {
            alert('Must specify API key in the form of apiKey=<apikey> as a query string parameter');
        }

        var digestId = getQueryVariable('digestId');
        var instanceId = getQueryVariable('instanceId');
        var workitem = getQueryVariable('workitem');
        var mentionDetailUrl = getQueryVariable('mentionDetailUrlTemplate');
        var mentionDetailSafeURL = createSafeOrEmptyURL(mentionDetailUrl);

        $.getScript('app',
            function(data, status, jqxhr) {
                CommitStream.commitsDisplay(
                    '#commits',
                    workitem,
                    handleError,
                    digestId,
                    instanceId,
                    apiKey,
                    undefined,
                    mentionDetailSafeURL);
            }
        );
    });
})();