var chai =                      require('chai'),
    should =                    chai.should(),
    getFamilySpecificSha =      require('../../../api/translators/getFamilySpecificSha'),
    VcsFamilySpecificShaTable = require('../../../api/translators/getFamilySpecificSha'),
    vcsFamilies =               require('../../../api/helpers/vcsFamilies');

var mockSha = "1234567890";


describe('getFamilySpecificSha', function() {

    describe('Given an non-existing family', function () {

        var actual;

        beforeEach(function () {
            actual = getFamilySpecificSha("BROKEN",mockSha);
        });

        it('returns a sha with default length of 7', function () {
            actual.length.should.equal(7);
            actual.should.equal(actual.substring(0,7));
        });
    });

    describe('there is a default length for Perforce', function () {

        var actual;

        beforeEach(function () {
            actual = getFamilySpecificSha(vcsFamilies.P4V,mockSha);
        });

        it('that returns a sha with a length of 7', function () {
            actual.length.should.equal(7);
        });

       /* it('something else is cool', function () {
            //dunno
        });*/
    });

    describe('there is a length n for SVN', function () {
        var actual;

        beforeEach(function () {
            actual = getFamilySpecificSha(vcsFamilies.Svn,mockSha);

        });

        // actual = getFamilySpecificSha(family, sha);

        it('that returns the original sha ', function () {
       //     actual.length.should.equal(mockSha);
           // actual.should.equal(mockSha);
        });
    });
    describe('there is a default length for VsoGit', function () {

        var actual;

        beforeEach(function () {
            actual = getFamilySpecificSha(vcsFamilies.VsoGit,mockSha);
        });

        it('that returns a sha with a length of 8', function () {
            //actual.length.should.equal(VcsFamilySpecificShaTable[]);
            actual.length.should.equal(8);
            console.log(VcsFamilySpecificShaTable);
        });
    });

    // describe('there is a specific, non-default length for Perforce', function () {
    //
    //     before(function () {
    //
    //     });
    //
    //     // actual = getFamilySpecificSha(family, sha);
    //
    //     it('that returns a sha with a length of 7', function () {
    //         //dunno
    //     });
    // });

});