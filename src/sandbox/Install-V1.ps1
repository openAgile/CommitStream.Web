<# 
.SYNOPSIS 
    Installs VersionOne with CommitStream.
.LINK 
    https://github.com/openAgile/CommitStream.Web
.EXAMPLE 
    .\Install-V1.ps1 
.EXAMPLE 
    .\Install-V1.ps1 "http://localhost/VersionOne"
.PARAMETER instanceUrl
   Specifies where to post an example story to once installation is finished
.PARAMETER commitStreamAppUrl
   Specifies where the app.js file gets served from the Node.js server present in the https://github.com/openAgile/CommitStream.Web repository. This actually serves the CommitStream side-panel content for the VersionOne application.
.PARAMETER storySeedStart
   Specifies the Story Number that the first new story created will have. This is useful if you want to test with prepopulated data or data copied from a production environment.
#> 
param(
	$instanceUrl='http://v1commitstream.cloudapp.net/VersionOne',
	$commitStreamAppUrl='//v1commitstream.azurewebsites.net/app.js',
	$storySeedStart='47665'
)

cuninst CommitStreamVersionOne
cinst CommitStreamVersionOne -source https://www.myget.org/F/versionone/
sqlcmd -Q "use VersionOne; DBCC CHECKIDENT(NumberSource_Story, RESEED, $storySeedStart)"
sc "c:\inetpub\wwwroot\VersionOne\user.config" "<appSettings><add key=""CommitStream.Availability"" value=""available"" /><add key=""CommitStream.Toggle"" value=""on"" /><add key=""CommitStream.AppUrl"" value=""$commitStreamAppUrl"" /></appSettings>"

iisreset

iwr `
	-Uri "$instanceUrl/rest-1.v1/Data/Story" `
	-Headers @{"Authorization" = "Basic "+[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("admin:admin" ))} `
	-Method Post `
	-Body '<Asset><Attribute name="Name" act="set">Hello world!</Attribute><Relation name="Scope" act="set"><Asset idref="Scope:0"/></Relation>
</Asset>'
