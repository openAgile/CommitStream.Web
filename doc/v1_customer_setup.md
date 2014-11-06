This document describes the manual steps necessary to configure a CommitStream instance for a customer. It's intended to serve as a temporary approach for getting early feedback from customers while we develop a robust and secure multi-tenant hosting model.

# Steps

## Create code branch for the customer instance

* Given a customer named DevOpsHeros:
* Create a new branch named **devopsheros** from the [master](https://github.com/openAgile/CommitStream.Web/tree/master) branch in this repository
* Push the newly created **devopsheros** branch to the remote with `git push origin devopsheros`. You will see a newly created branch up on GitHub.

## Create virtual machine to host EventStore

* In the [Azure Dev account portal](https://manage.windowsazure.com/VersionOne.onmicrosoft.com#Workspaces/All/dashboard), create a new Windows Virtual machine with:
  * DNS Name: `devopsheroscs`
  * Image: `Windows Server 2012 R2 Datacenter`
  * Size: `Standard A2 (2 Cores, 3.75 GB)` TODO: is this really big enough?
  * Username, Password fields: **Ask Josh in HipChat, as this might need to be standard for Jenkins jobs**
  * Affinity Group: `East US 2`
* Once this machine is up and running, [log into it with Remote Desktop](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-log-on-windows-server/) and then install EventStore using the [automated script documented here](install.md). Note you will execute the script without the GitHub access token since you do not need to import commits from our default repository at this time.
* Verify that eventstore is up and running as a service by navigating to http://localhost:2113 and logging in with admin / changeit
* Assuming you followed the script linked above, you should have installed Chocolatey. Now install the Windows 8 SDK with: `choco install windows-8-1-sdk`
* In Powershell, navigate to the installation location for the SDK. On my machine it is: `C:\Program Files (x86)\Windows Kits\8.1\bin\x64`. If you cannot find it, do a file search for `makecert.exe`.
* Now, use `makecert.exe` to generate a self-signed certificate to secure EventStore on the machine:
```text
makecert -ss My -sr LocalMachine -sky exchange -r -n "CN=EventStoreCert" -sk EventStoreCert -pe
certmgr.exe -add -r LocalMachine -s My -c -n EventStoreCert -r CurrentUser -s My
```
* Now, open the cert from the cert manager and read the Thumprint GUID and use in place of the hard-coded value below:
```text
netsh http add sslcert ipport=0.0.0.0:2113 certhash=thumbhere appid={00112233-4455-6677-8899-AABBCCDDEEFF}
```
   * Change the EventStore admin password by generating a new guid, which will also serve as the `eventStorePassword` value below. In powershell you can type `[guid]::NewGuid()`.
   * Install the Windows Developer kit that has makecert.exe
   * Run the powershell commands for this.
   * Update the config.yml file for eventstore. Ensure that it has the right HttpPrefixes and the external ip for your VM:
``` 
ExtIp: 0.0.0.1
HttpPrefixes:
  - https://localhost:2113/
  - https://your.azure.dns.name:2113/
```
   * Verify that EventStore now operates only over https:// and not http://

## Create the Azure web site to host the customer instance
* Create a new web site in the [Azure Dev account portal](https://manage.windowsazure.com/VersionOne.onmicrosoft.com#Workspaces/All/dashboard) named `devopsheroscs`
* Configure the site to publish from source control and select [https://github.com/openAgile/CommitStream.Web](openAgile/CommitStream.Web) on the `devopsheros` branch
  * **Note:** If you need access to the repo ask Josh in HipChat
* Verify that the deployment worked in the web site details view
* Configure the site's App Settings so that it knows where to find its EventStore instance with these settings
  * First, create a new GUIDs, this time for the service `apiKey`. Again, in powershell you can type `[guid]::NewGuid()`. 
  * Then, add these App Settings to the site
    * eventStoreBaseUrl: `https://devopsheroscs.cloudapp.net:2113`
	  * protoco" : `https`
	  * apiKey: `<apiKey GUID>`
	  * eventStoreUser `admin`
	  * eventStorePassword: `<eventStorePassword GUID>`
	  * eventStoreAllowSelfSignedCert: `true`
* Verify that the site is working by querying in your browser: [https://devopsheroscs.azurewebsites.net/api/query?key=<apiKey GUID>&workitem=S-11111](https://devopsheroscs.azurewebsites.net/api/query?key=<apiKey GUID>&workitem=S-11111). You should get an empty `{commits:[]}` message back, since no commits have been sent to this system yet.

##  Configure VersionOne instance

At this time, configuration in VersionOne is manually applied to the `user.config` file. It uses three settings. The longer-term goal is that the first two of these will enable fine-grained control from both the V1 hosting side and the customer admin side.

* Add these values to the `user.config` for the customer's hosted instance:
```xml	
	<!-- CommitStream settings -->
	<add key="CommitStream.Availability" value= "available" />--><!-- unavailable|available -->
	<add key="CommitStream.Toggle" value="on" /> --><!-- or off|on -->
	<add key="CommitStream.AppUrl" value="https://devopsheroscs.azurewebsites.net/app?key=<apiKey GUID>" />
```	
* Verify that the integration loads by browsing to the customer's V1 instance and opening any asset detail lightbox. The CommitStream icon should be visible below the ActivityStream one, and when you click it, it should respond with a heading and a message about no commits found. This is fine since no commits have been pushed to the system yet. **But, there should not be an error message.**

## Configure a GitHub repository to send events to the Azure web site

This step is also manual for now. Customers will have to do this for their own GitHub resositories.

Substitute the real repo for `openAgile/CommitStream.Web` in the address below:

* Navigate to [https://github.com/openAgile/CommitStream.Web/settings/hooks](https://github.com/openAgile/CommitStream.Web/settings/hooks]
* Add a new Web hook with:
  * Payload url: `https://devopsheroscs.azurewebsites.net/api/listenerWebhook?key=<apiKey GUID>`
  * Content type: `application/json`
  * Secret: leave blank
  * Which events would you like to trigger this webhook?: `Just the push event`
  * Check the Active checkbox
* Now if you make a commit to that repository and mention a workitem that exists in your instance, like `S-01022`, then when you view that workitem in the VersionOne instance, you should see it in the sidepanel.








  
