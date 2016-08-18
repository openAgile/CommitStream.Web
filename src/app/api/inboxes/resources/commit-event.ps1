# Requires Powershell 3.0
#The next 4 line should be added in post-commit.bat file under hooks folder 
#SET REPOS=%1
#SET REV=%2
#SET DIR=%REPOS%/hooks
#Powershell.exe -executionpolicy remotesigned -File  %DIR%/commit-event.ps1 %REPOS% %REV%

Param(
  [string]$svnPath,
  [string]$revision
)
$repository = "PLACE REPO URL HERE"
$html_url = "PLACE BASE URL TO INSPECT YOUR REVISIONS"
$endpoint = "PLACE INBOX URL HERE"
$headers = @{"CS-SVN-Event"="Commit Event"}
$log = (svnlook log -r $revision $svnPath)
$who = (svnlook author -r $revision $svnPath)
$when = (svnlook date -r $revision $svnPath)
$changes = (svnlook changed -r $revision $svnPath)
$payload = @{  
    pretext = "Commit completed: $repoName rev. $revision"
    author = "$who"
	committer = @{
		name = "$who"
		date = "$when"
	}
	revision = "$revision"
    message = "$log"
	repository = "$repository"
	html_url = "$($html_url)$($revision)"
    changes = @($changes)
}
$json = (ConvertTo-Json $payload -Depth 99)
Invoke-RestMethod -H $headers -Uri $endpoint -Method Post -ContentType "application/json" -Body $json