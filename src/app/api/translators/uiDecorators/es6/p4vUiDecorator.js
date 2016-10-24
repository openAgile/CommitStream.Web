import vcsFamilies from '../../helpers/vcsFamilies';

const p4vUiDecorator = {
  shouldDecorate(vcsFamily) {
    if (vcsFamily === vcsFamilies.P4V) {
      return true;
    }
    return false;
  },
  decorateUIResponse(commit) {
     if(isLocalVCS(commit.repoHref)){
       commit.isLocalVCS = true;
     }
    return commit;
  }
};

const isLocalVCS = (repoHref) => {
  if (repoHref.startsWith('http')){
    return false;
  }
  return true;
};

export default p4vUiDecorator;