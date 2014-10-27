cp $Env:WORKSPACE\VersionOne.Setup-Ultimate*exe .
cp $Env:WORKSPACE\VERSION .

rm -re -fo VersionOne.ChocolateyPackage
git clone git@github.com:versionone/VersionOne.ChocolateyPackage.git --branch S-47665_FeaturePackage --single-branch

$version=gc VERSION

$fileName="VersionOne.Setup-Ultimate-$version.cs.exe"
echo "Uploading $fileName to S3"
Write-S3Object -BucketName versionone-chocolatey -File $fileName -Key $fileName -PublicReadOnly

cd VersionOne.ChocolateyPackage

$url="https://s3.amazonaws.com/versionone-chocolatey/VersionOne.Setup-Ultimate-#version#.cs.exe"
$feature="CommitStreamVersionOne"

.\build.ps1 $version $url $feature