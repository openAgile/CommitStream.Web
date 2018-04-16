# CommitStream Production Cutover

# TODOs

* Probably need to add IP rules for the existing `commitstream` App Service into the config for the new load balancer and TEST this connectivity prior to the cutover!
 * Way to test non-destructively: We could do this first with IPs from the `commitstream-staging` system since that is closer to `commitstream` than the `v1-cs-test` instance that we've been using. If the configuration works with BOTH sets of IPs, then we should also add in the IPs from `commitstream`. This will be necessary anway to allow `commitstream-staging` to function as it always has in our staging deployments.

## Pre-Cutover Window

Perform the steps of the scripts in this folder as follows:

* Determine the current master of production eventstore in the UI (see https://github.com/versionone/CommitStream/blob/master/environments.md for link and creds)
* RDP into `CS-PRODUCTION-1` and then from there, RDP into the current Master determined in the previous step. Make sure to enable accessing local drives in the RDP settings
  * This should make `\\tsclient\F\` accessible from the current Master.
* Open a `cmd` prompt and run the `copy_prod_data.bat` script from `C:\`
  * This should copy all files from production **except** for the currently active chunk file because it only copies read-only chunks
* Now, run the `https://github.com/openAgile/CommitStream.Web/blob/develop/Azure.Migration/create_checksums.bat` to produce a checksum XML file
  * Copy this file back to the current master into the `C:\Data` folder
    * **NOTE**: It's important that we produce the checksums on the target machine, but then run the verification on the source. We cannot produce the verification on the source because some files will still be in use and it will lead to unreliable results.
  * Open a Powershell prompt and go to `C:\Data`
  * Run the script `split-checksums.ps1` in that folder, which will produce two distinct files, `checksums-chunks.xml` and `checksums-others.xml`.
  * Run `verify_checksums_chunks.bat` to verify only the chunks that were copied (minus the current active one)
    * If for some reason, more than just the current active chunk has been modified since the copy, then you may need to adjust the script
* Now, remote into both `CS-PRODUCTION-2` and `CS-PRODUCTION-3` from `CS-PRODUCTION-1`, again enabling local drive access
* From each of these run `copy_new_to_new.bat`
  * This should copy all the files from CS-PRODUCTION-1 into 2 and 3 so that all new nodes are on par
* Now, copy the original `checksums.xml` file to both nodes 2 and 3 into the `F:\data_from_production` folder.
* Run the `verify_checksums.bat` file which will verify all the files, which is OK since nothing is changing at this point

TODO:

* Verification of "others", the .chks and index files
* Cut-over steps like turning off the service, running the copy script again which should copy all changed files plus the active chunk
* Any possible reverification steps needed
* QUESTION: Maybe we should have the `data_from_production` inside of `F:\Data` so that we can just rename the `F:\Data\eventstore` to `F:\Data\eventstore-old` to avoid another copy or move operation on the OS. (I assume a rename is potentially less destructive than a copy or move, but probably not a big deal either way)
* Restarting that services on all nodes
* Repointing the production `commitstream` app service to the new gateway IP address for the new production EventStore cluster
* Smoke tests with our own instance
