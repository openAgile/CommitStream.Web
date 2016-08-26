const translatorNames = [
  'githubTranslator',
  'gitLabTranslator',
  'bitbucketTranslator',
  'vsoGitTranslator',
  'svnTranslator'
];

const translators = translatorNames.map(name => require(`../translators/${name}`));

class TranslatorFactory {
  create(req) {
    for(let translator of translators) {
      if (translator.canTranslate(req)) return translator;
    }
    return undefined;
  }
  getByFamily(family) {
    for(let translator of translators) {
      if (translator.family === family) return translator;
    }
    return undefined;
  }
}

export default new TranslatorFactory();