For VersionOne developers, these are our internal Jenkins builds for CommitStream.

# [CommitStream VersionOne.Core integration build](http://ci-server/job/CommitStream-core-developing)

* Jenkins job name: CommitStream-core-developing
* This builds VersionOne from a feature branch that contains code necessary to enable / integrate CommitStream.

# [CommitStream + VersionOne.Core package](http://ci-server/job/CommitStream-core-developing-package)

* Jenkins job name: CommitStream-core-developing-package
* Uses artifacts from latest successful [CommitStream-core-developing](http://ci-server/job/CommitStream-core-developing) build
* Uploads VersionOne Ultimate installer to S3
* Creates and uploads CommitStreamVersionOne.*version*.nupkg to MyGet

# [CommitStream + VersionOne.Core deploy to Azure](http://ci-server/job/CommitStream-core-deploy-to-azure-sandbox)

* Jenkins job name: CommitStream-core-deploy-to-azure-sandbox
* Installs and configures new version on [http://v1commitstream.cloudapp.net/VersionOne](http://v1commitstream.cloudapp.net/VersionOne)
