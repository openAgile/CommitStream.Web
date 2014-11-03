var getRepoUser = function(url) {
    var splittedUrl = url = url.split("/commit")[0].split('/');
    var repoUser = [];
    repoUser.push(splittedUrl.pop());
    repoUser.push(splittedUrl.pop());
    return repoUser;
}

fromStream('github-events')
.whenAny(function (state, ev) {
    var repoUser = getRepoUser(ev.data.html_url);
    {
        linkTo('repo-' + repoUser[1] + '-' + repoUser[0], ev);
    }
});