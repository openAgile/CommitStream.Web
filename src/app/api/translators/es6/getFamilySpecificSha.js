/*
 Rationale: In the API, we decided that as a default, each commit should display 7 characters of the commit ID.  This is the convention
 of Github. As we expand and add new VCSes and if any have length requirements different from the default, we add it to VcsFamilySpecificShaLengthTable
 */

import VcsFamilySpecificShaLengthTable from '../helpers/vcsFamilySpecificShaLengthTable';
const defaultFamilyShaLength = 7;

export default (family, sha) => {
    if (VcsFamilySpecificShaLengthTable.hasOwnProperty(family)) {
        if (VcsFamilySpecificShaLengthTable[family] === Infinity) {
            return sha;
        }
        else {
            return sha.substring(0, VcsFamilySpecificShaLengthTable[family]);
        }
    }
    else {
        return sha.substring(0, defaultFamilyShaLength);
    }
};