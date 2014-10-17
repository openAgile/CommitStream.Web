function Get-AuthorizationHeader {
    $username = 'admin'
    $password = 'changeit'
    $auth = 'Basic ' + [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($username+":"+$password ))
    $auth
}

function Get-EStoreEvents {
    param($events)
    $result = @()
    $events | % {
        $guid = ([guid]::NewGuid()).ToString()
        $e = [pscustomobject]@{
            eventId = $guid;
            eventType = 'github-event';
            data = $_
        }
        $result += $e
    }
    ConvertTo-Json $result -Depth 6
}

function Get-EsCommitEvent {
    param($commit)

    $guid = ([guid]::NewGuid()).ToString()
    $event = [pscustomobject]@{
        eventId = $guid;
        eventType = 'github-event';
        data = $commit
    }

    $event    
}

function Get-LinkHeader {
    param($headers)

    if($headers.ContainsKey('Link')) {
        $headers['Link']
    }
    else {
        $null
    }
}

function Get-NextLink {
    param($headers)

    $link = Get-LinkHeader $headers

    if($link -eq $null) {
        return $null
    }

    $result = $null
    $link.Split(',') | % {
        $parts = $_.Split(';')
        if ($parts[1].Trim() -eq 'rel="next"') {
            $result = $parts[0].Replace('<','').Replace('>','')
        }
    }
    $result
}

function Get-AccesToken {
    param($url,$accessToken)

    #ugly
    if($accessToken -ne $null){
        if($accessToken.Contains('?')) {
            $url += "&access_token=$accessToken"
        }
        else{
            $url += "?&access_token=$accessToken"   
        }
    }
    $url
}
