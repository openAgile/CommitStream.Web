WORKSPACE=`pwd`
cd /c/Program\ files/eventstore
./EventStore.ClusterNode.exe --mem-db --run-projections=all &
sleep 20
cd $WORKSPACE
source ./smoke-test.vars.sh
npm start &
./projections-enable.sh
sleep 10
npm run jenkins-smoke >results.tap