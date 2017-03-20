var chai = require('chai'),
  should = chai.should(),
  proxyquire = require('proxyquire');

var tfvcUiTranslator = proxyquire('../../../../api/translators/uiDecorators/tfvcUiDecorator', {});

describe('tfvcUiTranslator', function() {

  it('it should say it should decorate a TFVC family', function() {
    tfvcUiTranslator.shouldDecorate('Tfvc').should.equal(true);
  });

  describe('when decorating the commit', function () {
    var decoratedCommit;
    var commitToDecorate = {
      commitDate: 'Mon Mar 20 2017 09:52:09 GMT-0400',
      timeFormatted: '3 Hours Ago',
      author: 'Sally Ann Cavanaugh',
      sha1Partial: 'abcxyz',
      family: 'Tfvc',
      action: 'committed',
      message: 'Sally Ann Cavanaugh checked in changeset 22',
      commitHref: [ "https://testsystem.visualstudio.com/70cf8e3a-3ee1-4127-95d2-7f2563e5dc9e/_versionControl/changeset/22",
        "https://testsystem.visualstudio.com/fdc49ee6-ec19-43a4-bd08-55800484b342/_versionControl/changeset/22"],
      repo: '',
      branch: '',
      branchHref: '',
      repoHref: ["https://testsystem.visualstudio.com/70cf8e3a-3ee1-4127-95d2-7f2563e5dc9e/_versionControl/",
        "https://testsystem.visualstudio.com/fdc49ee6-ec19-43a4-bd08-55800484b342/_versionControl/"],
      isCommitHref: true,
      isTfvc: false
    };

    var expectedDecoratedCommit = {
      commitDate: 'Mon Mar 20 2017 09:52:09 GMT-0400',
      timeFormatted: '3 Hours Ago',
      author: 'Sally Ann Cavanaugh',
      sha1Partial: 'abcxyz',
      family: 'Tfvc',
      action: 'committed',
      message: 'Sally Ann Cavanaugh checked in changeset 22',
      commitHref: [ "https://testsystem.visualstudio.com/70cf8e3a-3ee1-4127-95d2-7f2563e5dc9e/_versionControl/changeset/22",
        "https://testsystem.visualstudio.com/fdc49ee6-ec19-43a4-bd08-55800484b342/_versionControl/changeset/22"],
      repo: '',
      branch: '',
      branchHref: '',
      repoHref: ["https://testsystem.visualstudio.com/70cf8e3a-3ee1-4127-95d2-7f2563e5dc9e/_versionControl/",
        "https://testsystem.visualstudio.com/fdc49ee6-ec19-43a4-bd08-55800484b342/_versionControl/"],
      isCommitHref: true,
      isTfvc: true
    };

    before(function() {
      decoratedCommit = tfvcUiTranslator.decorateUIResponse(commitToDecorate);
    })

    it('it should mark the commit as a TFVC commit', function() {
      decoratedCommit.should.deep.equal(expectedDecoratedCommit);
    })
  });

});