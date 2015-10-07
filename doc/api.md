The CommitStream API is a REST API based on the [Hypertext Application Language](https://github.com/mikekelly/hal_specification), or HAL. This is a simple data format that allows servers to return resources that have not just simple data properties, but also link relationships to related resources. You can learn more about HAL on the GitHub link above, or in [this interview with HAL creator Mike Kelly](http://www.infoq.com/articles/web-apis-hal).

# Get started with the CommitStream API for VersionOne users: Find your `instanceId` and `apiKey` values

To make queries against the CommitStream API, you'll need the `instanceId` and `apiKey` that corresponds to your VersionOne instance. The easiest way to find this is by looking at one of the URLs generated for a repository when you add one in the CommitStream Admin page, or from the TeamRoom settings page if you're using a custom collection of repositories for your specific team. **Note that the instanceId and apiKey apply to your entire instance, not just to indivivudal teams or a an individual TeamRoom, however.**

* Open the CommitStream Admin page. If you have no repositories added yet, the screen should look like this:





