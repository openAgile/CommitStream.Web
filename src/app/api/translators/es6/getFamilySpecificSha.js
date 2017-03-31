/*
 Rationale: In the API, we decided that as a default, each commit should display 7 characters of the commit ID.  This is the convention
 of Github. As we expand and add new VCSes and if any have lenghth requirements different from the default, we add it to VcsFamilySpecificShaTable
 */

import VcsFamilies from '../helpers/vcsFamilies';
const defaultFamilyShaLength = 7;

//If sha length to be displayed is a specific length
const VcsFamilySpecificShaTable= {

     [VcsFamilies.VsoGit]: 8,
     [VcsFamilies.Svn]: Infinity
};

export default (family, sha) => {
    return (VcsFamilySpecificShaTable[family] ?  sha.substring(0,VcsFamilySpecificShaTable[family]) : sha.substring(0,defaultFamilyShaLength));
    if (VcsFamilySpecificShaTable.hasOwnProperty(family)){
        if (VcsFamilySpecificShaTable[family]===Infinity){
            return sha;
        }
        else{
            return sha.substring(0,VcsFamilySpecificShaTable[family]);
        }
    }
    else{
        return sha.substring(0,defaultFamilyShaLength);
    }
};
