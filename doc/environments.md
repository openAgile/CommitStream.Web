# Vision

> As openAgile, we want our build, test, and deployment for CommitStream to be as automated as possible, so that we can maximize the amount of time we spend responding to customer demand and delivering new functionality, and minimize the amount of time troubleshooting cumbersome, error-prone processes.

# Environments and branches

See [resources.md](resources.md) for the deployment view of the system.

| STATUS        | Environment/Branch    | Description                         | Promoition criteria, info                                                                                                | 
| ------------- |-----------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| ON GOING      | feature branches      | Local on dev machines per story     | After sufficient unit-testsing and exploratory testing with testers / users / hallway usability, merge into [developing] |
| TODO          | developing/developing | Runs full automated tests on build  | Full-Test-Suite-OnSuccess: promote to [staging]                                                                          |
| IN PROGRESS   | staging/S-48324_MultiRepository | Hosts the staging system  | SmokeTests-OnSuccess: promote to [master]                                                                                | 
| TODO          | production/master     |  Hosts the production system which live customer instances use | This is it buddy

## TODOs 
* Linkify these
* Replace S-4.. with a real staging branch
