$path = 'F:\checksums.xml'
 
[xml] $xml = Get-Content $path
$chkXml = $xml.Clone()

$fciv = $xml.FCIV
$fcivChk = $chkXml.FCIV
$fcivChk.RemoveAll()

$names = $xml.SelectNodes('//name')

foreach($name in $names) {
    $name.InnerText = $name.InnerText -replace 'data_from_production', 'eventstore'
    if ($name.InnerText -match '.chk') {
        $fcivChk.AppendChild($fcivChk.OwnerDocument.ImportNode($name.ParentNode.Clone(), $true))
        $fciv.RemoveChild($name.ParentNode)
    }
}

$xml.Save("F:\checksums-chunks.xml")
$chkXml.Save("F:\checksums-chks.xml")
