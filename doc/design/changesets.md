# Commit Service: Use ChangeSets?

This doc was created by Ian Buchanan to discuss ChangeSets versus CommitStream.

* Assertion 1: We built ChangeSets for integration. We should use them.
* Assertion 2: If we don't use ChangeSets, we should drop them.

## ChangeSets for Integration

### Appealing to Principles of Good Design

* Separation of concerns. Version control is a bounded context -- a concern; therefore, the Commit Service represents a distinct system which should have as little overlap in functionality as possible with the VersionOne Application.
  * ChangeSets in meta add one more thing for developers to learn. Not good for the VersionOne Application. The single biggest problem with people wanting to use rest-1/query.v1 is that meta isn't documented with any human readable semantics. Having more in meta just makes it harder to document it.
  * We want to add new features to query by author or branch. We don't want to have to add code in 2 different code bases to make it work.
  * We want to secure the commit data appropriately. We don't want to struggle with 2 security models. Securing ChangeSets in meta would break existing integrations.
  * It is possible to "fix" ChangeSets but at the cost of creating many unnecessary inter-team dependencies. We would need sherpa time from Raj/Pavel for meta. We would need reporting time from Jerry. We would need UI time from Improvements. We should not create inter-team dependencies when we can avoid them.

* Single Responsibility principle. The VersionOne Application does not really have components or modules designed for only a specific feature. But here is an opportunity to carve out a responsibility and locate it in one place -- the Commit Service.
  * ChangeSets coupled with other assets make it difficult to developers to learn how to use it.
  * We want 3rd party developers to know where to go to extend or adapt the Commit Service. We do not want developers to learn multiple systems to make a change.

* Law of Demeter. In order to use ChangeSets, Commit Service needs to know the internal details (the data attributes) of another system.
  * Integrating via a data API is fundamentally flawed as high coupling. We don't want synchronization, we want linking.
  * VersionOne frequently makes changes that are potentially breaking for integrations (Epics, Conversations, Descriptions). We don't manage these changes with comprehensive testing. Lower coupling means fewer defects and support issues.
  * Just as we "don't ask, tell" for version control tools, integration with the VersionOne application should follow the same principle. Commit Service should send messages indicating intent.

* Don’t repeat yourself (DRY). Commit Service is already parsing out data from commit messages. It should not need to repeat the data in the VersionOne Application.
  * There should not be multiple APIs to consider when developers want to create a new integration. Should I read from rest-1 or Commit Service?

* Minimize upfront design. The ChangeSet asset is a strongly-typed data structure that inherits many unnecessary attributes and operations. All of these are YAGNI that add unnecessary complexity to VersionOne itself and clients that want to consume the ChangeSet.
  * ChangeSets are largely immutable and stateless assets. They don't need AssetState, Moments, History, or the related historical attributes (ChangeDate, ChangedBy, etc). Hence, they also don't need validators for state changes (for example, CanUpdate).
  * ChangeSets don't need Attachments or EmbeddedImages.

### Specific Problems

* Poor UI. It's not that ChangeSets are any worse than any other relationship. I have to click relations to see them. Then I click a ChangeSet to see one. Then I click relations again to see the Link. Then I can navigate to the actual ChangeSet. There's no place to see all the ChangeSets and their relationships to workitems.
* No reporting. As Jerry pointed out, people have been asking for ChangeSets in reporting for a long time. This is not just a matter of customer demand, this is also a means to differentiate the integration from others and to provide a chain of value from project managers to developers. Although I'm sure customers did ask for ChangeSets in Data Mart, I need reporting about commits that works for all Editions.
* No security. 
* Missing attributes/relationships. Repo, author, branch.

## Dropping ChangeSets

* Don't break existing VCS integrations.
* Don't break existing Build integrations.
