sourceBranch=`git branch | awk '/^\*/{print $2}'`
echo "Pushing current branch '$sourceBranch' onto the 'v1cs-dev' branch for testing on https://v1cs-dev.azurewebsites.net"
grunt gitpush:deploy-dev --source=$sourceBranch
