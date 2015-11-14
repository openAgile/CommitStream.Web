'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (event, commitUrlPathFragment, branchPathFragment) {
  var commit = event.commit;
  var branch = event.branch;
  var html_url = event.html_url;

  var props = {
    repo: '',
    repoHref: '',
    branchHref: ''
  };

  var urlComponents = html_url.split(commitUrlPathFragment)[0].split('/');
  var repoName = urlComponents.pop();
  var repoOwner = urlComponents.pop();
  props.repo = repoOwner + '/' + decodeURIComponent(repoName);
  var serverUrl = urlComponents.pop();

  if (urlComponents.pop() === '') {
    serverUrl = urlComponents.pop() + '//' + serverUrl;
  }
  props.repoHref = serverUrl + '/' + repoOwner + '/' + encodeURIComponent(repoName);
  props.branchHref = props.repoHref + '/' + branchPathFragment + '/' + branch;

  return props;
};

;
module.exports = exports['default'];
