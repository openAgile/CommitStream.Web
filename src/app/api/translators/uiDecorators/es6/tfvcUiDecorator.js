import vcsFamilies from '../../helpers/vcsFamilies';

const tfvcUiDecorator = {
  shouldDecorate(vcsFamily) {
    return vcsFamily === vcsFamilies.Tfvc ? true : false;
  },
  decorateUIResponse(commit) {
    commit.isTfvc = true;
    return commit;
  }
}

export default tfvcUiDecorator;