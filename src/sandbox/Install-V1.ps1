param(
	$instanceUrl='http://v1commitstream.cloudapp.net/VersionOne',
	$userConfigPath='c:\inetpub\wwwroot\VersionOne\user.config',
	$commitStreamAppUrl='//v1commitstream.azurewebsites.net/app.js',
	$storySeedStart='47665'
)

cuninst CommitStreamVersionOne
cinst CommitStreamVersionOne -source https://www.myget.org/F/versionone/
sqlcmd -Q "use VersionOne; DBCC CHECKIDENT(NumberSource_Story, RESEED, $storySeedStart)"
sc $userConfigPath '<appSettings><add key="CommitStreamAppUrl" value="$commitStreamAppUrl" /></appSettings>'
iisreset

iwr `
	-Uri "$instanceUrl/rest-1.v1/Data/Story" `
	-Headers @{"Authorization" = "Basic "+[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("admin:admin" ))} `
	-Method Post `
	-Body '<Asset><Attribute name="Name" act="set">Hello world!</Attribute><Relation name="Scope" act="set"><Asset idref="Scope:0"/></Relation>
</Asset>'
