# How to run CommitStream from scratch with commits from a source GitHub repo

This is a work in progress. As this evolves, we update this narrative.

# Required software

* You need [Chocolatey](http://chocolatey.org/) installed to run our installation scripts.
* NodeJS. If you don't have it, type `cinst nodejs` from a prompt to get it.

# How to run just the CommitStream application (no dependency on the VersionOne application)

* In GitHub, create a new **Personal access token** for yourself by going to https://github.com/settings/applications. Copy it to your clipboard. You'll need to use it below where it says **[insert-access-token-here]**!
* Clone this repo if you have not already done so
* As Administrator, open Powershell and navigate to the root of the cloned repo
* Type `Get-ExecutionPolicy` and if the result is not **Unrestricted**, then type `Set-ExecutionPolicy unrestricted`
* Run the install script by typing:
```powershell
.\install.ps1 [insert-access-token-here]
```
## Verify installation

* Navigate to [http://localhost:6565/](http://localhost:6565/) to see the example page and commits you just imported!
* To directly connect to EventStore, go to [http://localhost:2113](http://localhost:2113) and login with **admin** and **changeit**

## Installation details

Running the install script above will:

* Install EventStore
* Configure it as a service with the [Non-Sucking Service Manager](http://nssm.cc/) to start automatically on server start
* Start it immediately
* Import the commit history of this repository as sample data
* Spawn a new window to start the CommitStream web app, which in turn configures EventStore with new projections. You should see output like in that window:
```
$ npm start

> openAgile.CommitStream@0.0.1 start c:\Projects\github\CommitStream.Web\src\app

> node server.js

CommitStream Web Server listening on port 6565
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

# How to install and run a build of VersionOne that integrates CommitStream info into the Asset Detail view

## Background

> Given you have a GitHub repository that has commits matching the VersionOne asset mention pattern, like S-12345, D-00312, etc, and you want to start seeing those correlated with those assets inside VersionOne's asset detail view, then:

* As Administrator, open Powershell
* Go to the root folder of this project
* Type `cd src\sandbox`
* Type `get-help Install-V1CSInAzure.ps1 -full` or simply modify the script to suit your needs
* Run it! This will download and install VersionOne and configure it to you the CommitStream integration that is being served by the NodeJS server you installed above.

# Open VersionOne and see commits!

* You should now be able to navigate to an asset detail in your VersionOne instance and see commits.

# Troubleshooting

If you wish to expose the instance to other machines on a network, you may need to open some firewall ports for EventStore. These powershell commands will do that for you:

```powershell
New-NetFirewallRule -DisplayName "Allow Port 2113" -Direction Inbound –LocalPort 2113 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Allow Port 1113" -Direction Inbound –LocalPort 1113 -Protocol TCP -Action Allow
```
