# How to run CommitStream from scratch with commits from a source GitHub repo

This is a work in progress. As this evolves, we update this narrative.

# Required software

* You need [Chocolatey](http://chocolatey.org/) installed to run our installation scripts.
* NodeJS. If you don't have it, type `cinst nodejs` from a prompt to get it.

# How to run just the CommitStream application (no dependency on the VersionOne application)

* Clone this repository if you have not already done so
* As Administrator, open Powershell
* From any folder, install EventStore by typing:
```powershell
choco install eventstore -source https://www.myget.org/F/versionone/
nssm install eventstore "C:\Program Files\eventstore\EventStore.ClusterNode.exe" "--run-projections=ALL"
nssm start eventstore
```*
* The above commands will:
  * Install EventStore
  * Configure it as a service with the [Non-Sucking Service Manager](http://nssm.cc/) to start automatically on server start
  * Start it immediately
* In GitHub, create a new **Personal access token** for yourself by going to https://github.com/settings/applications. Copy it to your clipboard!
* Navigate to the `CommitStream.Web` folder (or wherever you cloned this repo to)
* Type `cd src/test`
* Modify the `Import-FullCommits.ps1` if you want to change:
  * The address for EventStore if you did not install it on the current machine
  * The GitHub repository from which you want to import commits. By default it imports public commits from this repository.
* Type `.\Import-FullCommits.ps1` `&lt;accesstokenhere&gt;`
* Type `cd src/app` to get to navigate to the application code root
* Type `npm install` to install the required node dependencies
* By default, the server will listen on port `80`. To change this, if your VersionOne instance is already running on this port, you can type:
  * `export PORT=6565` in Bash
  * `$Env:PORT=6565` in Powershell
* Type `npm start` from the root of this repository
* The app will configure EventStore with new projections. You should see output like:
```
$ npm start

> openAgile.CommitStream@0.0.1 start c:\Projects\github\CommitStream.Web\src\app

> node server.js

CommitStream Web Server listening on port 8090
Looking for projections...
OK created projection by-asset
{
  "msgTypeId": 237,
  "name": "by-asset"
}
OK created projection partitionate-with-or-without-mention
{
  "msgTypeId": 237,
  "name": "partitionate-with-or-without-mention"
}
```
* Navigate to http://localhost:6565/ to see the example page and commits you just imported!

# How to install and run a build of VersionOne that integrates CommitStream info into the Asset Detail view

## Background

> Given you have a GitHub repository that has commits matching the VersionOne asset mention pattern, like S-12345, D-00312, etc, and you want to start seeing those correlated with those assets inside VersionOne's asset detail view, then:

* As Administrator, open Powershell
* Go to the root folder of this project
* Type `cd src\sandbox`
* Type `get-help Install-V1.ps1 -full` or simply modify the script to suit your needs
* Run it! This will download and install VersionOne and configure it to you the CommitStream integration that is being served by the NodeJS server you installed above.

# Technical notes 

The `app.js` JavaScript module that gets loaded into VersionOne pulls in the following dependencies using require.js: 
  * Moment.js
  * Handlebars
  * assetDetailCommits module from <nodeServerUrl>/assetDetailCommits.js
    * This in turn loads from our Azure-hosted EventStore service at http://weventstore.cloudapp.net:2113, but you can change that to whereover your EventStore is hosted.
* This will evolve into ability for an Admin to install the CommitStream integration from an Integrations.mvc page
* This page will initially be unlinked from the top-level menu system, but we will tell customers about it.
  * Only customers who we add to the whitelist at [../client/whitelist.json](../client/whitelist.json) will be able to access this page

# Open VersionOne and see commits!

* You should now be able to navigate to an asset detail in your VersionOne instance and see commits.

# Troubleshooting

If you wish to expose the instance to other machines on a network, you may need to open some firewall ports for EventStore. These powershell commands will do that for you:

```powershell
New-NetFirewallRule -DisplayName "Allow Port 2113" -Direction Inbound –LocalPort 2113 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Allow Port 1113" -Direction Inbound –LocalPort 1113 -Protocol TCP -Action Allow
```
