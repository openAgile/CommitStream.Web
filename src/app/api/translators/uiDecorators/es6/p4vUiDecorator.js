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

    if(isCommitHref(commit.commitHref)){
      commit.isCommitHref = true;
    }
    else {
      commit.isCommitHref = false;
    }
    return commit;
  }
};

const isLocalVCS = (repoHref) => {
  if (repoHref.startsWith('http')) {
    return false;
  }
  return true;
}

const isCommitHref = (commitHref) => {
  if (commitHref.length > 0 && commitHref.startsWith('http')){
    return true;
  }
  return false;
};

export default p4vUiDecorator;