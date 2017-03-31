import vcsFamilies from '../../helpers/vcsFamilies';

const vsoTfvcUiDecorator = {
  shouldDecorate(vcsFamily) {
    return vcsFamily === vcsFamilies.VsoTfvc ? true : false;
  },
  decorateUIResponse(commit) {
    commit.isVsoTfvc = true;
    return commit;
  }
}

export default vsoTfvcUiDecorator;