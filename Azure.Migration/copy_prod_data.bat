REM 1) copy *.chk files
robocopy C:\Data\eventstore \\tsclient\F\data_from_production *.chk

REM 2) copy indexes
robocopy C:\Data\eventstore\index \\tsclient\F\data_from_production\index /mir

REM 3) copy all historical chunks
robocopy C:\Data\eventstore \\tsclient\F\data_from_production chunk*.* /ia:R
