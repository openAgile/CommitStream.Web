# How to run CommitStream locally (from scratch)

This is a work in progress. As this evolves, we update this narrative.

# Required software
* First, use Git to clone this repo: https://github.com/openAgile/CommitStream.Web
* You need [Chocolatey](http://chocolatey.org/) installed to run our installation scripts.
* NodeJS. If you don't have it, type `cinst nodejs` from a prompt to get it.
	* There are two special snowflake packages that need to be installed globally
		* bower - `npm install -g bower`
		* babel - `npm install -g babel`
* Bower components need to be installed for client side code to get served correctly.
  * Navigate to `CommitStream.Web/src/app/client` on the command line.
  * Run the command: `bower install`
  * You should have seen all of the bower components defined in CommitStream.Web/src/app/client/bower.json get installed.
* Grunt and Babel: These two are being used in order to transpile our ES2015 files to the appropriate locations within the project. In order for this to work appropriately though, you must first execute from your command line
  * `npm install -g grunt-cli`
  * Note that installing grunt-cli does not install the Grunt task runner! The job of the Grunt CLI is simple: run the version of Grunt which has been installed next to a Gruntfile. This allows multiple versions of Grunt to be installed on the same machine simultaneously.
  * If you would like to run the watcher for ES2015 files while you make code changes run:
    * `grunt watch --verbose`
  * In the Gruntfile there are a couple of tasks created for developers
    * `grunt dev`
      * Assuming EventStore is running as a Windows Service
      * This wil run the following tasks:
      * Compile your .less files 
      * Compile your ES2015 files
      * Start the node server
      * Watch for .less file changes and compile them. 
      * Watch for ES2015 files changes and compile them
      * Watch for changes in the js files on the server side (api, middleware and server.js), if so it will restart the server.
    * `grunt devm`
      * Use this if you prefer to run EventStore in memory
      * Does everything else from `grunt dev` above, minus EventStore running as a Windows Service (cause it's in memory here ;) )

# How to run just the CommitStream application (no dependency on the VersionOne application)

* Clone this repo if you have not already done so
* As Administrator, open Powershell and navigate to the root of the cloned repo
* Type `Get-ExecutionPolicy` and if the result is not **Unrestricted**, then type `Set-ExecutionPolicy unrestricted`
* Ensure the GIT path has been added to your environment variables in order for the following script to work:
	* Open Windows Environment Variables/Path Window
	* Right-Click on My Computer
	* Click Advanced System Settings link from the left side column
	* Click Environment Variables in the bottom of the window
	* Then under System Variables look for the path variable and click edithttps://github.com/openAgile/CommitStream.Web/pulls
	* Add the pwd to git's bin and cmd at the end of the string like this:
	```
	;C:\Program Files (x86)\Git\bin;C:\Program Files (x86)\Git\cmd
	```
	* Now test it out in PowerShell; type git and see if it recognizes the command.
* Run the install script by typing:
```powershell
.\install.ps1
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
## Troubleshooting

### Keeping CommitStream running as a Windows Service

Since we have all of our development and testing builds of CommitStream running in the cloud, we haven't actually needed to try this yet, but if you want to run CommitStream on a Windows machine as a Windows Service, look into the `node-windows` package:

https://github.com/coreybutler/node-windows

If it works, send us a pull request to this document so others can benefit too!

## Exposing EventStore to other network machines

If you wish to expose the EventStore instance to other machines on a network, you may need to open some firewall ports for EventStore. These powershell commands will do that for you:

```powershell
New-NetFirewallRule -DisplayName "Allow Port 2113" -Direction Inbound –LocalPort 2113 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Allow Port 1113" -Direction Inbound –LocalPort 1113 -Protocol TCP -Action Allow
```
Likewise, unless you change the default `6565` port for CommitStream itself, you may need to do the same.

# How to configure an On-Premise build of VersionOne to point to your CommitStream instance

## Background

This assumes that you have already done the previous step.

* Assuming you have VersionOne installed at `C:\inetpub\wwwroot\VersionOne`, then open the file `C:\inetpub\wwwroot\VersionOne\Web.config`
* Look for the text `<add key="CommitStream.ServiceUrl" value="https://commitstream.v1host.com" />`
* Change the `value` property to point to your local network address of where CommitStream is running.
  * Typically this will be something like `http://theservernameOrIpAddress:6565`

## Open VersionOne and configure CommitStream

* You should now be able to configure CommitStream by opening VersionOne and navigating to the **Admin / DevOps / CommitStream** page.
  * Refer to the VersionOne Community site for configuration documentation: https://community.versionone.com/Help-Center/Administration/CommitStream


