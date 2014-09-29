Keep this document up-to-date to reflect resources that CommitStream uses in production, staging, and other configurations.

# DEV account Azure resources
See https://manage.windowsazure.com/VersionOne.onmicrosoft.com#Workspaces/All/dashboard for details. Contact Tom Hall to get added to the account.

<table>
  <tr>
    <th>Resource</th><th>Description</th><th>Type</th><th>URL(s)</th><th>Notes</th>
  </tr>
  <tr>
    <td>v1CommitStream</td><td>Public web site and API host for CommitStream</td><td>Web Site</td><td>http://v1commitstream.azurewebsites.net</td><td></td>
  </tr>
  <tr>
    <td>v1CommitStream-staging</td><td>Staging web site for v1commitstream</td><td>Web Site</td><td>http://v1commitstream-staging.azurewebsites.net</td><td>Currently deployed from S-48324_MultiRepository feature branch</td>
  </tr>  
  <tr>
    <td>WEventStore</td><td>EventStore 3.0 under Windows web service</td><td>Cloud Service</td><td>http://WEventstore.cloudapp.net:2113</td><td></td>
  </tr>
  <tr>
    <td>WEventStore</td><td>EventStore 3.0 VM</td><td>Virtual Machine</td><td></td><td></td>
  </tr>  
</table>


# PROD account Azure resources

The dashboard for PROD is currently https://manage.windowsazure.com/@VersionOne.onmicrosoft.com#Workspaces/All/dashboard. 

(That appears to be just one character different from the DEV account. Tom, is this correct?)

No current resources in use under PROD.
