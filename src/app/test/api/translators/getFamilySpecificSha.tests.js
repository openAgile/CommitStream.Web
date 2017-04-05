/*We have 3 types of families { {Default}, {Indentity}, {Specific} }

 1)	Default - Families that display a sha of default length.  All families inherit this length until explicitly added to getFamilySpecificSha:VcsFamilySpecificShaTable
 2)	Identity -Families that display a sha of a fixed length. This is a reflection of the whatever the length of the sha, commit id is in the vendor vcs.
 3)	Fixed - Families that display a sha of specified length.  This is a specified length different from the Default length

 Indentity and Specific families are added to getFamilySpecificSha:VcsFamilySpecificShaTable manually as new vcses are created.
 */

var chai =                            require('chai'),
    should =                          chai.should(),
    getFamilySpecificSha =            require('../../../api/translators/getFamilySpecificSha'),
    vcsFamilies =                     require('../../../api/helpers/vcsFamilies');

var mockSha = "1234567890";




//Explicit Family Testing
describe('getFamilySpecificSha', function() {
    describe('Given an non-existing family VCS', function () {
        var actual;

        beforeEach(function () {
            actual = getFamilySpecificSha("BROKEN",mockSha);
        });

        it('returns a sha with default length of 7', function () {
            actual.length.should.equal(7);
        });
        it('returns a sha with equal value of original broken sha', function () {
            actual.should.equal(actual.substring(0,7));
        });
    });

    describe('Given the Default family, VCS is Perforce', function () {

        var actual;

        beforeEach(function () {
            actual = getFamilySpecificSha(vcsFamilies.P4V,mockSha);
        });

        it('that returns a default sha with a length of 7', function () {
            actual.length.should.equal(7);
        });

    });

    describe('Given the Indentity family VCS is SVN', function () {
        var actual;

        beforeEach(function () {
            actual = getFamilySpecificSha(vcsFamilies.Svn,mockSha);

        });

        // actual = getFamilySpecificSha(family, sha);

        it('that returns the original sha ', function () {
           actual.should.equal(mockSha);
        });
        it('that returns the length of the original sha ', function () {
            actual.should.equal(mockSha);
        });
    });

    describe('Given the Fixed family VCS is VsoGit', function () {

        var actual;

        beforeEach(function () {
            actual = getFamilySpecificSha(vcsFamilies.VsoGit,mockSha);
        });

        it('that returns a sha with a length of 8', function () {
            //actual.length.should.equal(VcsFamilySpecificShaTable[]);
            actual.length.should.equal(8);
        });
    });





});