REM 1) copy *.chk files
robocopy C:\Data\eventstore \\tsclient\F\data_from_production *.chk

REM 2) copy indexes
robocopy C:\Data\eventstore\index \\tsclient\F\data_from_production\index /mir

REM 3) copy all historical chunks that are read-only, which ignores the currently-active one. Just remove the /ia:R to get that one since the default behavior is to ignore files that have not been changed
robocopy C:\Data\eventstore \\tsclient\F\data_from_production chunk*.* /ia:R
