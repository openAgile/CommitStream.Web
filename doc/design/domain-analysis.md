# CommitStream Domain Analysis

This analysis was done by Ian Buchanan and other team members. It serves as a guide to the overall domain model, but should not be considered as something **set in stone**.

## Service

![Class Diagram](http://yuml.me/648ab9da)

Source [yUML.me Diagram](http://yuml.me/edit/648ab9da) (Don't forget to update links if you change the source)

## Roles

![Class Diagram](http://yuml.me/53d367fd)

Source [yUML.me Diagram](http://yuml.me/edit/53d367fd) (Don't forget to update links if you change the source)

## Digest and Repository

![Class Diagram](http://yuml.me/9c6c5485)

Source [yUML.me Diagram](http://yuml.me/edit/9c6c5485) (Don't forget to update links if you change the source)

## Create a New Digest

![Sequence Diagram](http://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgQ3JlYXRlIGEgRGlnZXN0CgpVc2VyLT4rTWVtYmVyOiBjABsFABcGKG5hbWUpCgAVBi0-ACwGOiBuZXcoc2VydmljZSwgAB0GAEcGLT5TABEGOiBhZGQoc2VsZgA0Ck93bmVyADcGZAB2BSxwZXJzb24pCgAVBQBVCgApElN1YnNjcmkAgRsFAC0TABUKACkcAIFZCXMARghUb015Q29tbWl0cygAWBUAHwsAIQdNYXRjaGluZ1F1ZXJ5KGF1dGhvcj0AghkLLT4tVXNlcjog&s=default)

Source [Web Sequence Diagram](http://www.websequencediagrams.com/?lz=dGl0bGUgQ3JlYXRlIGEgRGlnZXN0CgpVc2VyLT4rTWVtYmVyOiBjABsFABcGKG5hbWUpCgAVBi0-ACwGOiBuZXcoc2VydmljZSwgAB0GAEcGLT5TABEGOiBhZGQoc2VsZgA0Ck93bmVyADcGZAB2BSxwZXJzb24pCgAVBQBVCgApElN1YnNjcmkAgRsFAC0TABUKACkcAIFZCXMARghUb015Q29tbWl0cygAWBUAHwsAIQdNYXRjaGluZ1F1ZXJ5KGF1dGhvcj0AghkLLT4tVXNlcjog&s=default) (Don't forget to update links if you change the source)

## Create a New Repository

![Sequence Diagram](http://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgQ3JlYXRlIGEgUmVwb3NpdG9yeQoKVXNlci0-K093bmVyOiBjAB4FABYKKHR5cGUsbmFtZSkKAB4FLT4AMwpUeXBlACATZGlnZXN0AC4HACAOADIMOiBuZXcAFRgtPkQAQQU6IGFkZChzZWxmAHgILT4tVXNlcjog&s=default)

Source [Web Sequence Diagram](http://www.websequencediagrams.com/?lz=dGl0bGUgQ3JlYXRlIGEgUmVwb3NpdG9yeQoKVXNlci0-K093bmVyOiBjAB4FABYKKHR5cGUsbmFtZSkKAB4FLT4AMwpUeXBlACATZGlnZXN0AC4HACAOADIMOiBuZXcAFRgtPkQAQQU6IGFkZChzZWxmAHgILT4tVXNlcjog&s=default) (Don't forget to update links if you change the source)

## Repository and Commits

![Class Diagram](http://yuml.me/3a15d5ac)

Source [yUML.me Diagram](http://yuml.me/edit/3a15d5ac) (Don't forget to update links if you change the source)

## VersionOne Integration

![Class Diagram](http://yuml.me/7cc0381e)

Source [yUML.me Diagram](http://yuml.me/edit/7cc0381e) (Don't forget to update links if you change the source)

## Example JSON

```
"digests": [
	{
		"name": "openAgile"
		"repositories": [
			{
				"name": "GitHub::VersionOne.Integration.ClarityPPM",
				"authors": [
					{
						"member": "member1",
						"emails" ["ian.buchanan@versionone.com", "ibuchanan@squian.com"],
						"usernames":["ibuchanan", "ian.buchanan"]
					}
				],
				"workitemsources": [
					{
						"name": "V1 Production",
						"url": "https://www7.v1host.com/V1Production",
						"pattern": "[A-Z]{1,2}-[0-9]+"
					}
				]
			}
		]
	}
]
```

## Example Stream Names

Since VersionOne doesn't know about digests and repos, streams may have to be combined for the V1 client. In this example:

* Given: Code for a single story within a single VersionOne instance must be commited to multiple repos (Such as front-end work and backend work that lives in different repos)
* Story/Goal: When I view the Story detail, I'll see all the commits across all the repos that have had code commits

```
digest1-repository1-workitemsource1-workitem9
+
digest2-repository3-workitemsource1-workitem9
=
workitemsource1-asset9
```

Similarly, since the member won't know all the authors spread across digests and repos, these may need to be aggregated. In this example:

* Given: A single member/author has been making commits to different repos
* Story/Goal: When I query for commits made by a single member/author, the results are aggregated from multiple repos

```
digest1-repository1-author1
+
digest2-repository3-author1
=
member1-author1
```

Question: Do these aggregations lead to security holes?
