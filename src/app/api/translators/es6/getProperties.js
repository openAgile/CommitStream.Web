export default function(event, commitUrlPathFragment, branchPathFragment) {
  const commit = event.commit;
  const branch = event.branch;
  const html_url = event.html_url;
  
  const props = {
    repo: '',
    repoHref: '',
    branchHref: ''
  };

  const urlComponents = html_url.split(commitUrlPathFragment)[0].split('/');
  const repoName = urlComponents.pop();
  const repoOwner = urlComponents.pop();
  props.repo = `${repoOwner}/${decodeURIComponent(repoName)}`;
  let serverUrl = urlComponents.pop();

  if (urlComponents.pop() === '') {
    serverUrl = urlComponents.pop() + '//' + serverUrl;
  }
  props.repoHref = `${serverUrl}/${repoOwner}/${encodeURIComponent(repoName)}`;
  props.branchHref = `${props.repoHref}/${branchPathFragment}/${branch}`;

  return props;
};