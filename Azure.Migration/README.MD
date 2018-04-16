# CommitStream Production Cutover

## Pre-Cutover Window

* Perform the steps of the scripts in https://github.com/openAgile/CommitStream.Web/tree/develop/Azure.Migration like this:
* Determine the current Master of production eventstore in the UI
* RDP into CS-PRODUCTION-1 and then from there, RDP into the current Master determined in the previous step. Make sure to enable accessing local drives in the RDP settings
  * This should make `\\tsclient\F\` accessible from the current Master.
* Open a `cmd` prompt and run the `copy_prod_data.bat` script from `C:\`
  * This should copy all files from production **except** for the currently active chunk file because it only copies read-only chunks
* Now, run the `C:\CommitStream\dependencies\bin\fciv -add data_from_production -r -sha1 -xml checksums.xml` to produce a checksum XML file
  * Copy this file back to TODO
* Now, remote into both CS-PRODUCTION-2 and CS-PRODUCTION-3 from CS-PRODUCTION-1, again enabling local drive access
* From each of these run `copy_new_to_new.bat`
  * This should copy all the files from CS-PRODUCTION-1 into 2 and 3 so that all new nodes are on par
* copy_prod_data.bat --  TODO
