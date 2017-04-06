var chai =                            require('chai'),
    expect =                          require('chai').expect,
    vcsFamilySpecificShaLengthTable = require('../../../api/helpers/vcsFamilySpecificShaLengthTable'),
    vcsFamilies =                     require('../../../api/helpers/vcsFamilies');

describe('vcsFamilySpecificShaLengthTable', function() {
    describe('Does family exist in vcsFamilies?', function () {
        beforeEach(function () {
        //NOOP
        });

        it('The size of vcsFamilySpecificShaLengthTable < vcsFamilies', function () {
            expect(Object.keys(vcsFamilies).length).to.be.greaterThan(Object.keys(vcsFamilySpecificShaLengthTable).length);
        });

        it('The vcsFamilySpecificShaLengthTable entry is contained in vcsFamilies', function () {
            var foundInVcFam=0;
            (Object.keys(vcsFamilySpecificShaLengthTable).forEach(function(entry) {
                if(Object.keys(vcsFamilies).includes(entry)) {foundInVcFam++;}
                }));
            expect(foundInVcFam).equal(Object.keys(vcsFamilySpecificShaLengthTable).length);
        });
    });

});