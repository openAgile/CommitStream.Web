Param(
    [string]$vm_username,
    [string]$vm_password,
    [string]$vm_name = 'v1CommitStream',
    [string]$azure_service_name = 'v1CommitStream',
    [string]$scriptPath = 'Install-V1.ps1' )

cp $Env:WORKSPACE\VersionOne.Setup-Ultimate*exe .
cp $Env:WORKSPACE\VERSION .
.\Create-VersionOneChocolateyPackage.ps1

cd $Env:WORKSPACE\src\sandbox

# TODO: below should become a psake-tool or Azure Tool or something...

write-Host ("winRMCert- "+[System.DateTime]::Now.ToString("hh:mm:ss"))
$winRMCert = (Get-AzureVM -ServiceName $azure_service_name -Name $vm_name | select -ExpandProperty vm).DefaultWinRMCertificateThumbprint
$azureX509cert = Get-AzureCertificate -ServiceName $azure_service_name -Thumbprint $winRMCert -ThumbprintAlgorithm sha1

$certTempFile = [IO.Path]::GetTempFileName()
$azureX509cert.Data | Out-File $certTempFile
write-Host ("certToImport- "+[System.DateTime]::Now.ToString("hh:mm:ss"))

$certToImport = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 $certTempFile

$store = New-Object System.Security.Cryptography.X509Certificates.X509Store "Root", "LocalMachine"
$store.Certificates.Count
$store.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)
$store.Add($certToImport)
$store.Close()

write-Host ("Cleanup cert file- "+[System.DateTime]::Now.ToString("hh:mm:ss"))
Remove-Item $certTempFile

$uri = Get-AzureWinRMUri -ServiceName $azure_service_name -Name $vm_name

$secpwd = ConvertTo-SecureString $vm_password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($vm_username, $secpwd)

write-Host "Connecting to $uri"
Invoke-Command `
-ConnectionUri $uri.ToString() `
-Credential $credential `
-FilePath $scriptPath
