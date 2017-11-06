const translatorNames = [
  'deveoTranslator',
  'githubTranslator',
  'gitLabTranslator',
  'bitbucketTranslator',
  'vsoGitTranslator',
  'svnTranslator',
  'gitSwarmTranslator',
  'p4vTranslator',
  'vsoTfvcTranslator'
];

const translators = translatorNames.map(name => require(`../translators/${name}`));

const vsoGitPullRequestTranslator = require(`../translators/vsoGitPullRequestTranslator`);

class TranslatorFactory {
  create(req) {
    for(let translator of translators) {
      if (translator.canTranslate(req)) return translator;
    }
    return undefined;
  }
  createPullRequestTranslator(req) {
    console.log('*******************************************')
    console.log('in createPullRequestTranslator:', vsoGitPullRequestTranslator.canTranslate(req))
    return vsoGitPullRequestTranslator.canTranslate(req) ? vsoGitPullRequestTranslator : undefined;
  }
  getByFamily(family) {
    for(let translator of translators) {
      if (translator.family === family) return translator;
    }
    return undefined;
  }
}

export default new TranslatorFactory();
