import vcsFamilies from '../../helpers/vcsFamilies';

const svnUiDecorator = {
  shouldDecorate(vcsFamily) {
    if (vcsFamily === vcsFamilies.Svn) {
      return true;
    }
    return false;
  },
  decorateUIResponse(commit) {
    if(isCommitHref(commit.commitHref)){
      commit.isCommitHref = true;
    }
    else {
      commit.isCommitHref = false;
    }
    return commit;
  }
};

const isCommitHref = (commitHref) => {
  if (commitHref.length > 0 && commitHref.startsWith('http')){
    return true;
  }
  return false;
};

export default svnUiDecorator;