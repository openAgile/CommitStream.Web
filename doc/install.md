# How to run CommitStream from scratch with commits from a source GitHub repo

This is a work in progress. As this evolves, we update this narrative.

# Required software

* You need [Chocolatey](http://chocolatey.org/) installed to run our installation scripts.
* NodeJS. If you don't have it, type `cinst nodejs` from a prompt to get it.

# How to run the Node JS server

* As Administrator, open Powershell or Git Bash
* Type `npm install` to install the required node dependencies
* By default, the server will listen on port `80`. To change this, if your VersionOne instance is already running on this port, you can type:
  * `export PORT=8080` in Bash
  * `$Env:PORT=8080` in Powershell
* Type `npm start` from the root of this repository
* Navigate to http://localhost:PORT/ to see the example page

# How to install and run a build of VersionOne that integrates CommitStream info into the Asset Detail view

## Background
> Given you have a GitHub repository that has commits matching the VersionOne asset mention pattern, like S-12345, D-00312, etc, and you want to start seeing those correlated with those assets inside VersionOne's asset detail view, then:

* As Administrator, open Powershell
* Type `cd src\sandbox`
* Type `get-help Install-V1.ps1 -full` or simply modify the script to suit your needs
* Run it! This will download and install VersionOne and configure it to you the CommitStream integration that is being server by the NodeJS server. TODO: add port option for NodeJS, since IIS needs 80

# Technical notes

The `app.js` JavaScript module that gets loaded into VersionOne pulls in the following dependencies using require.js: 
  * Moment.js
  * Handlebars
  * assetDetailCommits module from <nodeServerUrl>/assetDetailCommits.js
          * This in turn loads from our Azure-hosted EventStore service at http://weventstore.cloudapp.net:2113, but you can change that to whereover your EventStore is hosted.
* This will evolve into ability for an Admin to install the CommitStream integration from an Integrations.mvc page
* This page will initially be unlinked from the top-level menu system, but we will tell customers about it.
  * Only customers who we add to the whitelist at [../client/whitelist.json](../client/whitelist.json) will be able to access this page

# Install EventStore
* Download a 3.0+ build of EventStore from http://geteventstore.com/downloads/ and install it on a server
  * Running example: http://weventstore.cloudapp.net:2113
  * Unzip eventstore into c:\eventstore
  * Download EventStoreWinServiceWrapper from https://github.com/mastoj/EventStoreWinServiceWrapper/tree/master/releases
  * Unzip into EventStoreWinServiceWrapper
  * Modify EventStoreWinServiceWrapper.exe.config so it looks like this:

 ```
 <?xml version="1.0" encoding="utf-8" ?>
 <configuration>
  <configSections>
    <section name="eventStore" type="EventStoreWinServiceWrapper.EventStoreServiceConfiguration,   EventStoreWinServiceWrapper, Version=1.0.0.0, Culture=neutral" />
   </configSections>
   <eventStore executable="C:\eventstore\EventStore.ClusterNode.exe">
     <instance name="Dev" dbPath="c:\eventstore\data"    addresses="http://127.0.0.1:2113/,http://{yourdns}:2113/" logPath="c:\eventstore\logs" externalip="{yourAzureInternalIp}" internalip=""/>
 </eventStore>
  <startup>
    <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5" />
  </startup>
</configuration>
 ```
 * Run the install.ps1 script from the EventStoreWinServiceWrapper. From that point you should have a windows service running event store.
 * Open the neccesary ports so eventStore can be accessed from the outside. Powershell commands:
```
	New-NetFirewallRule -DisplayName "Allow Port 2113" -Direction Inbound –LocalPort 2113 -Protocol TCP -Action Allow
	New-NetFirewallRule -DisplayName "Allow Port 1113" -Direction Inbound –LocalPort 1113 -Protocol TCP -Action Allow
```

# Import commits and create EventStore projections
* Clone the GitHub commit import script from https://github.com/kunzimariano/EventStore-Demo
* Modify these lines to point to the correct EventStore instance: https://github.com/kunzimariano/EventStore-Demo/blob/master/Import-FullCommits.ps1#L5-L7
* Follow the instructions in the readme to execute the import
* Now, to create the required projections in EventStore, do this:
* TODO: Make this part of CommitStream.Web so it doesn't live in the vacuum. It could be a rest call that takes the repo url as a parameter.

# Open VersionOne and see commits!
* You should now be able to navigate to an asset detail in your VersionOne instance and see commits.
* Note: yes the commits are hard-coded, and we are fixing that now.
