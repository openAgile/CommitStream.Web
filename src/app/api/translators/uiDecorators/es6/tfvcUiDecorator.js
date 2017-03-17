import vcsFamilies from '../../helpers/vcsFamilies';

const tfvcUiDecorator = {
  shouldDecorate(vcsFamily) {
    return vcsFamily === vcsFamilies.Tfvc ? true : false;
  }
}

export default tfvcUiDecorator;