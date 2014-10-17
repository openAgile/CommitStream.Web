For VersionOne developers, these are our internal Jenkins builds for CommitStream.

# [CommitStream VersionOne.Core integration build](http://ci-server/job/CommitStream-core-developing)

This builds VersionOne from a feature branch that contains code necessary to enable / integration CommitStream.

# [CommitStream + VersionOne.Core integration sandbox build](http://ci-server/job/CommitStream-core-sandbox/)

* Uses artifacts from latest successful CommitStream-core-developing
* Uploads VersionOne Ultimate installer to S3
* Creates and uploads CommitStreamVersionOne to MyGet
* Installs and configures new version on [http://v1commitstream.cloudapp.net/VersionOne](http://v1commitstream.cloudapp.net/VersionOne)

## TODOs

* [Story: Separate out the Choco package and publish step from the deployment to Azure step](https://www7.v1host.com/V1Production/story.mvc/Summary?oidToken=Story:547479)
