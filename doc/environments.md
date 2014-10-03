# Vision

> As openAgile, we want our build, test, and deployment for CommitStream to be as automated as possible, so that we can maximize the amount of time we spend responding to customer demand and delivering new functionality, and minimize the amount of time troubleshooting cumbersome, error-prone processes.

# Environments and branches

See [resources.md](resources.md) for the deployment view of the system.

TODO linkify these:

* **STATUS -- branch name -- Description -- Promotion criteria, info**
* ON GOING -- Local feature branches -- Local copies of the system on developer machines for in-progress stories / fixes -- After sufficient unit-testsing and exploratory testing with testers / users / hallway usability, merge into [developing]
* TODO -- Developing - developing -- Runs full automated tests -- Full-Test-Suite-OnSuccess: promote to [staging]
promoted to master, triggering upgrades to Production
* IN PROGRESS -- Staging -- S-48324_MultiRepository -- Hosts the staging system -- SmokeTests-OnSuccess: promote to [master]
* TODO -- Production -- master -- Hosts the production system which live customer instances use -- This is it buddy.
