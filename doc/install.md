# How to run CommitStream from scratch with commits from a source GitHub repo

This is a work in progress. As this evolves, we update this narrative.

# Scenario
> Given you have a GitHub repository that has commits matching the VersionOne asset mention pattern, like S-12345, D-00312, etc, and you
want to start seeing those correlated with those assets inside VersionOne's asset detail view, then:

# Install VersionOne with CommitStream loader build
* Install a VersionOne build from ci-server/job/CommitStream-core-developing/
  * Running example: https://v1commitstream.cloudapp.net/VersionOne
    * TODO: Add config setting that tells VersionOne where to find the CommitStream integration JavaScript. 
      * Notes: 
        * Currently, it's hard-coded to look here: http://v1commitstream.azurewebsites.net/app.js?_=1411487691068, which pulls in these dependencies asynchronously via require.js:
          * Moment.js
          * Handlebars
          * assetDetailCommitsModule from http://v1commitstream.azurewebsites.net/assetDetailCommitsModule.js
            * This points to our running Azure-hosted EventStore service at http://weventstore.cloudapp.net:2113
        * This will evolve into ability for an Admin to install the CommitStream integration from an Integrations.mvc page
        * This page will initially be unlinked from the top-level menu system, but Ian will tell customers about it.
        * Only customers who Ian has added to a whitelist will be able to access this page

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
* TODO

# Open VersionOne and see commits!
* You should now be able to navigate to an asset detail in your VersionOne instance and see commits.
* Note: yes the commits are hard-coded, and we are fixing that now.
