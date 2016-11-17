Param(
[string]$change,
[string]$user,
[string]$client,
[string]$server
)

$p4AdminUser = "ADMINISTRATOR CREDENTIALS HERE"
$p4AdminPass = "ADMINISTRATOR CREDENTIALS HERE"

$repository = "PLACE REPO URL HERE"
$html_url = ""
$endpoint = "PLACE INBOX URL HERE"
$headers = @{"CS-P4V-Event"="Commit Event"}

$changeListEvent = @()

$changeListEvent = (P4 -c $client -p $server -u $p4AdminUser -P $p4AdminPass describe -s -f "$change") -split '[\r\n]'

$ndx = [array]::IndexOf($changeListEvent, 'Affected files ...')
$affectedFiles = @()

for($i = $ndx+1; $i -lt $changeListEvent.Length; $i++) {
    if($changeListEvent[$i] -ne '') {
        $affectedFiles += $changeListEvent[$i]
    }
}

$message = $changeListEvent[2..($ndx-2)]

$authorDate = ($changeListEvent[0] -split ' ') |? {$_ -ne ''}

$author = $authorDate[3]
$date =  $authorDate[5] + ' ' + $authorDate[6]

$payload = @{
    author = "$author"
    committer = @{
        name = "$author"
        date = [DateTime]::SpecifyKind("$date", "Utc").ToString("yyyy-MM-ddTHH:mm:ssZ")
    }
    revision = "$change"
    message = "$message"
    repository = "$repository"
    html_url = "$($html_url)$($change)"
    changes = $affectedFiles
}
$json = (ConvertTo-Json $payload -Depth 99)
Invoke-RestMethod -H $headers -Uri $endpoint -Method Post -ContentType "application/json" -Body $json