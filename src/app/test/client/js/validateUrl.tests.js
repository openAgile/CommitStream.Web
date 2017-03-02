require('../../../client/js/validateUrl');

var chai = require('chai'),
    should = chai.should();

describe('validateUrl', function() {
    it('passing valid url should say it is valid', function() {
        commitStreamUrlValidator.isValidUrl('http://google.com').should.be.true;
    });

    it('passing url with executable script should say it is not valid', function() {
        var urlWithScript = 'https://google.com><script>alert("pwned!")</script><a+';
        commitStreamUrlValidator.isValidUrl(urlWithScript).should.be.false;
    });

    it('passing url with executable javascript url should say it is not valid', function() {
        var executableJavascriptUrl = 'javascript:alert("pwned")';
        commitStreamUrlValidator.isValidUrl(executableJavascriptUrl).should.be.false;
    });
});