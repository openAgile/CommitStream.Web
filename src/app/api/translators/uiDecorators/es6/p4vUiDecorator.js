import vcsFamilies from '../../helpers/vcsFamilies';

const p4vUiDecorator = {
  shouldDecorate(vcsFamily) {
    if (vcsFamily === vcsFamilies.P4V) {
      return true;
    }
    return false;
  },
  decorateUIResponse(commit) {
    if(isCommitHref(commit.commitHref)){
      commit.isCommitHref = true;
    }
    return commit;
  }
};

const isCommitHref = (commitHref) => {
  if (commitHref.length > 0){
    return true;
  }
  return false;
};

export default p4vUiDecorator;