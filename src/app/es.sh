SCRIPT_HOME=`pwd`
cd /c/Program\ files/eventstore
./EventStore.ClusterNode.exe --mem-db --run-projections=all &
sleep 8
cd $SCRIPT_HOME
source ./smoke-test.vars.sh
./projections-enable.sh