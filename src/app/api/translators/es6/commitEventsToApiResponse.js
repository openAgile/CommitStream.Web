import moment from 'moment';
import translatorFactory from './translatorFactory';
import uiDecoratorFactory from './uiDecorators/uiDecoratorFactory';

const getFamily = (eventType) => eventType.slice(0, -14);

export default (entries) => {
  const commits = [];
  for (let entry of entries) {
    try {
      const commitEvent = JSON.parse(entry.data);
      const family = getFamily(entry.eventType);
      const translator = translatorFactory.getByFamily(family);
      const props = translator.getProperties(commitEvent);

      let commit = {
        commitDate: commitEvent.commit.committer.date,
        timeFormatted: moment(commitEvent.commit.committer.date).fromNow(),
        author: commitEvent.commit.committer.name,
        sha1Partial: commitEvent.sha.substring(0, 6),
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
