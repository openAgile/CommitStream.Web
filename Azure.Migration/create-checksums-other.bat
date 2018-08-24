REM Create checksums for the files copied during the cutover window

REM !!!NOTE: Replace the chunk below with whatever the current active chunk was that was copied during the cutover window!!!
C:\CommitStream\dependencies\bin\fciv -add chunk-000589.000000 -sha1 -xml checksums-other.xml
C:\CommitStream\dependencies\bin\fciv -add .\ -type *.chk -sha1 -xml checksums-other.xml
C:\CommitStream\dependencies\bin\fciv -add .\index -sha1 -xml checksums-other.xml
