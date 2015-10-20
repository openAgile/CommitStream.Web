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
* Exmaple to query for commits against a single Workitem: 

> https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/commits/tags/versionone/workitem?numbers=S-00001&apiKey=db479bc8-bb3b-48de-ac05-fd5c8c0a089f

* Example to query for commits against two (or more) Workitems:

> https://commitstream.v1host.com/api/48bf06cb-9b84-4700-9325-2df87b93e227/commits/tags/versionone/workitem?numbers=S-00001,S-00002,S-00003&apiKey=db479bc8-bb3b-48de-ac05-fd5c8c0a089f

## Example Single-Workitem Query with cURL

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

## Example Multi-Workitem Query with cURL

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

TODO
