# Vision

> As openAgile, we want our build, test, and deployment for CommitStream to be as automated as possible, so that we can maximize the amount of time we spend responding to customer demand and delivering new functionality, and minimize the amount of time troubleshooting cumbersome, error-prone processes.

# Environments Summary

See [resources.md](resources.md) for all Azure resources in use for CommitStream, including some that are used temporarily or only on-demand. Note also that we are evolving toward the [Gitflow Workflow approach](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) approach for branches.

* [DEV](http://localhost:6565): Do feature branch work here in your local environment
* [TEST](https://v1-cs-test.azurewebsites.net): Test work from [develop](https://github.com/openAgile/CommitStream.Web/tree/develop) branch here in Azure before merging into [staging](https://github.com/openAgile/CommitStream.Web/tree/staging) branch. OK to also deploy from different feature branches when needed before merging into develop.
* [DEMO](https://v1cs-demo.azurewebsites.net): Use this to demonstrate CommitStream to customers or others with code deployed from [v1cs-demo](https://github.com/openAgile/CommitStream.Web/tree/v1cs-demo) branch. **Please never point this at PROD EventStore or PROD service.**
* [STAGING](https://commitstream-staging.azurewebsites.net): Test UI and read-only functional changes on [staging](https://github.com/openAgile/CommitStream.Web/tree/staging) branch here *pointed at PROD EventStore*, so don't test features that modify data or EventStore projections here.
* [PROD](https://commitstream.v1host.com): This is the real deal. There is no branch for this. Instead, we use the [Slot Swap](https://azure.microsoft.com/en-us/documentation/articles/web-sites-staged-publishing/) feature in Azure to move staging into production.

# Environments Details and Code Promotion

## Caveats

* PROD and STAGING both point that the **PROD EventStore**, take heed as noted above and below.
* TEST and DEMO point at the same copy of EventStore, so take care to coordinate here when testing and demoing

## DEV

### Purpose

All work happens on feature branches developing locally by developers. See [contributing.md](contributing.md) for branching and pull-request approach.

### Configuration

Get all setup with [install.md](install.md).

* EventStore: [http://localhost:2113](http://localhost:2113)
* App: [http://localhost:6565](http://localhost:2113)
* Branch: It depends on what you're working on :-D

#### Cheatsheet

##### Point your VersionOne at your local CommitStream

This will point CommitStream at [http://localhost:6565](http://localhost:2113):

```bash
bundle exec rake generate:userconfig
```

##### Run unit tests

```bash
npm test
```

##### Run integration tests

```bash
mssm stop eventstore
. ./instance-support-tests.sh
```

##### Work on the app with transpilation of ES6 and LESS in the background

It's awesome. Try it, you'll love it:

```
grunt dev
```

## TEST

### Purpose

Test work from [develop](https://github.com/openAgile/CommitStream.Web/tree/develop) branch here in Azure before merging into [staging](https://github.com/openAgile/CommitStream.Web/tree/staging) branch. OK to also deploy from different feature branches when needed before merging into develop.

### Configuration

* EventStore: https://v1commitstream.cloudapp.net:2113
* App: https://v1-cs-test.azurewebsites.net, 
* Branch: https://github.com/openAgile/CommitStream.Web/tree/develop

### How to Deploy

* PUSH commits to develop branch
* Azure will redploy from the branch

## DEMO

### Purpose

Use this to demonstrate CommitStream to customers or others with code deployed from [v1cs-demo](https://github.com/openAgile/CommitStream.Web/tree/v1cs-demo) branch. **Please never point this at PROD EventStore or PROD service.**

### Configuration

* EventStore: https://v1commitstream.cloudapp.net:2113
* App: https://v1cs-demo.azurewebsites.net
* VersionOne Instance: https://v1commitstream.cloudapp.net/V1Demo
* Branch: https://github.com/openAgile/CommitStream.Web/tree/v1cs-demo
* TODO: Should we have some setup for GitHub, GitLab, etc repos already configured and pointed here
  * And: Should we have an EventStore backup that we can just roll back onto for Demos?
    * And: How cool would it be to automate this with a `grunt` command?
      * Precedent automation via Powershell remoting exists in the Clarity Project, including scripts that can upload and deploy a new VersionOne build into Azure.

### How to Deploy

* PUSH commits to develop branch
* Azure will redploy from the branch

## STAGING

### Purpose

Test UI and read-only functional changes on [staging](https://github.com/openAgile/CommitStream.Web/tree/staging) branch here *pointed at PROD EventStore*, so don't test features that modify data or EventStore projections here.


### Configuration

* EventStore: **PROD https://eventstore-cluster.cloudapp.net:2113**
* App: https://commitstream-staging.azurewebsites.net
* Branch: https://github.com/openAgile/CommitStream.Web/tree/staging

### How to Deploy

* PUSH commits to staging branch
* Azure will redploy from the branch

## PROD

### Purpose

This is the real deal. There is no branch for this. Instead, we use the [Slot Swap](https://azure.microsoft.com/en-us/documentation/articles/web-sites-staged-publishing/) feature in Azure to move staging into production.


### Configuration

* EventStore: **PROD https://eventstore-cluster.cloudapp.net:2113**
* App: https://commitstream.v1host.com, https://commitstream.azurewebsites.net
* Branch: NONE

### How to Deploy

* First, update STAGING and perform manual smoke tests as necessary
* Second, from Azure perform the Slot Swap function to move `commitstream(staging)` to `commitstream`
  * TODO: Add grunt command for this using the [azure-cli](https://www.npmjs.com/package/azure-cli)
