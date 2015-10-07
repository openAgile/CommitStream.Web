The CommitStream API is a REST API based on the [Hypertext Application Language](https://github.com/mikekelly/hal_specification), or HAL. This is a simple data format that allows servers to return resources that have not just simple data properties, but also link relationships to related resources. You can learn more about HAL on the GitHub link above, or in [this interview with HAL creator Mike Kelly](http://www.infoq.com/articles/web-apis-hal).

# Get started with the CommitStream API for VersionOne users: Find your `instanceId` and `apiKey` values

To make queries against the CommitStream API, you'll need the `instanceId` and `apiKey` that corresponds to your VersionOne instance. The easiest way to find this is by looking at one of the URLs generated for a repository when you add one in the CommitStream Admin page, or from the TeamRoom settings page if you're using a custom collection of repositories for your specific team. **Note that the instanceId and apiKey apply to your entire instance, not just to indivivudal teams or a an individual TeamRoom, however.**

* Open the CommitStream Admin page. If you have no repositories added yet, the screen should look like this:
![image](https://cloud.githubusercontent.com/assets/1863005/10340553/aacc9ebc-6cde-11e5-961b-629abc8f6258.png)
* If you don't have any repositories, add a new one (it doesn't matter which type of VCS), and then you should see something like this:
![image](https://cloud.githubusercontent.com/assets/1863005/10341224/e353a386-6ce1-11e5-94b0-1195cff238cd.png)




