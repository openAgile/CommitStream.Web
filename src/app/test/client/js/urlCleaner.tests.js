require('../../../client/js/urlCleaner');

describe('cleanUrl', function() {
    it('passing a url with < or > in it will remove those characters', function() {
        var urlWithAngleBrackets = 'https://google.com><script>alert("pwned!")</script><a+';
        var expectedUrl = 'https://google.comscriptalert("pwned!")/scripta+';
        commitStreamUrlCleaner.clean(urlWithAngleBrackets).should.equal(expectedUrl);
    });

    it('passing a url with the word javascript in it will remove that word', function() {
        var executableJavascriptUrl = 'javascript:alert("pwned")';
        var expectedUrl = ':alert("pwned")';
        commitStreamUrlCleaner.clean(executableJavascriptUrl).should.equal(expectedUrl);
    });

    it('passing a simple example of a url should result in the same value', function() {
        var simpleUrlExample = 'http://google.com';
        commitStreamUrlCleaner.clean(simpleUrlExample).should.equal(simpleUrlExample);
    })
});