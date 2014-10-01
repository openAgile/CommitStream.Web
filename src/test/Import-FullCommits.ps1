param($accessToken)

. .\helpers.ps1

$repoUrl = "https://api.github.com/repos/kunzimariano/CommitService.DemoRepo"
$eventStore = 'http://127.0.0.1:2113'
$eventStore += '/streams/github-events'

function Get-CommitsLinks {
    $currentUrl = "$repoUrl/commits?per_page=100&page=1"
    $commitsUrls = @()

    do {
        $currentUrl = Get-AccesToken $currentUrl $accessToken
        $response = Invoke-WebRequest -Uri $currentUrl
        
        (ConvertFrom-Json $response.Content) | % {
            $commitsUrls += $_.url
        }


        $currentUrl = Get-NextLink $response.Headers
        

    } while($currentUrl -ne $null)

    $commitsUrls
}

function Import-FullCommits {
    param($links)

    $commitsEvents = @()
    
    for($i = ($links.Length -1); $i -gt -1; $i--) {
        $currentUrl = Get-AccesToken ($links[$i]) $accessToken
        $response = Invoke-WebRequest -Uri $currentUrl

        $commit = ConvertFrom-Json $response.Content        
        $commitsEvents += Get-EsCommitEvent $commit        
    }

    $events = ConvertTo-Json $commitsEvents -Depth 6
    $auth = Get-AuthorizationHeader
    $headers = @{
        "Accept" =  "application/json";
        "Content-Type" = "application/vnd.eventstore.events+json";
        "Content-Length" =  $esEvents.Length;
        "Authorization" = $auth
    }
    
    Invoke-WebRequest -Body $events -Uri $eventStore -Method Post -Headers $headers

}

    
Import-FullCommits (Get-CommitsLinks)
