sourceBranch=`git branch | awk '/^\*/{print $2}'`
echo $sourceBranch
grunt gitpush:deploy-test --source=$sourceBranch