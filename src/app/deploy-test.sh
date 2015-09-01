sourceBranch=`git branch | awk '/^\*/{print $2}'`
echo "Pushing current branch '$sourceBranch' onto the 'v1-cs-test' branch for testing on https://v1-cs-test.azurewebsites.net"
grunt gitpush:deploy-test --source=$sourceBranch