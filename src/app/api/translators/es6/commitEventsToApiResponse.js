import moment from 'moment';
import translatorFactory from './translatorFactory';
import uiDecoratorFactory from './uiDecorators/uiDecoratorFactory';

const getFamily = (eventType) => eventType.slice(0, -14);

export default (entries) => {
  const commits = [];
  for (let entry of entries) {
    try {
      const e = JSON.parse(entry.data);
      const family = getFamily(entry.eventType);
      const translator = translatorFactory.getByFamily(family);
      const props = translator.getProperties(e);

      let commit = {
        commitDate: e.commit.committer.date,
        timeFormatted: moment(e.commit.committer.date).fromNow(),
        author: e.commit.committer.name,
        sha1Partial: e.sha.substring(0, 6),
        family,
        action: 'committed',
        message: e.commit.message,
        commitHref: e.html_url,
        repo: props.repo,
        branch: e.branch,
        branchHref: props.branchHref,
        repoHref: props.repoHref
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
