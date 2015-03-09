This document describes the manual steps necessary to configure a CommitStream instance for a customer. It's intended to serve as a temporary approach for getting early feedback from customers while we develop a robust and secure multi-tenant hosting model.

# Steps

## Create a new virtual machine to host EventStore from a saved image

Normally, you can just clone the base virtual machine image that already has EventStore loaded. However, to create a virtual machine from scratch, see the section **How to create a virtual machine to host EventStore from scratch** below.

* Start creating a new Virtual Machine and select **From gallery**, like so:

![VM from gallery](https://s3.amazonaws.com/uploads.hipchat.com/12722/130235/xabinc0jrpxk0HV/VM%20from%20gallery.png)

* In the wizard, for **Choose an Image**, first pick **MY IMAGES**, and then select `v1cs-base` and press next
* Specify a **machine name**, starting with `v1cs-`. Example, for a customer named `devopsheros`, name it `v1cs-devopsheros`
* Tier: `Standard`
* Size: `A2 3.5 GB`
* Region: `US East 2`
* Add a firewall port named `eventstore` with private and public TCP ports for `2113`.
* Finally, leave VM Agent checked for `The VM agent that supports extensions is already installed.`
* Click the **Complete** checkmark to start the new VM

### Important: Add the VM to the exclusion list for the Azure Instances Stopper Jenkins job
* Go to [https://ci-server/job/Azure%20VM%20Instances%20Stopper/](https://ci-server/job/Azure%20VM%20Instances%20Stopper/)
* Under **Build** modify the `Stop-AllAzureInstances @("sqlSandbox*","v1commitstream","VmTFS2013","v1cs-test")` by adding `,"v1cs-devopsheros"` to the list.

Now, continue to the next step to modify the IP address for your new clone.

# Update IP address for a VM that has been rebooted or created from a clone

When Azure restarts a Virtual Machine or creates a new machine from a clone, you will need to login and change a file for EventStore in order for it to bind to the new IP address that Azure assigns to it.

* From the Azure portal, select the virtual machine and **Start** it, then view its **Dashboard**
* Take note of the `INTERNAL IP ADDRESS` value. For example:

![INTERNAL IP ADDRESS](https://s3.amazonaws.com/uploads.hipchat.com/12722/130235/MDrjM4yaRysPuAQ/INTERNAL%20IP%20ADDRESS.png)

* Click the **Connect** link to open a Remote Desktop connection to the system. Use the standard Azure VM login credentials -- ask in #openAgile channel on Slack to find these.
* From the desktop of the machine, open the file `C:\Program Files\eventstore\config.yml` with Notepad.
* Modify the file to have the correct `INTERNAL IP ADDRESS` for the `ExtIp` value:

```yaml
Db: C:\Program Files\eventstore\Data
Log: C:\Program Files\eventstore\Log
RunProjections: ALL
ExtIp: INTERNAL.AZURE.IP.ADDRESS
HttpPrefixes:
 - https://localhost:2113/
 - https://MACHINENAME.cloudapp.net:2113/
```
* For example, here is a complete file for a machine named `v1cs-se`:

```yaml
Db: C:\Program Files\eventstore\Data
Log: C:\Program Files\eventstore\Log
RunProjections: ALL
ExtIp: 100.75.252.17
HttpPrefixes:
 - https://localhost:2113/
 - https://v1cs-se.cloudapp.net:2113/
```
* Now, verify that EventStore is running normally by browsing to [https://localhost:2113](https://localhost:2113) from within the VM. If it does not respond, you may need to reset the EventStore service by opening **Powershell As Administrator** and typing: `nssm restart eventstore`.
* Now, change the admin account EventStore password through the EventStore UI at [https://localhost:2113](https://localhost:2113). **Note**: the UI has a bug, so you must specify **https://localhost:2113** in the first field on the login screen. The default credentials are admin / changeit. Use a newly generated GUID for the admin account password. This value will also serve as the `eventStorePassword` value below within the Azure Web Site. You can generate a GUID in PowerShell by typing  `[guid]::NewGuid()` or by using the web site [http://www.uuigenerator.net](http://www.uuigenerator.net).

## Create code branch for the customer instance

* Given a customer named DevOpsHeros:
* Create a new branch named **devopsheros** from the [master](https://github.com/openAgile/CommitStream.Web/tree/master) branch in this repository
* Push the newly created **devopsheros** branch to the remote with `git push origin devopsheros`. You will see a newly created branch up on GitHub.
* Example Git Bash commands for this:
```bash
git clone https://github.com/openAgile/CommitStream.Web.git
cd CommitStream.Web/
git checkout master
git branch devopsheros
git checkout devopsheros
git push origin devopsheros
```

## Create the Azure web site to host the customer instance
* Create a new web site in the [Azure Dev account portal](https://manage.windowsazure.com/VersionOne.onmicrosoft.com#Workspaces/All/dashboard) named `v1cs-devopsheros`
* Configure the site's App Settings so that it knows where to find its EventStore instance with these settings
  * First, create a new GUIDs, this time for the service `apiKey`. Again, in powershell you can type `[guid]::NewGuid()`. 
  * Then, add these App Settings to the site
	* protocol : `https`
	* apiKey: `apiKey`
	* eventStoreBaseUrl: `https://devopsheroscs.cloudapp.net:2113`
	* eventStoreUser `admin`
	* eventStorePassword: `eventStorePassword`
	* eventStoreAllowSelfSignedCert: `true`
* From the site's Dashboard, select **Set up deployment from source control**, and choose GitHub, then after authorizing, select [https://github.com/openAgile/CommitStream.Web](openAgile/CommitStream.Web) on the `devopsheros` branch
  * **Note:** If you need access to the repo ask Josh in HipChat
  * Verify that the deployment worked in the web site details view
  * Verify that the site is working by querying in your browser: [https://devopsheroscs.azurewebsites.net/api/query?key=&lt;apiKey GUID&gt;&workitem=S-11111](https://devopsheroscs.azurewebsites.net/api/query?key=apiKey&workitem=S-11111). You should get an empty `{commits:[]}` message back, since no commits have been sent to this system yet.

## Create a Digest and Inboxes the GitHub repositories you want to send messages to CommitStream

### Using [curl](http://curl.haxx.se/) or another equivalent HTTP client, execute the following to create a new Digest:

```shell
curl -i -X POST \
  -H "Content-Type:application/json" \
  -d \
'{
 "description": "My First Digest"
}' \
'http://localhost:6565/api/digests?key=apiKey'
```

Here's a complete example where the apiKey is specified:

```shell
curl -i -X POST \
  -H "Content-Type:application/json" \
  -d \
'{
 "description": "My First Digest"
}' \
'http://localhost:6565/api/digests?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7'
```

Expect a response like:

```json
{
    "_links": {
        "self": {
            "href": "http://localhost:6565/api/digests/f575d8df-681b-4a0d-aa9d-a42e97d1b2f1"
        },
        "digests": {
            "href": "http://localhost:6565/api/digests"
        },
        "inbox-create": {
            "href": "http://localhost:6565/api/inboxes",
            "method": "POST",
            "title": "Endpoint for creating an inbox for a repository on digest f575d8df-681b-4a0d-aa9d-a42e97d1b2f1."
        }
    },
    "digestId": "f575d8df-681b-4a0d-aa9d-a42e97d1b2f1"
}
```
Copy the **digestid** property to your clipboard to use in the next step.

### Create an Inbox for each GitHub repository that you want to send messages to CommitStream by executing the following:

```shell
curl -i -X POST \
  -H "Content-Type:application/json" \
  -d \
'{
 "digestId": "digestId",
 "family": "GitHub",
 "name": "Inbox name",
 "url": "GitHub repository URL"
}' \
'http://localhost:6565/api/inboxes?key=apiKey'
```

Complete example:

```shell
curl -i -X POST \
  -H "Content-Type:application/json" \
  -d \
'{
 "digestId": "f575d8df-681b-4a0d-aa9d-a42e97d1b2f1",
 "family": "GitHub",
 "name": "My First Inbox",
 "url": "http://github.com/somewhere"
}' \
'http://localhost:6565/api/inboxes?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7'
```

Expect a response like:

```json
{
    "_links": {
        "self": {
            "href": "http://localhost:6565/api/inboxes/f83e0382-b0b4-483a-bb0d-d1a9efe64fd8"
        }
    },
    "inboxId": "f83e0382-b0b4-483a-bb0d-d1a9efe64fd8"
}
```
#### Add a Webhook to the GitHub repository to configure it to send messages to the Inbox

GitHub has a feature called Webhooks which allow you to instruct a GitHub repository to send messages in response to events out to remote HTTP servers. This is how GitHub integrates with CommitStream. Technical documentation about Webhooks [is available here](https://developer.github.com/webhooks/) in GitHub's help pages.

* Copy the URL from the API response in the `_links.self.href` property and tack on the correct `?key=apiKey` parameter to the end.
  * Format: `http://localhost:6565/api/inboxes/inboxId?key=apiKey`
  * Complete example: `http://localhost:6565/api/inboxes/f83e0382-b0b4-483a-bb0d-d1a9efe64fd8?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7`
* Go to the Webhooks settings page for your repository. Note that if your repository were named **http://github.com/somewhere**, you'll find the Webhooks page at [http://github.com/somewhere/settings/hooks](http://github.com/somewhere/settings/hooks)
* Click **Add webhook**, and specify these parameters:
  * Payload url: `http://localhost:6565/api/inboxes/inboxId?key=apiKey`
  * Content type: `application/json`
  * Secret: leave blank
  * Which events would you like to trigger this webhook?: `Just the push event`
  * Check the Active checkbox

##### Verify integration by pushing a commit into the GitHub repository and view it in CommitStream 
  
* Now if you make a commit to that repository and mention a workitem that exists in your instance, like `S-01022`, then you should now be able to see this appear at [http://localhost:6565?key=apiKey&workitem=S-0122](http://localhost:6565?key=apiKey&workitem=S-01022).
  * Complete example: [http://localhost:6565?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7&workitem=S-01022](http://localhost:6565?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7&workitem=S-01022)
* If you mention a different workitem, you can correspondingly view that workitem's stream by changing the **workitem** parameter value.
* And, to see the workitems for **all mentioned workitems**, then use this URL which includes the **digestId**: [http://localhost:6565?key=apiKey&workitem=all&digestId=digestId](http://localhost:6565?key=apiKey&workitem=all&digestId=digestId)
  * Complete example: [http://localhost:6565?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7&workitem=all&digestId=f575d8df-681b-4a0d-aa9d-a42e97d1b2f1](http://localhost:6565?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7&workitem=all&digestId=f575d8df-681b-4a0d-aa9d-a42e97d1b2f1)
* To make this appear in a VersionOne instance within the sidepanel of a workitem detail view and in a TeamRoom, see the **Configure VersionOne instance** section below.

##  Configure VersionOne instance

At this time, configuration in VersionOne is manually applied to the `user.config` file. It uses three settings. The longer-term goal is that the first two of these will enable fine-grained control from both the V1 hosting side and the customer admin side.

* Add these values to the `user.config` for the customer's hosted instance:
```xml	
	<!-- CommitStream settings -->
	<add key="CommitStream.Availability" value= "available" />--><!-- unavailable|available -->
	<add key="CommitStream.Toggle" value="on" /> --><!-- or off|on -->
	<add key="CommitStream.AppUrl" value="https://devopsheroscs.azurewebsites.net/app?key=apiKey" />
```	
* Verify that the integration loads by browsing to the customer's V1 instance and opening any asset detail lightbox. The CommitStream icon should be visible below the ActivityStream one, and when you click it, it should respond with a heading and a message about no commits found. This is fine since no commits have been pushed to the system yet. **But, there should not be an error message.**

## How to create a virtual machine to host EventStore from scratch

* In the [Azure Dev account portal](https://manage.windowsazure.com/VersionOne.onmicrosoft.com#Workspaces/All/dashboard), create a new Windows Virtual machine with:
  * DNS Name: `devopsheroscs`
  * Image: `Windows Server 2012 R2 Datacenter`
  * Size: `Standard A2 (2 Cores, 3.75 GB)` TODO: is this really big enough?
  * Username, Password fields: **Ask Josh in HipChat, as this might need to be standard for Jenkins jobs**
  * Affinity Group: `East US 2`
* Once this machine is up and running, [log into it with Remote Desktop](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-log-on-windows-server/) and then install EventStore using the [automated script documented here](install.md). Note you will execute the script without the GitHub access token since you do not need to import commits from our default repository at this time.
* Verify that eventstore is up and running as a service by navigating to http://localhost:2113 and logging in with admin / changeit

### Important: Add the VM to the exclusion list for the Azure Instances Stopper Jenkins job
* Go to [https://ci-server/job/Azure%20VM%20Instances%20Stopper/](https://ci-server/job/Azure%20VM%20Instances%20Stopper/)
* Click Configure to get into the configuration options
* Under the **Build** section modify the `Stop-AllAzureInstances @("sqlSandbox*","v1commitstream","VmTFS2013","v1cs-test")` by adding `,"devopsheros"` to the list.

###Set up EventStore to use https###
* Assuming you followed the script linked above, you should have installed Chocolatey. Now install the Windows 8 SDK with: `choco install windows-8-1-sdk`
* In Powershell, navigate to the installation location for the SDK. On my machine it is: `C:\Program Files (x86)\Windows Kits\8.1\bin\x64`. If you cannot find it, do a file search for `makecert.exe`.
* Now, use `makecert.exe` to generate a self-signed certificate to secure EventStore on the machine:
```text
makecert -ss My -sr LocalMachine -sky exchange -r -n "CN=EventStoreCert" -sk EventStoreCert -pe
certmgr.exe -add -r LocalMachine -s My -c -n EventStoreCert -r CurrentUser -s My
```
* First, open PowerShell and create a new GUID to use in place of the hard-coded `appid={00112233-4455-6677-8899-AABBCCDDEEFF}` value below. Type `[guid]::NewGuid()` to genreate the GUID. This particular value is not needed anywhere else.
* Next, in the Windows Certificate Manager (go to the start menu and type certmgr.msc) open the imported certificate and copy the Thumbprint hash, without spaces, and use in place of the hard-coded `certhash` in the steps below. Make sure to use no quotes or brackets around `certhas`, but **do** keep the curly braces around the GUID for `appid`.

Commands:

```text
netsh 
http
add sslcert ipport=0.0.0.0:2113 certhash=thumbhere appid={00112233-4455-6677-8899-AABBCCDDEEFF}
```
   * Change the EventStore admin password by generating a new guid, which will also serve as the `eventStorePassword` value below. Again, in PowerShell you can type `[guid]::NewGuid()`.
   * Update the config.yml file for eventstore. Ensure that it has the right HttpPrefixes and the external ip for your VM. The value for ExtIp is actually what in azure shows as "INTERNAL IP ADDRESS". Dashboard tab of your VM:
``` 
ExtIp: INTERNAL.AZURE.IP.ADRESS
HttpPrefixes:
  - https://localhost:2113/
  - https://your.azure.dns.name:2113/
```
   * Verify that EventStore now operates only over https:// and not http://

### Update default ACLs for user streams in EventStore

Using curl, the script to create the $settings stream is:

```
$ curl -i -d @settings.json "https://localhost:2113/streams/%24settings" -u admin:PASSWORD -H "Content-Type: application/json" -H "ES-EventType: SettingsUpdated" -H "ES-EventId: SOME_GUID_HERE" --insecure
``` 
You can get a new unique GUID from https://www.uuidgenerator.net/
 
And where settings.json is:
 
```json
{
  "$userStreamAcl" : {
  "$r" : "$admins",
  "$w" : "$admins",
  "$d" : "$admins",
  "$mr" : "$admins",
  "$mw" : "$admins"
  },
  "$systemStreamAcl" : {
  "$r" : "$admins",
  "$w" : "$admins",
  "$d" : "$admins",
  "$mr" : "$admins",
  "$mw" : "$admins"
  }
}
```
The command to test in curl is:
 
`$ curl -v https://localhost:2113/streams/github-events --insecure -u admin:PASSWORD -H "Accept: application/json"`
 
And to test without auth just drop the -u parameter:
 
`$ curl -v https://localhost:2113/streams/github-events --insecure -H "Accept: application/json"`
 
`--insecure` is only because we self-signed the SSL cert.

### Open the necessary ports so EventStore can be seen from the outside###

* In the azure portal go to the endpoints tab of your VM.
* Add port 2113 and label it `EventStore`.
* From the VM, use Windows Advanced Firewall to add the same 2113 and name it `EventStore`.
* Load EventStore and then go to the Projections tab and click **Enable All** to start the system projections.
