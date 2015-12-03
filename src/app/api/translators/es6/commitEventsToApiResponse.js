import moment from 'moment';
import translatorFactory from './translatorFactory';

const getFamily = (eventType) => eventType.slice(0, -14);

export default (entries) => {
  const commits = [];
  for (let entry of entries) {
    try {
      const e = JSON.parse(entry.data);
      const family = getFamily(entry.eventType);
      const translator = translatorFactory.getByFamily(family);
      const props = translator.getProperties(e);

      commits.push({
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
      });
    } catch (ex) {
      console.log(ex);
    }
  }
  const response = {
    commits
  };
  return response;
};
