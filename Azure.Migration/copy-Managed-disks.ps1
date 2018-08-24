#Provide the subscription Id of the subscription where managed disk exists
$sourceSubscriptionId='add96084-d72b-497c-acf5-7569a0f6703b'

#Provide the name of your resource group where managed disk exists
$sourceResourceGroupName='cs-production'

#Provide the name of the managed disk
$managedDiskName='cs-production-disk-3'

#Set the context to the subscription Id where Managed Disk exists
Select-AzureRmSubscription -SubscriptionId $sourceSubscriptionId

#Get the source managed disk
$managedDisk= Get-AzureRMDisk -ResourceGroupName $sourceResourceGroupName -DiskName $managedDiskName

#Provide the subscription Id of the subscription where managed disk will be copied to
#If managed disk is copied to the same subscription then you can skip this step
$targetSubscriptionId='dbf41010-609a-40c2-9c08-7a7c9105e1b8'

#Name of the resource group where snapshot will be copied to
$targetResourceGroupName='cs-prod'

#Set the context to the subscription Id where managed disk will be copied to
#If snapshot is copied to the same subscription then you can skip this step
Select-AzureRmSubscription -SubscriptionId $targetSubscriptionId

$diskConfig = New-AzureRmDiskConfig -SourceResourceId $managedDisk.Id -Location $managedDisk.Location -CreateOption Copy 

#Create a new managed disk in the target subscription and resource group
New-AzureRmDisk -Disk $diskConfig -DiskName $managedDiskName -ResourceGroupName $targetResourceGroupName