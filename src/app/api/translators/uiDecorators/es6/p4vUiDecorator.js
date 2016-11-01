import vcsFamilies from '../../helpers/vcsFamilies';

const p4vUiDecorator = {
  shouldDecorate(vcsFamily) {
    if (vcsFamily === vcsFamilies.P4V) {
      return true;
    }
    return false;
  },
  decorateUIResponse(commit) {
    return commit;
  }
};

  }
};

export default p4vUiDecorator;