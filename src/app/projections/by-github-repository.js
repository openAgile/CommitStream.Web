var getRepoUser = function (url) {
    var splittedUrl = url = url.split("/commit")[0].split('/');
    var repoUser = [];
    repoUser.push(splittedUrl.pop());
    repoUser.push(splittedUrl.pop());
    return repoUser;
}

var callback = function (state, ev) {
    if (!(ev.data && ev.data.html_url)) {
        emit("github-repository-error", "missingCommitOrMessageFound", ev.data);
    } else {
        var repoUser = getRepoUser(ev.data.html_url);
        {
            linkTo('repo-' + repoUser[1] + '-' + repoUser[0], ev);
        }
    }
};
fromStream('github-events')
.whenAny(callback);