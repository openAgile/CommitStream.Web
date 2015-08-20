Keep this document up-to-date to reflect resources that CommitStream uses in production, staging, and other configurations.
Contact Tom Hall to get added to the accounts in Azure to see these resources.

# PROD account Azure resources

## Web Apps

* `commitstream`: PROD system
  * `commitstream(staging)`: Staging slot of PROD

## Cloud Services (Virtual machines and related resources)

* CLUSTER: `eventstore-cluster`: Clustered EventStore configuration that PROD Web App uses
  * Virtual Network: `EventStore`
  * Storage Account: `eventstorecluster`
  * VM Nodes: 
    * `eventstore-01`
    * `eventstore-02`
    * `eventstore-03`

# DEV account Azure resources

## Web Apps

* `v1-cs-test`: For testing new features end-to-end
* `v1cs-demo`: For demoing to customers
* `v1cs-dev`: TODO: unknown

## Cloud Services (Virtual machines and related resources)

* `v1commitstream`: For the VM that hosts test/demo EventStore instance and a VersionOne instance for testing and demoing
  * VM Nodes:
    * `v1commitstream`
      * Disk: `https://portalvhdsw36vjbsgqb26p.blob.core.windows.net/vhds/24mvbv14.zly201409291806190790.vhd`
* `cs-eventstore-cluster`: For testing EventStore clustered configuration
  * Virtual Network: `CS-EventStore`
  * Storage Account: `cseventstoreerotstnevesc`
  * VM Nodes:
    * `cs-eventstore-1`
    * `cs-eventstore-2`
    * `cs-eventstore-3`

## Virtual Machine Images

* `v1cs-base`: Baseline setup for CommitStream with EventStore installed
* `v1cs-stressMarch`: VM that has JMeter setup and ready to test against a CS instance when needed

## Unknowns

* Web Apps: `v1cs-dev`
* VM Image: `EventStore-Stress-Test`
