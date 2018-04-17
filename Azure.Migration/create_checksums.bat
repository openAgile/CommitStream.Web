REM 1) create a checksum DB against all the static read-only chunk files copied pre-cutover
FOR %C IN (dir chunk*) DO C:\CommitStream\dependencies\bin\fciv -add %C -sha1 -xml checksums-chunks.xml
