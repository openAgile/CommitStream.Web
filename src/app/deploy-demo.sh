sourceBranch=`git branch | awk '/^\*/{print $2}'`
echo "Pushing current branch '$sourceBranch' onto the 'v1cs-demo' branch for testing on https://v1cs-demo.azurewebsites.net"
grunt gitpush:deploy-demo --source=$sourceBranch