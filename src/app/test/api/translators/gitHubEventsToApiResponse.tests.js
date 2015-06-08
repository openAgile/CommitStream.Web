var assert = require('assert'),
    gitHubEventsToApiResponse = require('../../../api/translators/gitHubEventsToApiResponse');

var eventsData = {};

eventsData.Single = [{
    eventId: 'e4a5c39b-6495-44f4-9079-e028ad9acb98',
    eventType: 'GitHubCommitReceived',
    eventNumber: 2,
    data: '{"sha": "d31d174f0495feaf876e92573a2121700fd81e7a","commit": {"author": {"name": "kunzimariano","email": "kunzi.mariano@gmail.com","username": "kunzimariano"},"committer": {"name": "kunzimariano","email": "kunzi.mariano@ gmail.com","date": "2014-10-03T18:57:14+00:00"},"message": "Back after lunch S-47667"},"html_url": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a","repository": {"id": 23355501,"name": "CommitService.DemoRepo"},"branch": "master","originalMessage": {"id": "d31d174f0495feaf876e92573a2121700fd81e7a","distinct": true,"message": "Back after lunch S-47667","timestamp": "2014-10-03T18:57:14+00:00","url": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a","author": {"name": "kunzimariano","email": "kunzi.mariano@gmail.com","username": "kunzimariano"},"committer": {"name": "kunzimariano","email": "kunzi.mariano@ gmail.com","username": "kunzimariano"},"added": [],"removed": [],"modified": ["README.md"]}}',
    metaData: '{"digestId": "757cfc74-c148-43ff-926b-9437dc1ffe69"}',
    linkMetaData: '{"$v": "7:-1:0:3", "$s": {"mention-with": 4},"$causedBy": "e4a5c39b-6495-44f4-9079-e028ad9acb98"}',
    streamId: 'inboxCommits-2097fabd-6482-417c-9aae-34c1a09aad06',
    isJson: true,
    isMetaData: true,
    isLinkMetaData: true,
    positionEventNumber: 4,
    positionStreamId: 'asset-S-47667',
    title: '2@inboxCommits-2097fabd-6482-417c-9aae-34c1a09aad06',
    id: 'http://cs-eventstore-cluster.cloudapp.net:2113/streams/inboxCommits-2097fabd-6482-417c-9aae-34c1a09aad06/2',
    updated: '2015-03-27T18:16:51.0717448Z',
    author: {
        name: 'EventStore'
    },
    summary: '$>',
    links: []
}];

describe('gitHubEventsToApiResponse', function() {
    describe('when 0 events present', function() {
        it('returns an empty array', function() {
            assert.deepEqual(gitHubEventsToApiResponse([]), {
                commits: []
            })
        });
    });

    describe('when 1 event present', function() {
        var events = eventsData.Single;
        var actual = gitHubEventsToApiResponse(events);
        it('returns 1 mapped event', function() {
            assert.equal(actual.commits.length, 1);
        });
    });
});