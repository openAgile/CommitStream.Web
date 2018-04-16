# CommitStream Production Cutover

# TODOs

## Pre-Cutover Window

Perform the steps of the scripts in this folder as follows:

* Determine the current master of production eventstore in the UI (see https://github.com/versionone/CommitStream/blob/master/environments.md for link and creds)
* RDP into `CS-PRODUCTION-1` and then from there, RDP into the current Master determined in the previous step. Make sure to enable accessing local drives in the RDP settings
  * This should make `\\tsclient\F\` accessible from the current master
* Open a `cmd` prompt and run the `copy_prod_data.bat` script from `C:\`
  * This should copy all files from production **except** for the currently active chunk file because it only copies read-only chunks
* Now, run `create_checksums.bat` from the `F:\Data` folder to produce a checksum XML file
  * Copy this file back to the current master into the `C:\Data` folder
    * **NOTE**: It's important that we produce the checksums on the target machine, but then run the verification on the source. We cannot produce the verification on the source because some files will still be in use and it will lead to unreliable results.
  * Open a Powershell prompt and go to `C:\Data`
  * Run the script `split-checksums.ps1` in that folder, which will produce two distinct files, `checksums-chunks.xml` and `checksums-others.xml`
  * Run `verify_checksums_chunks.bat` to verify only the chunks that were copied (minus the current active one)
    * If for some reason, more than just the current active chunk has been modified since the copy, then you may need to adjust the script
* Now, remote into both `CS-PRODUCTION-2` and `CS-PRODUCTION-3` from `CS-PRODUCTION-1`, again enabling local drive access
* From each of these run `copy_new_to_new.bat`
  * This should copy all the files from CS-PRODUCTION-1 into 2 and 3 so that all new nodes are on par
* Now, copy the original `checksums.xml` file to both nodes 2 and 3 into the `F:\Data` folder
* Run the `verify_checksums.bat` file which will verify all the files, which is OK since nothing is changing at this point
* If everything verifies well, then it's time to **CUTOVER!**

## Cutover Window

* Stop the `commitstream` production App Service in Azure
* Login to each of the current production nodes and open an Administrator command prompt and run the following commands on each respective node, starting with the current master as determined above:
  * `eventstore-01`: `net stop es-cluster1`
  * `eventstore-02`: `net stop es-cluster2`
  * `eventstore-03`: `net stop es-cluster3`
* With the services off, check on the current master to see that **all** of the chunk files have the read-only flag set. If they do not, you should set it manually
  * This is important because the script that we're about to rerun only copies read-only chunks
  * Keep note of the files that were not read-only, and after you run the next command you should **unset the read-only flag** after the copies all reside on nodes 1, 2, and 3 in the new production nodes
* From each of the `CS-PRODUCTION` new nodes, run the following commands respectively (starting with its own current master which you identify by logging into http://localhost:2113 with the same production password linked at the top above)
  * `cs-production-1`: `net stop cs-production-1`
  * `cs-production-2`: `net stop cs-production-2` 
  * `cs-production-3`: `net stop cs-production-3`
* From `CS-PRODUCTION-1` run the same `copy_prod_data.bat` script as above
  * This time it should copy a much smaller number of files, including the current active chunk if you remembered to set the read-only flag on it
* Then, from new nodes 2 and 3, re-run the `copy_new_to_new.bat` script
  * This time, it should copy only the files that have changed or were added since the first time we ran it
* Now is where it gets fun:
  * On the current master, run a checksum specifically on the chunk that was changed, using the form of `C:\CommitStream\dependencies\bin\fciv -add the_chunk_here -sha1 -xml checksums_new.xml`
    * If more than one chunk was changed, then adjust as needed
  * Copy this file onto new nodes 1, 2, and 3
  * From each node, run `C:\CommitStream\dependencies\bin\fciv -v -sha1 -xml checksums.xml
  * Back on the current master, run the `verify_checksums_others.bat`. This may indeed produce failures because of changed files during the time we were copying files before. If it does, then generate new checksums for each of the failed files one by one.
    * If it did fail, then copy those new checksums over to nodes 1, 2, and 3 because we will want to run them there to make sure that our newly copied files match the current versions
  
TODO

* Verification of "others", the .chks and index files
* Cut-over steps like turning off the service, running the copy script again which should copy all changed files plus the active chunk
* Any possible reverification steps needed
* Restarting that services on all nodes
* Repointing the production `commitstream` app service to the new gateway IP address for the new production EventStore cluster
* Smoke tests with our own instance
