# How to run CommitStream locally from scratch

This is a work in progress. As this evolves, we update this narrative.

## Installation process
* Install Git for Windows if you don't already have it from https://git-scm.com/download/win
* You need [Chocolatey](http://chocolatey.org/) installed to run our installation scripts.
* Install Node.js LTS version if don't already have it from https://nodejs.org/en/download/
* Open Git Bash and create a directory with: `mkdir /c/projects` then `cd /c/projects`
* Now, use Git to clone this repo: https://github.com/openAgile/CommitStream.Web -- `git clone https://github.com/openAgile/CommitStream.Web.git`
  * There are three special snowflake packages that need to be installed globally
    * bower - `npm install -g bower`
    * babel - `npm install -g babel`
    * grunt-cli - `npm install -g grunt-cli`
      * **NOTE: Installing grunt-cli does not install the Grunt task runner, but running `npm install` in the next step will do this for us.**
* Install NPM dependencies
  * Type `cd CommitStream.Web/src/app` from Bash to get to the source code folder for the app.
  * Run: `npm install`		
* Bower components need to be installed for client side code to get served correctly.
  * Navigate to `CommitStream.Web/src/app/client` on the command line.
  * Run: `bower install`
  * You should have seen all of the bower components defined in `CommitStream.Web/src/app/client/bower.json` get installed.  .
* Install EventStore OSS version
  * **NOTE: This instruction is for LOCAL dev only. For production server installs, see the private repository which details the HA commercial download instructions**
  * Download and unzip the latest 4.x series of EventStore from https://eventstore.org/downloads into somewhere like `C:\Program Files\EventStore`
    * 4.x is the only version of EventStore CommitStream is known to work with.
      * But, update this doc after you have tested it with version 5 and verified that it works :-D
  * Run the process with this command line: `EventStore.ClusterNode.exe --db ./db --log ./logs --run-projections=all` -- this ensures that the projection support runs all projections which are needed by the current design of CommitStream
* Run the system  
  * If you would like to run the watcher for ES2015 files while you make code changes run:
    * `grunt watch --verbose`
  * In the Gruntfile there are a couple of tasks created for developers
    * `grunt dev`
      * Assuming EventStore is running as a Windows Service or running manually as described above:
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

### Verify installation

* Navigate to [http://localhost:6565/](http://localhost:6565/) to see the default message, which should be `Must specify API key in the form of apiKey=<apikey> as a query string parameter`. This is expected.
* Now, if you'd like you can run the automated test suite against your new install by typing the following into a new Bash prompt:
  * `cd /c/projects`
  * `git clone https://github.com/openAgile/CommitStream.Web.Tests.git`
  * `cd CommitStream.Web.Tests`
  * `npm install`
  * `CS_ROOT_URL=http://localhost:6565 npm run ca`
  * For more info, see http://github.com/openAgile/CommitStream.Web.Tests directly
* To directly connect to EventStore, go to [http://localhost:2113](http://localhost:2113) and login with **admin** and **changeit**

## How to configure an On-Premise build of VersionOne to point to your CommitStream instance

This assumes that you have already done the previous steps to get CommitStream installed.

* Assuming you have VersionOne installed at `C:\inetpub\wwwroot\VersionOne`, then open the file `C:\inetpub\wwwroot\VersionOne\Web.config`
* Look for the text `<add key="CommitStream.ServiceUrl" value="https://commitstream.v1host.com" />`
* Change the `value` property to point to your local network address of where CommitStream is running.
  * Typically this will be something like `http://theservernameOrIpAddress:6565`
* You should now be able to configure CommitStream by opening VersionOne and navigating to the **Admin / DevOps / CommitStream** page.
  * Refer to the VersionOne Community site for configuration documentation: https://community.versionone.com/Help-Center/Administration/CommitStream
