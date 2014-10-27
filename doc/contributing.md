# For VersionOne developers

## Start working on a story

Say you're ready to create a feature branch based on a story named "Import commits from WheelerHub", workitem number S-12345. Do this:

* Clone this repository and navigate to the folder root, type:
* `git checkout develop` -- switch to the develop branch, from whence all story branches should branch
* `git pull --rebase` -- pulls any commits from the remote server (origin by default) and also rebases all branches that it can
* `git checkout -b import_WheelerHub_commits_S-12345` -- creates new local branch with the given name

Feel free to start making commits to your local branch! To push changes to the remote counterpart branch, **without also pushing commits to other branches you may have locally**, type:

* `git push origin import_WheelerHub_commits_S-12345`

## Merge a feature branch back into develop

Once you're ready to merge your changes back into develop, type:

* `git checkout import_WheelerHub_commits_S-12345` (if you are not already on it)
* `git pull --rebase` -- pulls down and rebases any commits other contributors have on the remote counterpart branch
* `git rebase origin/develop` -- attempts to pop commits off the branch since it diverged from develop, pull all the subsequent changes from develop, and then toss your commits back on top!
* `git push origin import_WheelerHub_commits_S-12345 --force` -- using `--force` explicitly tells git that yes, indeed, you want to rewrite history for the branch to which you are pushing
* Go to GitHub and make a pull request, ensureing to set the merge target as **develop**, not master

## Approve a pull request into develop

If there is a pending pull request, and GitHub says it can automatically merge it, and you have access, go for it!
