var chai = require('chai'),
  should = chai.should(),
  proxyquire = require('proxyquire');

var tfvcUiTranslator = proxyquire('../../../../api/translators/uiDecorators/tfvcUiDecorator', {});

describe('tfvcUiTranslator', function() {
  it('it should say it should decorate a TFVC family', function() {
    tfvcUiTranslator.shouldDecorate('Tfvc').should.equal(true);
  });
});