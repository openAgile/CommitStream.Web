import moment from 'moment';
import translatorFactory from './translatorFactory';
import uiDecoratorFactory from './uiDecorators/uiDecoratorFactory';
import VcsFamilies from '../helpers/vcsFamilies';
import getFamilySpecificSha from './getFamilySpecificSha';

const getFamily = (eventType) => eventType.slice(0, -14);

export default (entries) => {
  const commits = [];
  for (let entry of entries) {
    try {
      const commitEvent = JSON.parse(entry.data);
      const family = getFamily(entry.eventType);
      const translator = translatorFactory.getByFamily(family);
      const props = translator.getProperties(commitEvent);
      const sha1Partial = getFamilySpecificSha(family,commitEvent.sha);

      let commit = {
        commitDate: commitEvent.commit.committer.date,
        timeFormatted: moment(commitEvent.commit.committer.date).fromNow(),
        author: commitEvent.commit.committer.name,
        sha1Partial,
        family,
        action: 'committed',
        message: commitEvent.commit.message,
        commitHref: commitEvent.html_url,
        repo: props.repo,
        branch: commitEvent.branch,
        branchHref: props.branchHref,
        repoHref: props.repoHref,
        isCommitHref: true,
        isVsoTfvc: false
      };
      const uiDecorator = uiDecoratorFactory.create(family);

      if (uiDecorator){
        commit = uiDecorator.decorateUIResponse(commit);
      }
      commits.push(commit);
    } catch (ex) {
      console.log(ex);
    }
  }

  const response = {
    commits
  };
  return response;
};
