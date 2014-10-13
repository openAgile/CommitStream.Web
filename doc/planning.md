# Summary

> Using a version control system is the most ubiquitous agile development practice, with 80% of organizations reporting this behavior (SD Times 2011 survey). CommitStream leverages this behavior to deliver relevant, timely, and well-summarized reports directly to all stakeholders: developers, testers, managers, and executives alike. This empowers organizations to see progress, respond to impediments, and react to change on a daily basis.


CommitStream is an open source application that allows software developers, managers, and other stakeholders stay on the same page about what software is changing, why it's changing, and how frequently it's changing. It helps everyone stay focused on what they do best while strengthening an organization's ability to react to change.

Here's how it works:

* First, as a team, you decide what **mention patterns** you will place into your code commit messages to signify important information that CommitStream should summarize automatically
  * Then, you find a developer on your team who knows just a bit of JavaScript to teach CommitStream to recognize your mention patterns. Stay tuned for more information about this. TODO: provide a How-To create projections document.
* Second, you tell CommitStream to configure one or more of a variety of version control tools to send commit messages to it
* Third, as a developer, when you check in code, you simply embed one or more **mention patterns** into the message
* Fourth, your version control system sends the commit message to CommitStream where it gets parsed and correlated with previous mentions
* Finally, as a manager or other stakeholder, you view reports from CommitStream that help you see the daily progress 

# Integration with VersionOne

The first commercial product to integrate CommitStream is [VersionOne](http://www.versionone.com). VersionOne provides agile project management software that teams use to divide work into a series of iterations, broken down most often by Story, Task, Test, and Defect workitems.

## Value proposition

For development teams practicing version control, who want to improve Continuous Integration and Continuous Deployment:

**CommitStream** is a simple, easy-to-apply web service, that connects version control systems to VersionOne.

Our solution enables more people to understand what code is changing and why, which leads to better alignment and faster feedback across the organization,

CommitStream eliminates the need for 1-1 version control integrations with pre-built support for the most popular version control tools

## Details
VersionOne tracks planned work with **mention patterns** that look like S-12345, T-23441, D-00124, etc. These mean Story, Test, and Defect. When developers check in code, they simply embed these mentions into their commit messages, and CommitStream takes care of summarizing and reporting correlated and aggregated information about source-code-level activity happening across any number of code repositories. Finally, any team member on a project can view the commit information within the VersionOne software where they normally view details about Stories, Tasks, or Defects.

TODO: diagram or screen shots that depict this flow for VersionOne succinctly

## See it in VersionOne

You can see CommitStream integrated within VersionOne here: 

[VersionOne running with CommitStream](http://v1commitstream.cloudapp.net/VersionOne/Default.aspx?menu=PrimaryBacklogPage)

* Login in with admin/admin
* Click the **Hello world!** story to view the Story's details.
* You should see something like this:

![CommitStream in VersionOne](https://s3.amazonaws.com/uploads.hipchat.com/12722/130235/RnXR8nbRwcAapyn/upload.png)

## Try it yourself

* All the source code is open source, and you can clone this repository and follow the instructions in [install.md] to get it up and running in your local environment.
* To chat with the main developers, jump into the [VersionOne openAgile HipCht room](http://www.hipchat.com/gPrJ5JgFd)!

# Background docs

Some of these are internal to VersionOne. If you'd like to see them, just ask us.

## Historical

* [Ian Buchanan's Version Control Opportunity assessment doc](http://confluence/display/V1Integrations/Version+Control+Opportunity)
* [Early User Story outline](http://confluence/display/V1Integrations/Commit+Service+User+Stories)
* [Early functional prototype of CommitStream](http://confluence/display/V1Integrations/Commit+Service+3PM)
* [Version Control EQPAs](http://confluence/display/V1Integrations/Version+Control+Integration+EQPAs)

## Current

* [Next in-VersionOne UX flow sketch: Configure CommitStream to receive commits from my GitHub repositories story](https://docs.google.com/document/d/152dzB0ot_F0JuO4PTzPWkgGf1TlAA7KpZG1h9dsNc5w/edit)
  * [VersionOne story link](https://www7.v1host.com/V1Production/Account.mvc/LogIn?destination=%2FV1Production%2Fstory.mvc%2FSummary%3FoidToken%3DStory%3A498402)

## Other recent
* [Ian Buchanan's CommitStream presentation](https://github.com/versionone/CommitStream.Archived/blob/master/CommitStream-Spike-Joe-Ira/doc/Integrating_VCS_with_VersionOne.pptx)
* [Getting Starting with CommitStream mockups](https://github.com/versionone/CommitStream.Archived/blob/master/CommitStream-Spike-Joe-Ira/doc/GettingStartedFlow.pdf)
* [More documents, diagrams, API sketches, etc](https://github.com/versionone/CommitStream.Archived/tree/master/CommitStream-Spike-Joe-Ira/doc)
