# CommitStream Production Cutover

## Pre-Cutover Window

Perform the steps of the scripts in this folder as follows:

* Determine the current master of production eventstore in the UI (see https://github.com/versionone/CommitStream/blob/master/environments.md for link and creds)
* RDP into `CS-PRODUCTION-1` and then from there, RDP into the current Master determined in the previous step. Make sure to enable accessing local drives in the RDP settings
  * This should make `\\tsclient\F\` accessible from the current master
* Open a `cmd` prompt and run the `copy_prod_data.bat` script from `C:\`
  * This should copy all files from production **except** for the currently active chunk file because it only copies read-only chunks
* Now, run `create-checksums-chunks.bat` from the `F:\Data\data_from_commitstream` folder to produce the `checksums-chunks.xml` file
  * Run `verify-checksum-chunks-count.ps1` to ensure that there are the same number of chunks in the directory and the XML file produced by the previous command
    * **NOTE**: It's important that we produce the checksums on the target machine, but then run the verification on the source. We cannot produce the verification on the source because some files will still be in use and it will lead to unreliable results.
  * Copy `checksums-chunks.xml` back to the current master into the `C:\Data\eventstore` folder
  * Run `verify_checksums_chunks.bat` to verify only the chunks that were copied (minus the current active one)
    * If for some reason, more than just the current active chunk has been modified since the copy, then you may need to adjust the script
* If everything verifies, then from `CS-PRODUCTION-1` remote into both `CS-PRODUCTION-2` and `CS-PRODUCTION-3`, again enabling local drive access
* From each of these run `copy_new_to_new.bat`
  * This should copy all the files from `CS-PRODUCTION-1` into 2 and 3 so that all new nodes are on par
* Run the `verify_checksums_chunks.bat` file from that folder which will verify the chunks  will verify all chunks (the xml file will have already been copied from the previous command)
* If everything verifies well, then it's time to **CUTOVER!**

## Cutover Window

* From each of the `CS-PRODUCTION` new nodes, run the following commands respectively (starting with its own current master which you identify by logging into http://localhost:2113 with the same production password linked at the top above)
  * `cs-production-1`: `net stop cs-production-1`
  * `cs-production-2`: `net stop cs-production-2` 
  * `cs-production-3`: `net stop cs-production-3`
* Login to each of the current production nodes and open an Administrator command prompt and get the following commands **READY, BUT DO NOT RUN THEM YET** on each respective node, starting with the current master as determined above:
  * `eventstore-01`: `net stop es-cluster1`
  * `eventstore-02`: `net stop es-cluster2`
  * `eventstore-03`: `net stop es-cluster3`
* Stop the `commitstream` production App Service in Azure
* Run the commands you just prepared on all the production nodes
* With the services off, check which of the chunk files exist there that have not yet been copied to the new nodes. It's probably just one file. Check to see if they are **NOT** read-only. If they are not read-only, manually change them to be, but keep note of which ones you changed because you will need to clear the read-only flag when we bring the nodes up again
  * This is important because the script that we're about to rerun only copies read-only chunks
* From the current master run the same `copy_prod_data.bat` script as above
  * This time it should copy a much smaller number of files over to `CS-PRODUCTION-1`, including the current active chunk if you remembered to set the read-only flag on it
  * Then, from new nodes 2 and 3, re-run the `copy_new_to_new.bat` script
  * This time, it should copy only the files that have changed or were added since the first time we ran it
* Now is where it gets fun:
  * On the current master, run a checksum specifically on the chunk that was changed, using the form of `C:\CommitStream\dependencies\bin\fciv -add the_chunk_here -sha1 -xml checksums_new.xml`
    * If more than one chunk was changed, then adjust as needed
  * Copy this file onto new nodes 1, 2, and 3
  * From each node, run `C:\CommitStream\dependencies\bin\fciv -v -sha1 -xml checksums_new.xml
  * Back on the current master, run the `verify_checksums_others.bat`. This may indeed produce failures because of changed files during the time we were copying files before. If it does, then generate new checksums for each of the failed files one by one.
    * If it did fail, then copy those new checksums over to nodes 1, 2, and 3 because we will want to run them there to make sure that our newly copied files match the current versions
* On new 1, 2, and 3 nodes from `F:\Data`, run this command: `rename eventstore eventstore.old` to relocate the current data
* On those nodes, now run `rename data_from_production eventstore`
* For each of the respective nodes, type out these commands and get them ready in each node, and then run them in close succession:
  * `cs-production-1`: `net start cs-production-1`
  * `cs-production-2`: `net start cs-production-2` 
  * `cs-production-3`: `net start cs-production-3`
* Also, restart them on the old nodes just in case we need to flip back in the case of failure:
  * `eventstore-01`: `net start es-cluster1`
  * `eventstore-02`: `net start es-cluster2`
  * `eventstore-03`: `net start es-cluster3`
* Monitor the amount of time it takes the chunk verification to take place on the new nodes by opening the database log file. It should take between 10 and 20 minutes.
* Once that finishes you should be able to login with the PROD credentials to the EventStore console. If projections are all 100%, then you are good to continue
* Once it's up and running, repoint the `commitstream` App Service's `eventStoreBaseUrl` to `http://52.170.34.8:2113` and flip it on!
* Check that `https://commitstream.v1host.com/health/projections` is working
* Also check that we can load our openAgile Team Room digests for Core and OA
* If all this passes, then it's a success, and if it doesn't then repoint the App Service to the current cluster and go back to the drawing board!


## Example test checklist output

This was done without turning off production, so it's not going to be quite the same thing in practice, but I think we should be able to just copy the chunk files that do not ALREADY exist in the checksums XML file that's already on the new nodes and the newer .chk and index folder files. I'm suspecting those files will change after the production nodes get turned off.

```
OK: Current master is eventstore-02
OK: Remoted to cs-production-1
OK: From there, remoted to eventstore-02
OK: Run copy_prod_data.bat  
    OK: 4 *.chk files copied
    OK: 6 index\** files copied
    OK: 103 chunk* files out of 104 (expected)
    Duration: 0:31:51
OK: Run create-checksums-chunks.bat from F:\Data\data_from_production
OK: Run verify-checksum-chunks-count.ps1 from a Powershell
    Details: 103 chunk files and 103 FILE_ENTRY items in the XML
OK: Copy checksums-chunks.xml to eventstore-02 C:\Data\eventstore
OK: Run verify_checksums_chunks.bat from C:\Data\eventstore
    Details: All files verified successfully
OK: From cs-production-1 remote into cs-production-2
OK: From cs-production-1 remote into cs-production-3
OK: Run copy_new_to_new.bat on cs-production-2
    Details: 
        Dirs copied: 2
        Files copied: 115
        Duration: 0:21:31
OK: Run copy_new_to_new.bat on cs-production-3
    Details:
        Dirs copied: 2
        Files copied: 115
        Duration: 0:23:51
OK: On cs-production-2 run verify_checksums_chunks.bat from F:\Data\data_from_production
    Details: All files verified successfully (about 18 minutes)
OK: On cs-production-3 run verify_checksums_chunks.bat from F:\Data\data_from_production
    Details: All files verified successfully (about 15 minutes)
OK: Run original copy_prod_data.bat on eventstore-2
    Details: copied to cs-production-1 one new finalized chunk that was closed during the previous run (as expected), and did not touch the new active one
OK: Run copy_new_to_new.bat on both cs-production-2 and cs-production-3
    Details: copied over the same chunk from above
OK: On new nodes rename `eventstore` data folder to `eventstore.old`
OK: On new nodes rename `data_from_production` to `eventstore`
OK: On new nodes replace truncate.chk with copy of chaser.chk
OK: Start the eventstore service on the new nodes
OK: Time the chunk verification process
    Details: Verifying 104 chunks took about 13 minutes, a vast improvement over current production
OK: Login to a node and verify all projections running
OK: Load the OA digest details view via commitstream-staging and v1-cs-test
```
