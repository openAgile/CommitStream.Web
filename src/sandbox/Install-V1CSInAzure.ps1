<# 
.SYNOPSIS 
    Installs VersionOne with CommitStream.
.LINK 
    https://github.com/openAgile/CommitStream.Web
.EXAMPLE 
    .\Install-V1CSInAzure.ps1
.EXAMPLE 
    .\Install-V1CSInAzure.ps1 "http://localhost/VersionOne"
.PARAMETER csversion
   Specifies which version of the CommitStreamVersionOne build to install from MyGetS-
.PARAMETER instanceUrl
   Specifies where to post an example story to once installation is finished
.PARAMETER commitStreamServiceSettingsUrl
   Specifies the location of the settings API endpoint from which VersionOne will source additional CommitStream AppSettings values. See the settingsController in the the https://github.com/openAgile/CommitStream.Web repository for full details on the expected response format of this endpoint.
.PARAMETER storySeedStart
   Specifies the Story Number that the first new story created will have. This is useful if you want to test with prepopulated data or data copied from a production environment.
#> 
param(
	$csversion=$null,
	$instanceUrl='http://v1commitstream.cloudapp.net/VersionOne',
	$commitStreamServiceSettingsUrl='http://v1commitstream-staging.azurewebsites.net/api/settings',
	$storySeedStart='47665'
)

cuninst CommitStreamVersionOne


if ($csversion -eq $null -or $csversion -eq '') {
	cinst CommitStreamVersionOne -source https://www.myget.org/F/versionone/
} else {
	cinst CommitStreamVersionOne -source https://www.myget.org/F/versionone/ -Version $csversion
}
sqlcmd -Q "use VersionOne; DBCC CHECKIDENT(NumberSource_Story, RESEED, $storySeedStart)"
sc "c:\inetpub\wwwroot\VersionOne\user.config" "<appSettings><add key=""CommitStream.ServiceSettingsUrl"" value=""$commitStreamServiceSettingsUrl"" /></appSettings>"

iisreset

iwr `
	-Uri "$instanceUrl/rest-1.v1/Data/Story" `
	-Headers @{"Authorization" = "Basic "+[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("admin:admin" ))} `
	-Method Post `
	-Body '<Asset><Attribute name="Name" act="set">Hello world!</Attribute><Relation name="Scope" act="set"><Asset idref="Scope:0"/></Relation>
</Asset>'
