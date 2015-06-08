SCRIPT_HOME=`pwd`
cd /c/Program\ files/eventstore
./EventStore.ClusterNode.exe --mem-db --run-projections=all &
sleep 15
cd $SCRIPT_HOME
source ./smoke-test.vars.sh
npm start &
#./projections-enable.sh
sleep 10
npm run jenkins-smoke-happy-path >results.tap
