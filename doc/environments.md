# Vision

> As openAgile, we want our build, test, and deployment for CommitStream to be as automated as possible, so that we can maximize the amount of time we spend responding to customer demand and delivering new functionality, and minimize the amount of time troubleshooting cumbersome, error-prone processes.

# Environments and branches

See [resources.md](resources.md) for the deployment view of the system. We are evolving toward the [Gitflow Workflow approach](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) approach for branches.

| STATUS        | Environment/Branch                                                                  | Description                                                   | Promotion criteria, info                                                                                                | 
| ------------- |-------------------------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| ON GOING      | feature branches                                                                    | Local on dev machines per story                               | After sufficient unit-testsing and exploratory testing with testers / users / hallway usability, merge into **develop** |
| ACTIVE        | develop/[develop](https://github.com/openAgile/CommitStream.Web/tree/develop)       | Per-iteration CI integration system                           | TODO: Full-Tests-OnSuccess: eligible for manual merge to **staging**                                                    |
| ACTIVE        | staging/[staging](https://github.com/openAgile/CommitStream.Web/tree/staging)       | Hosts the staging system                                      | TODO: Smoke-Tests-OnSuccess: auto-merge?? to **master**                                                                 |
| ACTIVE        | production/[master](https://github.com/openAgile/CommitStream.Web/tree/master)      | Hosts the production system which live customer instances use | This is it buddy                                                                                                        |
