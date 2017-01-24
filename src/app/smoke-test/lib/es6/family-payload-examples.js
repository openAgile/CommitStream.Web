export default {
	Deveo: {
		validWithOneCommit: message => ({
    "after": "67ec79c2cc2737eec07b649555b3da32c47d095b",
    "ref": "refs/heads/master",
    "before": "c58a421ed77556d217abc7638de9ba9b3589b36d",
    "compare": "",
    "forced": false,
    "created": false,
    "deleted": false,
    "project": {
        "uuid": "c788fd2a-788c-4888-8673-90e027b1b849",
        "name": "Test project",
        "url": "https://deveo.com/example/code/diff/test"
    },
    "repository": {
        "uuid": "ff8f33e9-d619-493e-872d-be7dd4a10235",
        "name": "website",
        "type": "git",
        "url": "https://deveo.com/example/code/overview/test/repositories/website",
        "https_url": "https://deveo.com/example/projects/test/repositories/git/website",
        "ssh_url": "deveo@deveo.com:deveo/projects/test/repositories/git/website",
        "owner": {
            "uuid": "a94ea07c-4590-4dc9-b397-c83ca5daf976",
            "name": "chuck",
            "email": "chuck@deveo.com"
        }
    },
    "pusher": {
        "uuid": "a94ea07c-4590-4dc9-b397-c83ca5daf976",
        "name": "chuck",
        "display_name": "Chuck Norris"
    },
    "commit_count": 1,
    "commits": [{
        "distinct": true,
        "removed": [],
        "message": "Update readme",
        "added": [],
        "timestamp": "2015-01-30T12:17:56Z",
        "modified": ["readme"],
        "url": "https://deveo.com/example/code/diff/test/repositories/website/commits/67ec79c2cc2737eec07b649555b3da32c47d095b",
        "author": {
            "name": "Chuck Norris",
            "email": "chuck@deveo.com"
        },
        "id": "67ec79c2cc2737eec07b649555b3da32c47d095b"
    }]
})
	},
	GitHub : {
		validWithOneCommit: message => ({
			"ref": "refs/heads/teamRoomUX2_S-51083",
			"before": "300417ed43da3a6819d9ee329e06275e0a377a0c",
			"after": "3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
			"created": false,
			"deleted": false,
			"forced": false,
			"base_ref": null,
			"compare": "https://github.com/openAgile/CommitStream.Web/compare/300417ed43da...3b80fa1b0b56",
			"commits": [{
			"id": "3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
			"distinct": true,
			"message": `${message}`,
			"timestamp": "2015-01-19T17:00:17-03:00",
			"url": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
			"author": {
				"name": "kunzimariano",
				"email": "kunzi.mariano@gmail.com",
				"username": "kunzimariano"
			},
			"committer": {
				"name": "kunzimariano",
				"email": "kunzi.mariano@gmail.com",
				"username": "kunzimariano"
			},
			"added": [
				"src/app/client/commitsContainer.html",
				"src/app/client/commitsList.html"
			],
			"removed": [
				"src/app/client/assetDetailCommits.html",
				"src/app/client/assetDetailInit.html"
			],
			"modified": [
				"src/app/views/app.handlebars"
			]
			}],
			"head_commit": {
			"id": "3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
			"distinct": true,
			"message": `${message}`,
			"timestamp": "2015-01-19T17:00:17-03:00",
			"url": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
			"author": {
				"name": "kunzimariano",
				"email": "kunzi.mariano@gmail.com",
				"username": "kunzimariano"
			},
			"committer": {
				"name": "kunzimariano",
				"email": "kunzi.mariano@gmail.com",
				"username": "kunzimariano"
			},
			"added": [
				"src/app/client/commitsContainer.html",
				"src/app/client/commitsList.html"
			],
			"removed": [
				"src/app/client/assetDetailCommits.html",
				"src/app/client/assetDetailInit.html"
			],
			"modified": [
				"src/app/views/app.handlebars"
			]
			},
			"repository": {
			"id": 23838815,
			"name": "CommitStream.Web",
			"full_name": "openAgile/CommitStream.Web",
			"owner": {
				"name": "openAgile",
				"email": null
			},
			"private": false,
			"html_url": "https://github.com/openAgile/CommitStream.Web",
			"description": "CommitStream Web Server",
			"fork": false,
			"url": "https://github.com/openAgile/CommitStream.Web",
			"forks_url": "https://api.github.com/repos/openAgile/CommitStream.Web/forks",
			"keys_url": "https://api.github.com/repos/openAgile/CommitStream.Web/keys{/key_id}",
			"collaborators_url": "https://api.github.com/repos/openAgile/CommitStream.Web/collaborators{/collaborator}",
			"teams_url": "https://api.github.com/repos/openAgile/CommitStream.Web/teams",
			"hooks_url": "https://api.github.com/repos/openAgile/CommitStream.Web/hooks",
			"issue_events_url": "https://api.github.com/repos/openAgile/CommitStream.Web/issues/events{/number}",
			"events_url": "https://api.github.com/repos/openAgile/CommitStream.Web/events",
			"assignees_url": "https://api.github.com/repos/openAgile/CommitStream.Web/assignees{/user}",
			"branches_url": "https://api.github.com/repos/openAgile/CommitStream.Web/branches{/branch}",
			"tags_url": "https://api.github.com/repos/openAgile/CommitStream.Web/tags",
			"blobs_url": "https://api.github.com/repos/openAgile/CommitStream.Web/git/blobs{/sha}",
			"git_tags_url": "https://api.github.com/repos/openAgile/CommitStream.Web/git/tags{/sha}",
			"git_refs_url": "https://api.github.com/repos/openAgile/CommitStream.Web/git/refs{/sha}",
			"trees_url": "https://api.github.com/repos/openAgile/CommitStream.Web/git/trees{/sha}",
			"statuses_url": "https://api.github.com/repos/openAgile/CommitStream.Web/statuses/{sha}",
			"languages_url": "https://api.github.com/repos/openAgile/CommitStream.Web/languages",
			"stargazers_url": "https://api.github.com/repos/openAgile/CommitStream.Web/stargazers",
			"contributors_url": "https://api.github.com/repos/openAgile/CommitStream.Web/contributors",
			"subscribers_url": "https://api.github.com/repos/openAgile/CommitStream.Web/subscribers",
			"subscription_url": "https://api.github.com/repos/openAgile/CommitStream.Web/subscription",
			"commits_url": "https://api.github.com/repos/openAgile/CommitStream.Web/commits{/sha}",
			"git_commits_url": "https://api.github.com/repos/openAgile/CommitStream.Web/git/commits{/sha}",
			"comments_url": "https://api.github.com/repos/openAgile/CommitStream.Web/comments{/number}",
			"issue_comment_url": "https://api.github.com/repos/openAgile/CommitStream.Web/issues/comments/{number}",
			"contents_url": "https://api.github.com/repos/openAgile/CommitStream.Web/contents/{+path}",
			"compare_url": "https://api.github.com/repos/openAgile/CommitStream.Web/compare/{base}...{head}",
			"merges_url": "https://api.github.com/repos/openAgile/CommitStream.Web/merges",
			"archive_url": "https://api.github.com/repos/openAgile/CommitStream.Web/{archive_format}{/ref}",
			"downloads_url": "https://api.github.com/repos/openAgile/CommitStream.Web/downloads",
			"issues_url": "https://api.github.com/repos/openAgile/CommitStream.Web/issues{/number}",
			"pulls_url": "https://api.github.com/repos/openAgile/CommitStream.Web/pulls{/number}",
			"milestones_url": "https://api.github.com/repos/openAgile/CommitStream.Web/milestones{/number}",
			"notifications_url": "https://api.github.com/repos/openAgile/CommitStream.Web/notifications{?since,all,participating}",
			"labels_url": "https://api.github.com/repos/openAgile/CommitStream.Web/labels{/name}",
			"releases_url": "https://api.github.com/repos/openAgile/CommitStream.Web/releases{/id}",
			"created_at": 1410275937,
			"updated_at": "2014-12-31T16:07:10Z",
			"pushed_at": 1421697626,
			"git_url": "git://github.com/openAgile/CommitStream.Web.git",
			"ssh_url": "git@github.com:openAgile/CommitStream.Web.git",
			"clone_url": "https://github.com/openAgile/CommitStream.Web.git",
			"svn_url": "https://github.com/openAgile/CommitStream.Web",
			"homepage": "",
			"size": 4074,
			"stargazers_count": 1,
			"watchers_count": 1,
			"language": "JavaScript",
			"has_issues": true,
			"has_downloads": true,
			"has_wiki": true,
			"has_pages": false,
			"forks_count": 3,
			"mirror_url": null,
			"open_issues_count": 1,
			"forks": 3,
			"open_issues": 1,
			"watchers": 1,
			"default_branch": "master",
			"stargazers": 1,
			"master_branch": "master",
			"organization": "openAgile"
			},
			"pusher": {
			"name": "kunzimariano",
			"email": "kunzi.mariano@gmail.com"
			},
			"organization": {
			"login": "openAgile",
			"id": 6954603,
			"url": "https://api.github.com/orgs/openAgile",
			"repos_url": "https://api.github.com/orgs/openAgile/repos",
			"events_url": "https://api.github.com/orgs/openAgile/events",
			"members_url": "https://api.github.com/orgs/openAgile/members{/member}",
			"public_members_url": "https://api.github.com/orgs/openAgile/public_members{/member}",
			"avatar_url": "https://avatars.githubusercontent.com/u/6954603?v=3",
			"description": null
			},
			"sender": {
			"login": "kunzimariano",
			"id": 1418295,
			"avatar_url": "https://avatars.githubusercontent.com/u/1418295?v=3",
			"gravatar_id": "",
			"url": "https://api.github.com/users/kunzimariano",
			"html_url": "https://github.com/kunzimariano",
			"followers_url": "https://api.github.com/users/kunzimariano/followers",
			"following_url": "https://api.github.com/users/kunzimariano/following{/other_user}",
			"gists_url": "https://api.github.com/users/kunzimariano/gists{/gist_id}",
			"starred_url": "https://api.github.com/users/kunzimariano/starred{/owner}{/repo}",
			"subscriptions_url": "https://api.github.com/users/kunzimariano/subscriptions",
			"organizations_url": "https://api.github.com/users/kunzimariano/orgs",
			"repos_url": "https://api.github.com/users/kunzimariano/repos",
			"events_url": "https://api.github.com/users/kunzimariano/events{/privacy}",
			"received_events_url": "https://api.github.com/users/kunzimariano/received_events",
			"type": "User",
			"site_admin": false
			}
		})
	},

	GitLab: {
		validWithOneCommit: message => ({
			"object_kind": "push",
			"before": "95790bf891e76fee5e1747ab589903a6a1f80f22",
			"after": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
			"ref": "refs/heads/master",
			"user_id": 4,
			"user_name": "John Smith",
			"user_email": "john@example.com",
			"project_id": 15,
			"repository": {
				"name": "Diaspora",
				"url": "git@example.com:mike/diasporadiaspora.git",
				"description": "",
				"homepage": "http://example.com/mike/diaspora",
				"git_http_url": "http://example.com/mike/diaspora.git",
				"git_ssh_url": "git@example.com:mike/diaspora.git",
				"visibility_level": 0
			},
			"commits": [{
				"id": "b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
				"message": `${message}`,
				"timestamp": "2011-12-12T14:27:31+02:00",
				"url": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
				"author": {
					"name": "Jordi Mallach",
					"email": "jordi@softcatala.org"
				}
			}],
			"total_commits_count": 4
		})
	},

	Bitbucket: {
		validWithOneCommit: message => ({
			"push": {
				"changes": [{
					"new": {
						"name": "master",
						"target": {
							"hash": "24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
							"author": {
								"raw": "Mariano Kunzi <kunzi.mariano@gmail.com>",
								"user": {
									"display_name": "Mariano Kunzi",
									"uuid": "{ebc966b1-5081-461c-98dc-b297d932d25b}",
									"username": "kunzimariano",
									"type": "user",
									"links": {
										"html": {
											"href": "https://bitbucket.org/kunzimariano/"
										},
										"self": {
											"href": "https://api.bitbucket.org/2.0/users/kunzimariano"
										},
										"avatar": {
											"href": "https://bitbucket.org/account/kunzimariano/avatar/32/"
										}
									}
								}
							},
							"type": "commit",
							"parents": [{
								"hash": "2bc4f8d850c67adf9d061755d4cf387cf63ce0dd",
								"type": "commit",
								"links": {
									"html": {
										"href": "https://bitbucket.org/kunzimariano/test/commits/2bc4f8d850c67adf9d061755d4cf387cf63ce0dd"
									},
									"self": {
										"href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test/commit/2bc4f8d850c67adf9d061755d4cf387cf63ce0dd"
									}
								}
							}],
							"date": "2015-08-18T18:43:11+00:00",
							"message": `${message}`,
							"links": {
								"html": {
									"href": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22"
								},
								"self": {
									"href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test/commit/24480f9c4f1b4cff6c8ccec86416f6b258b75b22"
								}
							}
						},
						"type": "branch",
						"links": {
							"html": {
								"href": "https://bitbucket.org/kunzimariano/test/branch/master"
							},
							"self": {
								"href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test/refs/branches/master"
							},
							"commits": {
								"href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test/commits/master"
							}
						}
					},
					"commits": [{
						"hash": "24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
						"author": {
							"raw": "Mariano Kunzi <kunzi.mariano@gmail.com>",
							"user": {
								"display_name": "Mariano Kunzi",
								"username": "kunzimariano"
							}
						},
						"links": {
							"html": {
								"href": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22"
							}
						},
						"message": `${message}`
					}]
				}]
			},
			"repository": {
				"full_name": "kunzimariano/test",
				"uuid": "{9ad3f4a8-99d8-4b50-be5c-807459179855}",
				"links": {
					"html": {
						"href": "https://bitbucket.org/kunzimariano/test"
					},
					"self": {
						"href": "https://api.bitbucket.org/2.0/repositories/kunzimariano/test"
					},
					"avatar": {
						"href": "https://bitbucket.org/kunzimariano/test/avatar/16/"
					}
				},
				"name": "test",
				"type": "repository"
			}
		})
	},
	VsoGit: {
		validWithOneCommit: message => (
			{
			  "subscriptionId": "a36104aa-ef6c-4643-ac08-5c42fd2115d3",
			  "notificationId": 7,
			  "id": "2d01bcf8-83cb-49aa-8d0b-3f2233965060",
			  "eventType": "git.push",
			  "publisherId": "tfs",
			  "message": {
			    "text": "Josh Gough pushed updates to branch MyNew/Shelveset of V1 Integration\r\n(https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBMyNew%2FShelveset)",
			    "html": "Josh Gough pushed updates to branch <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBMyNew%2FShelveset\">MyNew/Shelveset</a> of <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/\">V1 Integration</a>",
			    "markdown": "Josh Gough pushed updates to branch [MyNew/Shelveset](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBMyNew%2FShelveset) of [V1 Integration](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/)"
			  },
			  "detailedMessage": {
			    "text": `Josh Gough pushed 1 commit to branch MyNew/Shelveset of V1 Integration\r\n - ${message} cf383dd3 (https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/cf383dd370a74a8a5062385f6c1723fcc7cc66eb)`,
			    "html": `Josh Gough pushed 1 commit to branch <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBMyNew%2FShelveset\">MyNew/Shelveset</a> of <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/\">V1 Integration</a>\r\n<ul>\r\n<li>${message} <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/cf383dd370a74a8a5062385f6c1723fcc7cc66eb\">cf383dd3</a></li>\r\n</ul>`,
			    "markdown": `Josh Gough pushed 1 commit to branch [MyNew/Shelveset](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBMyNew%2FShelveset) of [V1 Integration](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/)\r\n* ${message} [cf383dd3](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/cf383dd370a74a8a5062385f6c1723fcc7cc66eb)`
			  },
			  "resource": {
			    "commits": [
			      {
			        "commitId": "cf383dd370a74a8a5062385f6c1723fcc7cc66eb",
			        "author": {
			          "name": "Josh Gough",
			          "email": "jsgough@gmail.com",
			          "date": "2015-11-11T20:13:49Z"
			        },
			        "committer": {
			          "name": "Josh Gough",
			          "email": "jsgough@gmail.com",
			          "date": "2015-11-11T20:13:49Z"
			        },
			        "comment": message,
			        "url": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/commits/cf383dd370a74a8a5062385f6c1723fcc7cc66eb"
			      }
			    ],
			    "refUpdates": [
			      {
			        "name": "refs/heads/MyNew/Shelveset",
			        "oldObjectId": "0000000000000000000000000000000000000000",
			        "newObjectId": "cf383dd370a74a8a5062385f6c1723fcc7cc66eb"
			      }
			    ],
			    "repository": {
			      "id": "d29767bb-8f5f-4c43-872f-6c73635a1256",
			      "name": "V1 Integration",
			      "url": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256",
			      "project": {
			        "id": "213b6eda-2f19-4651-9fa9-ee01a9a75945",
			        "name": "V1 Integration",
			        "url": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/projects/213b6eda-2f19-4651-9fa9-ee01a9a75945",
			        "state": "wellFormed"
			      },
			      "defaultBranch": "refs/heads/master",
			      "remoteUrl": "https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration"
			    },
			    "pushedBy": {
			      "id": "0b88cae0-021f-4fa0-b723-d670c74ae474",
			      "displayName": "Josh Gough",
			      "uniqueName": "jsgough@gmail.com",
			      "url": "https://v1platformtest.vssps.visualstudio.com/_apis/Identities/0b88cae0-021f-4fa0-b723-d670c74ae474",
			      "imageUrl": "https://v1platformtest.visualstudio.com/DefaultCollection/_api/_common/identityImage?id=0b88cae0-021f-4fa0-b723-d670c74ae474"
			    },
			    "pushId": 7,
			    "date": "2015-11-11T20:13:49.321845Z",
			    "url": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/pushes/7",
			    "_links": {
			      "self": {
			        "href": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/pushes/7"
			      },
			      "repository": {
			        "href": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256"
			      },
			      "commits": {
			        "href": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/pushes/7/commits"
			      },
			      "pusher": {
			        "href": "https://v1platformtest.vssps.visualstudio.com/_apis/Identities/0b88cae0-021f-4fa0-b723-d670c74ae474"
			      },
			      "refs": {
			        "href": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/refs"
			      }
			    }
			  },
			  "resourceVersion": "1.0-preview.1",
			  "createdDate": "2015-11-11T20:13:52.4966577Z"
			}
		)
	}
};