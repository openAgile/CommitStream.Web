# Deployment scenarios

There are 8 potential deployment configuration families for CommitStream. The one we are focusing now is:

**On Demand V1 + Cloud CS + Cloud VCS (specfically, GitHub)**

Other types are:

* On Demand V1 + Cloud CS + On Premise VCS (specfically, Subversion)
* On Premise V1 + Cloud CS + Cloud VCS
* On Premise V1 + Cloud CS + On Premise VCS
* On Premise V1 + On Premise CS + On Premise VCS
* On Premise V1 + On Premise CS + Cloud VCS
* On Demand V1 + On Premise CS + On Premise VCS
* On Demand V1 + On Premise CS + Cloud VCS

With proper design, all of these could work, but we should select one for first implementation, and think through the implications for the others such that we do not box ourselves into a corner while implementing the first.

# Release CommitStream Features

If we separate the idea of release from deployment, then release is about revealing CommitStream features to customers while deployment is about getting code changes into production. This means the concerns for release are different from deployment. For example, we want to reveal CommitStream to specific early access customers but we want to make code deployment simple (not have a different deployment process for those early access customers). Abstractly, we need a "feature flag" that can be enabled for on-demand instances to reveal the CommitStream capabilities. Conversely, for the majority of customers who do not have the feature flag enabled, we need to make sure there is virtually no production or user impact, such as tell-tale UI elements or performance degredation.

## Toggling CommitStream integration for a VersionOne instance

**Note:** that there is a similar project, https://github.com/versionone/remote-features, which could possibly be used for part of what we need to do, but I don't think handles the server-side poll to an independent service as described below.

At a high level, here's what the VersionOne Core application must do to work with CommitStream

* Upon start up or during some other first-time execution of a code path, determine whether the CommitStream feature is enabled
 * When yes, then ensure that when an Asset Detail page gets rendered, that code runs on the client to query CommitStream for the given asset.
  * When commits found, then render HTML for the side-panel button such that when clicked it displays the commit info in the content area of the panel
 * When no, then ensure that no additional HTTP calls on the client get made related to CommitStream until the feature gets enabled

## Goals for Enabling Release Activities

* Let deployment be an Ops concern, separate from release activities. Minimize, even eliminate, work for Ops in release activities.
* Let release be a business concern, as manifest by Product Management decisions. Put control of release into Product Manager's control.

# Deploy CommitStream Components

Deployment is about getting code changes into production.

## Goals for Enabling Deployment Activities

* With release activities separated from deployment, we should strive for continuous delivery.
* Make the process visible. Everyone can see that code changes are being made, that changes are checked with tests, and that code is successfully deployed into production.
* Minimize work that Ops has to do for deployment of CommitStream features.
* Minimize amount of code baked into Core builds. Coupling to the deployment of Core will make it slower to get changes into production.

# Monitor CommitStream

Monitoring is about knowing what is happening in production.

## Goals for Enabling Monitoring

* Ops knows how to respond to incidents.
* Ops works with Dev to indentify and eliminate the underlying problems.
* The business (PM) knows how CommitStream is being used and can use the data to improve CommitStream.
* The business (PM) knows who wants to have early access to CommitStream.

# Implementation options

## Full Continuous Delivery (CD)

* Bake into Core a simple poller that reaches out to a CommitStream cloud instance and asks, effectively, "Should CommitStream enabled for this instance?" 
  * When CS is not currently enabled and the answer is:
    * Yes: then pull down the latest CS DLL which takes care of integrating itself into the side-panel (and anywhere else) via System.ComponentModel.Compisition magic (MEF)
    * No: then poll again on next incoming HTTP request if-and-only-if N minutes have elapsed since the previous poll.
  * When CS is currently enabled and the answer is:
    * Yes: Then (potentially??) query for a newer version of the CS DLL and update it in-place if a newer version exists.
      * Ideally, there is very little inside this DLL other than wiring into already-defined extension mechanisms for weaving CS UI into well-known extension points within the UI surface
    * No: Then remove the CS DLL from the server
  
## Admin-mediated CD  

* Bake into Core an Integrations configuration page that allows an admin to enable CommitStream and configure it (and perhaps other integrations later)
 * The bulk of this page could itself be fetched from a remote host instead of being primarily a compiled DLL. It would almost be an app-catalog lite inside the app.
* When selected to enable CS, then most of the flow described above remains the same regarding getting the latest version of CS. 

## Hybrid approach

* Add functionality to Core for the Admin page, but also add a poller that lets VersionOne decide which customers get to see the page. This allows us to give control to the Admin for the actual configuration experience, but allows us to be selective with which customers we allow to try it.
 * Eventually, this poller could get removed unless we wanted to keep it in in order to disable CS or other integrations when customers fail to pay or the service is having issues -- However in the latter case, the service should provide information to the user within the application in place of where data from the service would normally go.

 
## Improvement Ideas and TODO's

* In order to  streamline working with jenkins build we can make a copy of the CommitStream-core-developing
(http://ci-server/job/CommitStream-core-developing) that mocks the full process but actually takes the latest build without compiling and building. this would allow  running jenkins in a test/debug mode and cut down on wait time when testing builds
