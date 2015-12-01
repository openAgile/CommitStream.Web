# Getting Started with the CommitStream API for VersionOne Users

The CommitStream API is a REST / JSON API based on the [Hypertext Application Language](https://github.com/mikekelly/hal_specification), or HAL. This is a simple data format that allows servers to return resources that have not just simple data properties, but also link relationships to related resources. You can learn more about HAL on the GitHub link above, or in [this interview with HAL creator Mike Kelly](http://www.infoq.com/articles/web-apis-hal).

However, while there are specialized HAL clients that can make querying HAL-based APIs easier, you can also just query the API with standard HTTP clients or directly via the web browser. But, you need to know the basics first, so let's go!

# First, Find Your `instanceId` and `apiKey` Values

To make queries against the CommitStream API, you'll need the `instanceId` and `apiKey` that corresponds to your VersionOne instance. The easiest way to find this is by looking at one of the URLs generated for a repository when you add one in the CommitStream Admin page, or from the TeamRoom settings page if you're using a custom collection of repositories for your specific team. **Note that the instanceId and apiKey apply to your entire instance, not just to indivivudal teams or a an individual TeamRoom, however.**

* Open the CommitStream Admin page. If you have no repositories added yet, the screen should look like this:
![image](https://cloud.githubusercontent.com/assets/1863005/10340553/aacc9ebc-6cde-11e5-961b-629abc8f6258.png)
* If you don't have any repositories, add a new one (it doesn't matter which type of VCS), and then you should see something like this appear below the VCS choice buttons:
![image](https://cloud.githubusercontent.com/assets/1863005/10341224/e353a386-6ce1-11e5-94b0-1195cff238cd.png)
* Copy the URL to your clipboard and paste it into a text editor. The full URL should be something like: 

>    https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/inboxes/8533e007-fdf7-42ff-b13f-90d3653b6047/commits?apiKey=db479bc8-bb3b-48de-ac05-fd5c8c0a089f

* The structure of the URL is: `https://commitstream.v1host.com/api/`**instanceId**`/inboxes/inboxId/commits?apiKey=`**apiKey**
* Copy the values for the **instanceId** and **apiKey** and save them somewhere secure

# Next, Decide Whether to Query at the Workitem Level or Team Level

There are two ways you can query for commits inside CommitStream:

* Query By Workitem -- *Fetch commits that are associated with one or more Workitem numbers*
* Query By Team -- *Fetch all commits, even those without Workitem mentions, that are made by a specific team*

# Query by Workitem

To make a query by Workitem, you just need to pass the Workitem ids to the correct endpoint, along with your `instanceId` and `apiKey` values. 

* The structure of the URL is: `https://commitstream.v1host.com/api/`**instanceId**`/commits/tags/versionone/workitem?numbers=`**S-00001[,S-00002...]**`&apiKey=`**apiKey**
* Example to query for commits against a single Workitem: 

> https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/commits/tags/versionone/workitem?numbers=S-00001&apiKey=db479bc8-bb3b-48de-ac05-fd5c8c0a089f

* Example to query for commits against two (or more) Workitems:

> https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/commits/tags/versionone/workitem?numbers=S-00001,S-00002,S-00003&apiKey=db479bc8-bb3b-48de-ac05-fd5c8c0a089f

## Sample Single-Workitem Query with cURL

Here's a sample from my local development copy of CommitStream. I'm doing this with the popular [cURL](http://curl.haxx.se/) command line tool and [python](https://www.python.org/) to format the JSON, but you can use any HTTP client library you'd like. You can even just try it out in the web browser at first.

```bash
$ curl https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/commits/tags/versionone/workitem?numbers=S-00001\&apiKey=db479bc8-bb3b-48de-ac05-fd5c8c0a089f | python -mjson.tool
```

### Response

```json
{
    "_links": {},
    "commits": [
        {
            "action": "committed",
            "author": "kunzimariano",
            "branch": "teamRoomUX2_S-51083",
            "branchHref": "https://github.com/openAgile/CommitStream.Web/tree/teamRoomUX2_S-51083",
            "commitDate": "2015-01-19T15:00:17-05:00",
            "commitHref": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
            "family": "GitHub",
            "message": "S-00001 mention # 0 on 0 in  f434d4d7-05d2-4446-a1fa-c3b039c9f5ee of family = GitHub",
            "repo": "openAgile/CommitStream.Web",
            "repoHref": "https://github.com/openAgile/CommitStream.Web",
            "sha1Partial": "3b80fa",
            "timeFormatted": "9 months ago"
        }
    ]
}
```

### Explanation

* Notice that the `message` property contains the `S-00001` Workitem mention that we queried for.
* Notice that the `family` property indicated the commit was to a `GitHub` repository.

## Sample Multi-Workitem Query with cURL

```bash
$ curl https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/commits/tags/versionone/workitem?numbers=S-00001,S-00002,S-00003\&apiKey=db479bc8-bb3b-48de-ac05-fd5c8c0a089f | python -mjson.tool
```
### Response

```json
{
    "commits": [
        {
            "action": "committed",
            "author": "Mariano Kunzi",
            "branch": "master",
            "branchHref": "https://bitbucket.org/kunzimariano/test/branch/master",
            "commitDate": "2015-08-18T18:43:11+00:00",
            "commitHref": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
            "family": "Bitbucket",
            "message": "S-00003 mention # 0 on 0 in  1da7d2bd-f7a5-4e13-b822-c1847123daa7 of family = Bitbucket",
            "repo": "kunzimariano/test",
            "repoHref": "https://bitbucket.org/kunzimariano/test",
            "sha1Partial": "24480f",
            "timeFormatted": "2 months ago"
        },
        {
            "action": "committed",
            "author": "Jordi Mallach",
            "branch": "master",
            "branchHref": "http://example.com/mike/diaspora/tree/master",
            "commitDate": "2011-12-12T14:27:31+02:00",
            "commitHref": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            "family": "GitLab",
            "message": "S-00002 mention # 0 on 0 in  ba1d712c-4f93-497f-83fa-091b0ea7e6c5 of family = GitLab",
            "repo": "mike/diaspora",
            "repoHref": "http://example.com/mike/diaspora",
            "sha1Partial": "b6568d",
            "timeFormatted": "4 years ago"
        },
        {
            "action": "committed",
            "author": "kunzimariano",
            "branch": "teamRoomUX2_S-51083",
            "branchHref": "https://github.com/openAgile/CommitStream.Web/tree/teamRoomUX2_S-51083",
            "commitDate": "2015-01-19T17:00:17-03:00",
            "commitHref": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
            "family": "GitHub",
            "message": "S-00001 mention # 0 on 0 in  f434d4d7-05d2-4446-a1fa-c3b039c9f5ee of family = GitHub",
            "repo": "openAgile/CommitStream.Web",
            "repoHref": "https://github.com/openAgile/CommitStream.Web",
            "sha1Partial": "3b80fa",
            "timeFormatted": "9 months ago"
        }
    ]
}
```

### Explanation

* The only difference in our query is that the `numbers` parameter now passes three items: `numbers=S-00001,S-00002,S-00003`
* We now have commits from three separate repositories (and each one of a different family in this particular case)
* The `message` property of each commit contains one of the Workitem`S-00001` Workitem mention that passed in the `numbers` parameter

# Query By Team

Teams in VersionOne can have their own collections of repositories. When you configure CommitStream for a TeamRoom, you have the option to use the Global repository list (one shared collection of repositories that the instance administrator can manage), or a Custom respository list that is managed by the TeamRoom administrator. 

The API domain term for groups of repositories is `digest`. You can fetch the list of all the `digest` objects that your CommitStream instance contains by fetching the `/digests` route

* The structure of the URL is: `https://commitstream.v1host.com/api/`**instanceId**`/digests&apiKey=`**apiKey**
* Exmaple to query for digests within an instance:

> https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/digests&apiKey=db479bc8-bb3b-48de-ac05-fd5c8c0a089f

## Sample Query for Digests within an Instance

As just mentioned, you first need to know the address for the `digest` you wanto query. The following request fetches **all** the digests within my sample instance. Just plugin the values for your own `instanceId` and `apiKey` to get the list for your own CommitStream instance:

```bash
$ curl https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/digests&apiKey=db479bc8-bb3b-48de-ac05-fd5c8c0a089f | python -mjson.tool
```

### Response

```json
{
    "_links": {
        "self": {
            "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/dige
sts"
        }
    },
    "count": 2,
    "_embedded": {
        "digests": [
            {
                "_links": {
                    "self": {
                        "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/dige
sts/c4e3eb55-71b8-40e2-9279-d7097fe9e278"
                    }
                },
                "description": "Global Respositories List",
                "digestId": "c4e3eb55-71b8-40e2-9279-d7097fe9e278"
            },
            {
                "_links": {
                    "self": {
                        "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/dige
sts/2b0c0791-140a-4143-be60-15552b4d6af1"
                    }
                },
                "description": "Respositories List",
                "digestId": "2b0c0791-140a-4143-be60-15552b4d6af1"
            }
        ]
    }
}
```

### Explanation

* This instance has two separate digests, which is a common case because you can have a single **Global** repository list (managed by the VersionOne instance's administrator), and one or more **Custom** repository lists corresponding to individual TeamRooms.
* The first has a `description` of `Global Repositories List` and the second has `Repositories List`. At this time, all custom TeamRoom repositories have the same `description`, but different `digestId` values.
  * Because of this, you may have to query each one to find out its list of repositories to know if it is the one you really care about if your company has multiple TeamRooms and thus multiple **Custom** repository lists. The next section explains that.

## Sample Query for Showing the Repositories within a Digest

The technical term within CommitStream for a source control repository is actually `inbox`, because it represents an HTTP endpoint to which the repository sends WebHook messages. Thus, to find out the list of repositories that a `digest` contains, we query for its child `inboxes` route.

* The structure of the URL is `https://commitstream.v1host.com/api/`**instanceId**`/digests/`**digestId**`/inboxes?apiKey=`**apiKey**
* Exmaple to query for inboxes within a digest:

> https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/digests/2b0c0791-140a-4143-be60-15552b4d6af1/inboxes?apiKey=db479bc8-bb3b-48de-ac05-fd5c8c0a089f

Here is the above in action:

```bash
$ curl https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/digests/2b0c0791-140a-4143-be60-15552b4d6af1/inboxes?apiKey=db479bc8-bb3b-48de-ac05-fd5c8c0a089f | python -mjson.tool
```

### Response

This will show all the commits from all the repositories, regardless of whether they are from GitHub, Bitbucket, GitLab, or any other system that CommitStream eventually supports:

```json
{
    "_links": {
        "digest": {
            "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/digests/2b0c0791-140a-4143-be60-15552b4d6af1"
        },
        "inbox-create": {
            "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/digests/2b0c0791-140a-4143-be60-15552b4d6af1/inboxes",
            "method": "POST"
        },
        "self": {
            "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/digests/2b0c0791-140a-4143-be60-15552b4d6af1/inboxes"
        }
    },
    "digest": {
        "description": "Digest for First Group of Repositories",
        "digestId": "2b0c0791-140a-4143-be60-15552b4d6af1"
    },
    "count": 3,
    "_embedded": {
        "inboxes": [
            {
                "_links": {
                    "add-commit": {
                        "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/inboxes/1f4a0c96-5226-47ac-8d4f-8ecaac7cbca2/commits"
                    },
                    "self": {
                        "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/inboxes/1f4a0c96-5226-47ac-8d4f-8ecaac7cbca2"
                    }
                },
                "family": "GitHub",
                "inboxId": "1f4a0c96-5226-47ac-8d4f-8ecaac7cbca2",
                "instanceId": "c525ed34-429f-4e22-bd13-82e846e12ab6",
                "name": "GitHub Repo"
            },
            {
                "_links": {
                    "add-commit": {
                        "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/inboxes/fee20df8-0041-463a-90b7-5ec0da09fed0/commits"
                    },
                    "self": {
                        "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/inboxes/fee20df8-0041-463a-90b7-5ec0da09fed0"
                    }
                },
                "family": "GitLab",
                "inboxId": "fee20df8-0041-463a-90b7-5ec0da09fed0",
                "instanceId": "c525ed34-429f-4e22-bd13-82e846e12ab6",
                "name": "GitLab Repo"
            },
            {
                "_links": {
                    "add-commit": {
                        "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/inboxes/2f5e73da-d0d7-4ab6-a38d-d521a6dabd4c/commits"
                    },
                    "self": {
                        "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/inboxes/2f5e73da-d0d7-4ab6-a38d-d521a6dabd4c"
                    }
                },
                "family": "Bitbucket",
                "inboxId": "2f5e73da-d0d7-4ab6-a38d-d521a6dabd4c",
                "instanceId": "c525ed34-429f-4e22-bd13-82e846e12ab6",
                "name": "Bitbucket Repo"
                
            }
        ]
    }
}
```

c

## Sample Query to Show All Commits within a Digest:

Finally, once you know that you have the correct `digestId`, you can simply ask for all the commits that are aggregated within that `digest`.

* The structure of the URL is `https://commitstream.v1host.com/api/`**instanceId**`/digests/`**digestId**`/commits?apiKey=`**apiKey**
* Exmaple to query for commits within a digest: 
 
> https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/digests/2b0c0791-140a-4143-be60-15552b4d6af1/commits?apiKey=9a753757-8ae9-4287-babe-0970101627db

Here it is in action:

```bash
$ curl https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/digests/2b0c0791-140a-4143-be60-15552b4d6af1/commits?apiKey=9a753757-8ae9-4287-babe-0970101627db | python -mjson.tool
```
### Response

```json
{
    "_links": {},
    "commits": [
        {
            "action": "committed",
            "author": "Mariano Kunzi",
            "branch": "master",
            "branchHref": "https://bitbucket.org/kunzimariano/test/branch/master",
            "commitDate": "2015-08-18T14:43:11-04:00",
            "commitHref": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
            "family": "Bitbucket",
            "message": "AT-00025 mention # 0 on 0 in  2f5e73da-d0d7-4ab6-a38d-d521a6dabd4c of family = Bitbucket",
            "repo": "kunzimariano/test",
            "repoHref": "https://bitbucket.org/kunzimariano/test",
            "sha1Partial": "24480f",
            "timeFormatted": "2 months ago"
        },
        {
            "action": "committed",
            "author": "Mariano Kunzi",
            "branch": "master",
            "branchHref": "https://bitbucket.org/kunzimariano/test/branch/master",
            "commitDate": "2015-08-18T14:43:11-04:00",
            "commitHref": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
            "family": "Bitbucket",
            "message": "AT-00024 mention # 0 on 0 in  2f5e73da-d0d7-4ab6-a38d-d521a6dabd4c of family = Bitbucket",
            "repo": "kunzimariano/test",
            "repoHref": "https://bitbucket.org/kunzimariano/test",
            "sha1Partial": "24480f",
            "timeFormatted": "2 months ago"
        },
        {
            "action": "committed",
            "author": "Mariano Kunzi",
            "branch": "master",
            "branchHref": "https://bitbucket.org/kunzimariano/test/branch/master",
            "commitDate": "2015-08-18T14:43:11-04:00",
            "commitHref": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
            "family": "Bitbucket",
            "message": "AT-00023 mention # 0 on 0 in  2f5e73da-d0d7-4ab6-a38d-d521a6dabd4c of family = Bitbucket",
            "repo": "kunzimariano/test",
            "repoHref": "https://bitbucket.org/kunzimariano/test",
            "sha1Partial": "24480f",
            "timeFormatted": "2 months ago"
        },
        {
            "action": "committed",
            "author": "Mariano Kunzi",
            "branch": "master",
            "branchHref": "https://bitbucket.org/kunzimariano/test/branch/master",
            "commitDate": "2015-08-18T14:43:11-04:00",
            "commitHref": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
            "family": "Bitbucket",
            "message": "AT-00022 mention # 0 on 0 in  2f5e73da-d0d7-4ab6-a38d-d521a6dabd4c of family = Bitbucket",
            "repo": "kunzimariano/test",
            "repoHref": "https://bitbucket.org/kunzimariano/test",
            "sha1Partial": "24480f",
            "timeFormatted": "2 months ago"
        },
        {
            "action": "committed",
            "author": "Mariano Kunzi",
            "branch": "master",
            "branchHref": "https://bitbucket.org/kunzimariano/test/branch/master",
            "commitDate": "2015-08-18T14:43:11-04:00",
            "commitHref": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
            "family": "Bitbucket",
            "message": "AT-00021 mention # 0 on 0 in  2f5e73da-d0d7-4ab6-a38d-d521a6dabd4c of family = Bitbucket",
            "repo": "kunzimariano/test",
            "repoHref": "https://bitbucket.org/kunzimariano/test",
            "sha1Partial": "24480f",
            "timeFormatted": "2 months ago"
        },
        {
            "action": "committed",
            "author": "Mariano Kunzi",
            "branch": "master",
            "branchHref": "https://bitbucket.org/kunzimariano/test/branch/master",
            "commitDate": "2015-08-18T14:43:11-04:00",
            "commitHref": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
            "family": "Bitbucket",
            "message": "T-00025 mention # 0 on 0 in  2f5e73da-d0d7-4ab6-a38d-d521a6dabd4c of family = Bitbucket",
            "repo": "kunzimariano/test",
            "repoHref": "https://bitbucket.org/kunzimariano/test",
            "sha1Partial": "24480f",
            "timeFormatted": "2 months ago"
        },
        {
            "action": "committed",
            "author": "Mariano Kunzi",
            "branch": "master",
            "branchHref": "https://bitbucket.org/kunzimariano/test/branch/master",
            "commitDate": "2015-08-18T14:43:11-04:00",
            "commitHref": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
            "family": "Bitbucket",
            "message": "T-00024 mention # 0 on 0 in  2f5e73da-d0d7-4ab6-a38d-d521a6dabd4c of family = Bitbucket",
            "repo": "kunzimariano/test",
            "repoHref": "https://bitbucket.org/kunzimariano/test",
            "sha1Partial": "24480f",
            "timeFormatted": "2 months ago"
        },
        {
            "action": "committed",
            "author": "Mariano Kunzi",
            "branch": "master",
            "branchHref": "https://bitbucket.org/kunzimariano/test/branch/master",
            "commitDate": "2015-08-18T14:43:11-04:00",
            "commitHref": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
            "family": "Bitbucket",
            "message": "T-00023 mention # 0 on 0 in  2f5e73da-d0d7-4ab6-a38d-d521a6dabd4c of family = Bitbucket",
            "repo": "kunzimariano/test",
            "repoHref": "https://bitbucket.org/kunzimariano/test",
            "sha1Partial": "24480f",
            "timeFormatted": "2 months ago"
        },
        {
            "action": "committed",
            "author": "Mariano Kunzi",
            "branch": "master",
            "branchHref": "https://bitbucket.org/kunzimariano/test/branch/master",
            "commitDate": "2015-08-18T14:43:11-04:00",
            "commitHref": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
            "family": "Bitbucket",
            "message": "T-00022 mention # 0 on 0 in  2f5e73da-d0d7-4ab6-a38d-d521a6dabd4c of family = Bitbucket",
            "repo": "kunzimariano/test",
            "repoHref": "https://bitbucket.org/kunzimariano/test",
            "sha1Partial": "24480f",
            "timeFormatted": "2 months ago"
        },
        {
            "action": "committed",
            "author": "Mariano Kunzi",
            "branch": "master",
            "branchHref": "https://bitbucket.org/kunzimariano/test/branch/master",
            "commitDate": "2015-08-18T14:43:11-04:00",
            "commitHref": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
            "family": "Bitbucket",
            "message": "T-00021 mention # 0 on 0 in  2f5e73da-d0d7-4ab6-a38d-d521a6dabd4c of family = Bitbucket",
            "repo": "kunzimariano/test",
            "repoHref": "https://bitbucket.org/kunzimariano/test",
            "sha1Partial": "24480f",
            "timeFormatted": "2 months ago"
        },
        {
            "action": "committed",
            "author": "Mariano Kunzi",
            "branch": "master",
            "branchHref": "https://bitbucket.org/kunzimariano/test/branch/master",
            "commitDate": "2015-08-18T14:43:11-04:00",
            "commitHref": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
            "family": "Bitbucket",
            "message": "S-00003 mention # 0 on 0 in  2f5e73da-d0d7-4ab6-a38d-d521a6dabd4c of family = Bitbucket",
            "repo": "kunzimariano/test",
            "repoHref": "https://bitbucket.org/kunzimariano/test",
            "sha1Partial": "24480f",
            "timeFormatted": "2 months ago"
        },
        {
            "action": "committed",
            "author": "Jordi Mallach",
            "branch": "master",
            "branchHref": "http://example.com/mike/diaspora/tree/master",
            "commitDate": "2011-12-12T07:27:31-05:00",
            "commitHref": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            "family": "GitLab",
            "message": "AT-00015 mention # 0 on 0 in  fee20df8-0041-463a-90b7-5ec0da09fed0 of family = GitLab",
            "repo": "mike/diaspora",
            "repoHref": "http://example.com/mike/diaspora",
            "sha1Partial": "b6568d",
            "timeFormatted": "4 years ago"
        },
        {
            "action": "committed",
            "author": "Jordi Mallach",
            "branch": "master",
            "branchHref": "http://example.com/mike/diaspora/tree/master",
            "commitDate": "2011-12-12T07:27:31-05:00",
            "commitHref": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            "family": "GitLab",
            "message": "AT-00014 mention # 0 on 0 in  fee20df8-0041-463a-90b7-5ec0da09fed0 of family = GitLab",
            "repo": "mike/diaspora",
            "repoHref": "http://example.com/mike/diaspora",
            "sha1Partial": "b6568d",
            "timeFormatted": "4 years ago"
        },
        {
            "action": "committed",
            "author": "Jordi Mallach",
            "branch": "master",
            "branchHref": "http://example.com/mike/diaspora/tree/master",
            "commitDate": "2011-12-12T07:27:31-05:00",
            "commitHref": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            "family": "GitLab",
            "message": "AT-00013 mention # 0 on 0 in  fee20df8-0041-463a-90b7-5ec0da09fed0 of family = GitLab",
            "repo": "mike/diaspora",
            "repoHref": "http://example.com/mike/diaspora",
            "sha1Partial": "b6568d",
            "timeFormatted": "4 years ago"
        },
        {
            "action": "committed",
            "author": "Jordi Mallach",
            "branch": "master",
            "branchHref": "http://example.com/mike/diaspora/tree/master",
            "commitDate": "2011-12-12T07:27:31-05:00",
            "commitHref": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            "family": "GitLab",
            "message": "AT-00012 mention # 0 on 0 in  fee20df8-0041-463a-90b7-5ec0da09fed0 of family = GitLab",
            "repo": "mike/diaspora",
            "repoHref": "http://example.com/mike/diaspora",
            "sha1Partial": "b6568d",
            "timeFormatted": "4 years ago"
        },
        {
            "action": "committed",
            "author": "Jordi Mallach",
            "branch": "master",
            "branchHref": "http://example.com/mike/diaspora/tree/master",
            "commitDate": "2011-12-12T07:27:31-05:00",
            "commitHref": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            "family": "GitLab",
            "message": "AT-00011 mention # 0 on 0 in  fee20df8-0041-463a-90b7-5ec0da09fed0 of family = GitLab",
            "repo": "mike/diaspora",
            "repoHref": "http://example.com/mike/diaspora",
            "sha1Partial": "b6568d",
            "timeFormatted": "4 years ago"
        },
        {
            "action": "committed",
            "author": "Jordi Mallach",
            "branch": "master",
            "branchHref": "http://example.com/mike/diaspora/tree/master",
            "commitDate": "2011-12-12T07:27:31-05:00",
            "commitHref": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            "family": "GitLab",
            "message": "T-00015 mention # 0 on 0 in  fee20df8-0041-463a-90b7-5ec0da09fed0 of family = GitLab",
            "repo": "mike/diaspora",
            "repoHref": "http://example.com/mike/diaspora",
            "sha1Partial": "b6568d",
            "timeFormatted": "4 years ago"
        },
        {
            "action": "committed",
            "author": "Jordi Mallach",
            "branch": "master",
            "branchHref": "http://example.com/mike/diaspora/tree/master",
            "commitDate": "2011-12-12T07:27:31-05:00",
            "commitHref": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            "family": "GitLab",
            "message": "T-00014 mention # 0 on 0 in  fee20df8-0041-463a-90b7-5ec0da09fed0 of family = GitLab",
            "repo": "mike/diaspora",
            "repoHref": "http://example.com/mike/diaspora",
            "sha1Partial": "b6568d",
            "timeFormatted": "4 years ago"
        },
        {
            "action": "committed",
            "author": "Jordi Mallach",
            "branch": "master",
            "branchHref": "http://example.com/mike/diaspora/tree/master",
            "commitDate": "2011-12-12T07:27:31-05:00",
            "commitHref": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            "family": "GitLab",
            "message": "T-00013 mention # 0 on 0 in  fee20df8-0041-463a-90b7-5ec0da09fed0 of family = GitLab",
            "repo": "mike/diaspora",
            "repoHref": "http://example.com/mike/diaspora",
            "sha1Partial": "b6568d",
            "timeFormatted": "4 years ago"
        },
        {
            "action": "committed",
            "author": "Jordi Mallach",
            "branch": "master",
            "branchHref": "http://example.com/mike/diaspora/tree/master",
            "commitDate": "2011-12-12T07:27:31-05:00",
            "commitHref": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            "family": "GitLab",
            "message": "T-00012 mention # 0 on 0 in  fee20df8-0041-463a-90b7-5ec0da09fed0 of family = GitLab",
            "repo": "mike/diaspora",
            "repoHref": "http://example.com/mike/diaspora",
            "sha1Partial": "b6568d",
            "timeFormatted": "4 years ago"
        },
        {
            "action": "committed",
            "author": "Jordi Mallach",
            "branch": "master",
            "branchHref": "http://example.com/mike/diaspora/tree/master",
            "commitDate": "2011-12-12T07:27:31-05:00",
            "commitHref": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            "family": "GitLab",
            "message": "T-00011 mention # 0 on 0 in  fee20df8-0041-463a-90b7-5ec0da09fed0 of family = GitLab",
            "repo": "mike/diaspora",
            "repoHref": "http://example.com/mike/diaspora",
            "sha1Partial": "b6568d",
            "timeFormatted": "4 years ago"
        },
        {
            "action": "committed",
            "author": "Jordi Mallach",
            "branch": "master",
            "branchHref": "http://example.com/mike/diaspora/tree/master",
            "commitDate": "2011-12-12T07:27:31-05:00",
            "commitHref": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            "family": "GitLab",
            "message": "S-00002 mention # 0 on 0 in  fee20df8-0041-463a-90b7-5ec0da09fed0 of family = GitLab",
            "repo": "mike/diaspora",
            "repoHref": "http://example.com/mike/diaspora",
            "sha1Partial": "b6568d",
            "timeFormatted": "4 years ago"
        },
        {
            "action": "committed",
            "author": "kunzimariano",
            "branch": "teamRoomUX2_S-51083",
            "branchHref": "https://github.com/openAgile/CommitStream.Web/tree/teamRoomUX2_S-51083",
            "commitDate": "2015-01-19T15:00:17-05:00",
            "commitHref": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
            "family": "GitHub",
            "message": "AT-00005 mention # 0 on 0 in  1f4a0c96-5226-47ac-8d4f-8ecaac7cbca2 of family = GitHub",
            "repo": "openAgile/CommitStream.Web",
            "repoHref": "https://github.com/openAgile/CommitStream.Web",
            "sha1Partial": "3b80fa",
            "timeFormatted": "9 months ago"
        },
        {
            "action": "committed",
            "author": "kunzimariano",
            "branch": "teamRoomUX2_S-51083",
            "branchHref": "https://github.com/openAgile/CommitStream.Web/tree/teamRoomUX2_S-51083",
            "commitDate": "2015-01-19T15:00:17-05:00",
            "commitHref": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
            "family": "GitHub",
            "message": "AT-00004 mention # 0 on 0 in  1f4a0c96-5226-47ac-8d4f-8ecaac7cbca2 of family = GitHub",
            "repo": "openAgile/CommitStream.Web",
            "repoHref": "https://github.com/openAgile/CommitStream.Web",
            "sha1Partial": "3b80fa",
            "timeFormatted": "9 months ago"
        },
        {
            "action": "committed",
            "author": "kunzimariano",
            "branch": "teamRoomUX2_S-51083",
            "branchHref": "https://github.com/openAgile/CommitStream.Web/tree/teamRoomUX2_S-51083",
            "commitDate": "2015-01-19T15:00:17-05:00",
            "commitHref": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
            "family": "GitHub",
            "message": "AT-00003 mention # 0 on 0 in  1f4a0c96-5226-47ac-8d4f-8ecaac7cbca2 of family = GitHub",
            "repo": "openAgile/CommitStream.Web",
            "repoHref": "https://github.com/openAgile/CommitStream.Web",
            "sha1Partial": "3b80fa",
            "timeFormatted": "9 months ago"
        },
        {
            "action": "committed",
            "author": "kunzimariano",
            "branch": "teamRoomUX2_S-51083",
            "branchHref": "https://github.com/openAgile/CommitStream.Web/tree/teamRoomUX2_S-51083",
            "commitDate": "2015-01-19T15:00:17-05:00",
            "commitHref": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
            "family": "GitHub",
            "message": "AT-00002 mention # 0 on 0 in  1f4a0c96-5226-47ac-8d4f-8ecaac7cbca2 of family = GitHub",
            "repo": "openAgile/CommitStream.Web",
            "repoHref": "https://github.com/openAgile/CommitStream.Web",
            "sha1Partial": "3b80fa",
            "timeFormatted": "9 months ago"
        },
        {
            "action": "committed",
            "author": "kunzimariano",
            "branch": "teamRoomUX2_S-51083",
            "branchHref": "https://github.com/openAgile/CommitStream.Web/tree/teamRoomUX2_S-51083",
            "commitDate": "2015-01-19T15:00:17-05:00",
            "commitHref": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
            "family": "GitHub",
            "message": "AT-00001 mention # 0 on 0 in  1f4a0c96-5226-47ac-8d4f-8ecaac7cbca2 of family = GitHub",
            "repo": "openAgile/CommitStream.Web",
            "repoHref": "https://github.com/openAgile/CommitStream.Web",
            "sha1Partial": "3b80fa",
            "timeFormatted": "9 months ago"
        },
        {
            "action": "committed",
            "author": "kunzimariano",
            "branch": "teamRoomUX2_S-51083",
            "branchHref": "https://github.com/openAgile/CommitStream.Web/tree/teamRoomUX2_S-51083",
            "commitDate": "2015-01-19T15:00:17-05:00",
            "commitHref": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
            "family": "GitHub",
            "message": "T-00005 mention # 0 on 0 in  1f4a0c96-5226-47ac-8d4f-8ecaac7cbca2 of family = GitHub",
            "repo": "openAgile/CommitStream.Web",
            "repoHref": "https://github.com/openAgile/CommitStream.Web",
            "sha1Partial": "3b80fa",
            "timeFormatted": "9 months ago"
        },
        {
            "action": "committed",
            "author": "kunzimariano",
            "branch": "teamRoomUX2_S-51083",
            "branchHref": "https://github.com/openAgile/CommitStream.Web/tree/teamRoomUX2_S-51083",
            "commitDate": "2015-01-19T15:00:17-05:00",
            "commitHref": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
            "family": "GitHub",
            "message": "T-00004 mention # 0 on 0 in  1f4a0c96-5226-47ac-8d4f-8ecaac7cbca2 of family = GitHub",
            "repo": "openAgile/CommitStream.Web",
            "repoHref": "https://github.com/openAgile/CommitStream.Web",
            "sha1Partial": "3b80fa",
            "timeFormatted": "9 months ago"
        },
        {
            "action": "committed",
            "author": "kunzimariano",
            "branch": "teamRoomUX2_S-51083",
            "branchHref": "https://github.com/openAgile/CommitStream.Web/tree/teamRoomUX2_S-51083",
            "commitDate": "2015-01-19T15:00:17-05:00",
            "commitHref": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
            "family": "GitHub",
            "message": "T-00003 mention # 0 on 0 in  1f4a0c96-5226-47ac-8d4f-8ecaac7cbca2 of family = GitHub",
            "repo": "openAgile/CommitStream.Web",
            "repoHref": "https://github.com/openAgile/CommitStream.Web",
            "sha1Partial": "3b80fa",
            "timeFormatted": "9 months ago"
        },
        {
            "action": "committed",
            "author": "kunzimariano",
            "branch": "teamRoomUX2_S-51083",
            "branchHref": "https://github.com/openAgile/CommitStream.Web/tree/teamRoomUX2_S-51083",
            "commitDate": "2015-01-19T15:00:17-05:00",
            "commitHref": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
            "family": "GitHub",
            "message": "T-00002 mention # 0 on 0 in  1f4a0c96-5226-47ac-8d4f-8ecaac7cbca2 of family = GitHub",
            "repo": "openAgile/CommitStream.Web",
            "repoHref": "https://github.com/openAgile/CommitStream.Web",
            "sha1Partial": "3b80fa",
            "timeFormatted": "9 months ago"
        },
        {
            "action": "committed",
            "author": "kunzimariano",
            "branch": "teamRoomUX2_S-51083",
            "branchHref": "https://github.com/openAgile/CommitStream.Web/tree/teamRoomUX2_S-51083",
            "commitDate": "2015-01-19T15:00:17-05:00",
            "commitHref": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
            "family": "GitHub",
            "message": "T-00001 mention # 0 on 0 in  1f4a0c96-5226-47ac-8d4f-8ecaac7cbca2 of family = GitHub",
            "repo": "openAgile/CommitStream.Web",
            "repoHref": "https://github.com/openAgile/CommitStream.Web",
            "sha1Partial": "3b80fa",
            "timeFormatted": "9 months ago"
        },
        {
            "action": "committed",
            "author": "kunzimariano",
            "branch": "teamRoomUX2_S-51083",
            "branchHref": "https://github.com/openAgile/CommitStream.Web/tree/teamRoomUX2_S-51083",
            "commitDate": "2015-01-19T15:00:17-05:00",
            "commitHref": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
            "family": "GitHub",
            "message": "S-00001 mention # 0 on 0 in  1f4a0c96-5226-47ac-8d4f-8ecaac7cbca2 of family = GitHub",
            "repo": "openAgile/CommitStream.Web",
            "repoHref": "https://github.com/openAgile/CommitStream.Web",
            "sha1Partial": "3b80fa",
            "timeFormatted": "9 months ago"
        }
    ]
}
```

### Explanation

* There are commits in this response that correspond to all three of the repositories (inboxes) that are part of the digest.
* The data has been normalized to have a common format across all the different version control systems that CommitStream support.
* You can process this JSON result with whatever tools you like to create valuable information about the commit activity of your teams.


# Other API Operations

In addition to querying, you can also use the API to create new resources. This can be helpful when you want to automate the creation of inboxes for repositories to associate them with a digest.

# Create an Inbox for a Repository

Each digest allows you to create an inbox for a particular repository by issuing a POST to a sub-resource of the digest.

* The structure of the URL is: `https://commitstream.v1host.com/api/`**instanceId**`/digests/`**digestId**`/inboxes?apiKey=`**apiKey**.
* You must send a `Content-Type: application/json` HTTP header.
* The structure of the body is:
```json
{
    "name": "RepositoryName",
    "url": "http://url/of/therepo",
    "family": "VcsFamily"
}
```
* The `family` value must be one of `GitHub`, `GitLab`, `Bitbucket`, or `VsoGit`.
* Here it is in action, creating a new inbox of family `GitHub`:

```bash
curl -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "name": "CommitStream.Web",
  "url": "https://www.github.com/openAgile/CommitStream.Web",
  "family": "GitHub"  
}' \
 'https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/digests/204600dd-4790-42e0-813e-37b632798751/inboxes?apiKey=0d6a6241-e256-4c54-a594-5fd51ccddb69'
```

### Response

```json
{
  "_links": {
    "self": {
      "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/inboxes/75a0a7b2-10fd-4b97-ae9b-73e4e0598c1f"
    },
    "digest-parent": {
      "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/digests/204600dd-4790-42e0-813e-37b632798751"
    },
    "add-commit": {
      "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/inboxes/75a0a7b2-10fd-4b97-ae9b-73e4e0598c1f/commits"
    },
    "inbox-remove": {
      "href": "https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/inboxes/75a0a7b2-10fd-4b97-ae9b-73e4e0598c1f"
    }
  },
  "inboxId": "75a0a7b2-10fd-4b97-ae9b-73e4e0598c1f",
  "family": "VsoGit",
  "name": "CommitStream.Web",
  "url": "https://www.github.com/openAgile/CommitStream.Web"
}
```

### Explanation

* The response contains the information we sent to it, but also the new server-generated `inboxId` and, most importantly:
* The `add-commit` href, which you will copy and paste into the hook setup for your repository in your VCS system so that it will send messages to this new CommitStream inbox. **Don't forget to add the `apiKey` parameter to this href, however. For example, we would use https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/inboxes/75a0a7b2-10fd-4b97-ae9b-73e4e0598c1f/commits?apiKey=0d6a6241-e256-4c54-a594-5fd51ccddb69.**

# Feedback

When we built CommitStream, we built a minimalistic API. There are lots of of other things that might be valuable for users of CommitStream. If you have some ideas, please let us know. You can also get involved in development, because the source code for CommitStream is open source! If you do play around with the code, VersionOne cannot guarantee that it will include your ideas into the official code base, but if you make something awesome, we'd love to hear about it and see if it makes sense to pull it in!

