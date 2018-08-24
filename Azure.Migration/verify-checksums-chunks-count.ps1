$chunkCount = (dir chunk* | measure).Count
echo "Number of chunk* files -> $chunkCount"

$path = '.\checksums-chunks.xml'
[xml] $xml = Get-Content $path
$entries = $xml.SelectNodes('//FILE_ENTRY')
$entriesCount = $entries.Count
echo "Number of etnries in checksums-chunks.xml -> $entriesCount"

echo "Good to go? -> $($chunkCount -eq $entriesCount)"
