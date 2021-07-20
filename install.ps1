# This file is old. Please use the new instructions in the doc/install.md file.
# event store is now 4+

# Install EventStore from custom Chocolatey package on MyGet
choco install eventstore -source https://www.myget.org/F/versionone/ -force
choco install nssm -force

# Set up the default configuration to use
sc "C:\ProgramData\eventstore.3.5.0\config.yml" "Db: C:\ProgramData\eventstore.3.5.0\Data`nLog: C:\ProgramData\eventstore.3.5.0\Log`nRunProjections: ALL"

# Turn EventStore into a Windows service with that obeys the above configuration settings
nssm install eventstore "C:\ProgramData\eventstore.3.5.0\EventStore.ClusterNode.exe" --config C:\ProgramData\eventstore.3.5.0\config.yml
nssm start eventstore

# Start your engines
cd src/app
# $env:VCTargetsPath = "C:\Program Files (x86)\MSBuild\Microsoft.Cpp\v4.0\v140"
# npm install --no-optional --python=python2.7 --msvs_version=2015
npm install
start npm start
