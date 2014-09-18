# Deployment scenarios

There are 8 potential deployment configuration families for CommitStream. The one we are focusing now is:

**On Demand V1 + Cloud CS + Cloud VCS (specfically, GitHub)**

Other types are:

* On Demand V1 + Cloud CS + On Premise VCS
* On Premise V1 + Cloud CS + Cloud VCS
* On Premise V1 + Cloud CS + On Premise VCS
* On Demand V1 + On Premise CS + On Premise VCS
* On Premise V1 + On Premise CS + On Premise VCS
* On Premise V1 + On Premise CS + Cloud VCS
* On Demand V1 + On Premise CS + Cloud VCS

With proper design, all of these could work, but we should select one for first implementation, and think through the implications for the others such that we do not box ourselves into a corner while implementing the first.

# Toggling CommitStream integration for a VersionOne instance

**Note:** that there is a similar project, https://github.com/versionone/remote-features, which could possibly be used for part of what we need to do, but I don't think handles the server-side poll to an independent service as described below.

At a high level, here's what the VersionOne Core application must do to work with CommitStream

* Upon start up or during some other first-time execution of a code path, determine whether the CommitStream feature is enabled
 * When yes, then ensure that when an Asset Detail page gets rendered, that code runs on the client to query CommitStream for the given asset.
  * When commits found, then render HTML for the side-panel button such that when clicked it displays the commit info in the content area of the panel
 * When no, then ensure that no additional HTTP calls on the client get made related to CommitStream until the feature gets enabled

## Goals and options for toggling feature in VersionOne instance

###Goals###

* Minimize work that Ops has to do
* Minimize amount of code baked into Core builds
 * Correlate: Strive for Continuous Delivery
* Allow customer to signup via their own instance, perhaps only after we have enabled them to see the option via our own remote action. See details below in the Hybrid approach.

###Implementation options###

## Full Continuous Delivery (CD)

* Bake into Core a simple poller that reaches out to a CommitStream cloud instance and asks, effectively, "Is CommitStream enabled for this instance?" 
 * When not currently enabled
  * If yes, then pull down the latest CS DLL which takes care of integrating itself into the side-panel (and anywhere else) via System.ComponentModel.Compisition magic (MEF)
  * If no, poll again on next incoming HTTP request if-and-only-if N minutes have elapsed since the previous poll.
 * When currently enabled
  * If yes, POTENTIALLY: then query for a newer version of the CS DLL and update it in-place if a newer version exists.
   * Ideally, there is very little inside this DLL other than wiring into already-defined extension mechanisms for weaving CS UI into well-known extension points within the UI surface
  * If no, then remove the CS DLL from the server
  
## Admin-mediated CD  

* Bake into Core an Integrations configuration page that allows an admin to enable CommitStream and configure it (and perhaps other integrations later)
 * The bulk of this page could itself be fetched from a remote host instead of being primarily a compiled DLL. It would almost be an app-catalog lite inside the app.
* When selected to enable CS, then most of the flow described above remains the same regarding getting the latest version of CS. 

## Hybrid approach

* Add functionality to Core for the Admin page, but also add a poller that lets VersionOne decide which customers get to see the page. This allows us to give control to the Admin for the actual configuration experience, but allows us to be selective with which customers we allow to try it.
 * Eventually, this poller could get removed unless we wanted to keep it in in order to disable CS or other integrations when customers fail to pay or the service is having issues -- However in the latter case, the service should provide information to the user within the application in place of where data from the service would normally go.


