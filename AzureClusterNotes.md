1) Deleted port 2113 from Node 1 in Azure
2) Added a new port of 2113 on Node 1, making it a Balanced Set named ESClust
3) For nodes 2 and 3, added this same balanced set port, resulting in all three nodes have port 2113
4) Because of the original script, at this point, Node 1 has 2113, and Node 2 has 2113 AND 2213, and Node 3 has port 2113 and 2313
5) Now, Only on node 1:

New-NetFirewallRule -Name Allow_Direct_EventStore_Ext_In -DisplayName "Allow inbound External Event Store direct traffic" -Protocol TCP -Direction Inbound -Action Allow -LocalPort 2013

// possibly needs ,:
// New-NetFirewallRule -Name Allow_Direct_EventStore_Ext_In -DisplayName "Allow inbound External Event Store // direct traffic" -Protocol TCP -Direction Inbound -Action Allow -LocalPort 2013,2013

6) Update the YANL config in C:\EventStore\EventStore-Config.yaml for each node as follows. Specifically speaking, we need RunProjections: ALL, we are changing ExtHttpPort to be the SAME for all nodes, and then we add two HttpPrefixes values, one specific to the local machine, and the other with the clustered, load-balanced address.

Node 1:

# EventStore configuration file. Created at: 2015-03-18 16:31:25Z
Db: F:\Data\eventstore
Log: D:\Logs\eventstore
RunProjections: ALL
IntIp: 10.0.0.4
ExtIp: 10.0.0.4
IntTcpPort: 1112
IntHttpPort: 2112
ExtTcpPort: 1113
ExtHttpPort: 2113
HttpPrefixes:
  - http://10.0.0.4:2113/
  - http://cs-eventstore-cluster.cloudapp.net:2113/
DiscoverViaDns: false
GossipSeed: ['10.0.0.5:2112','10.0.0.6:2112']
ClusterSize: 3

Node 2:

# EventStore configuration file. Created at: 2015-03-18 16:31:00Z
Db: F:\Data\eventstore
Log: D:\Logs\eventstore
RunProjections: ALL
IntIp: 10.0.0.5
ExtIp: 10.0.0.5
IntTcpPort: 1112
IntHttpPort: 2112
ExtTcpPort: 1213
ExtHttpPort: 2113
HttpPrefixes:
  - http://10.0.0.5:2113/
  - http://cs-eventstore-cluster.cloudapp.net:2113/
DiscoverViaDns: false
GossipSeed: ['10.0.0.4:2112','10.0.0.6:2112']
ClusterSize: 3

Node 3:

# EventStore configuration file. Created at: 2015-03-18 16:31:29Z
Db: F:\Data\eventstore
Log: D:\Logs\eventstore
RunProjections: ALL
IntIp: 10.0.0.6
ExtIp: 10.0.0.6
IntTcpPort: 1112
IntHttpPort: 2112
ExtTcpPort: 1313
ExtHttpPort: 2113
HttpPrefixes:
  - http://10.0.0.6:2113/
  - http://cs-eventstore-cluster.cloudapp.net:2113/
DiscoverViaDns: false
GossipSeed: ['10.0.0.4:2112','10.0.0.5:2112']
ClusterSize: 3






ExtHttpPort: 2113
HttpPrefixes:

 - http://10.0.0.5:2113/

 - http://cs-eventstore-cluster.cloudapp.net:2113/

joshgough [6:05 PM]
where 10.0.0.5 is .4, and .6 for the others

joshgough [6:06 PM]
and then I added a  Set lilke we did before in Azure

joshgough [6:06 PM]
for 2113

joshgough [6:06 PM]
currently the service is running ONLY on node 3

joshgough [6:06 PM]
but http://cs-eventstore-cluster.cloudapp.net:2113/web/index.html#/ loads

joshgough [6:07 PM]
i'm about to turn it on on node 1 and OFF on node 3

joshgough [6:09 PM]
yep worked :simple_smile:

joshgough [6:09 PM]
now turning it on for all nodes

joshgough [6:10 PM]
so the only thing i'm not sure of now is how we could individually address them from the outside

joshgough [6:24 PM] 
Apparently they don't formally support that.

joshgough [6:24 PM]
someone has a work around here: http://stackoverflow.com/questions/20340336/create-two-endpoints-with-the-same-private-port-on-windows-azure

Create two endpoints with the same private port on Windows Azure
I have an apache server running on port 8080. I've created this endpoint: 8080 forwarding to 8080 But when I try to create this: 80 forwarding to 8080 I get an error that says that the

joshgough [6:35 PM] 
got that working now too

joshgough [6:35 PM]
with a different approach

joshgough [6:35 PM]
using this:

joshgough [6:35 PM]
etsh interface portproxy>add v4tov4 listenport=2213 connectport=2113 connectaddress=10.0.0.5

joshgough [6:35 PM]
netsh

joshgough [6:36 PM]6:36
and then a firewall rule to allow 2213 on that node