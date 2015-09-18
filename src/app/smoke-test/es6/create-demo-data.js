import csApiClient from './lib/cs-api-client';

//csApiClient.enableLogging(true);

const number_of_instances = 200;
const number_of_inbox_iterations = 1;
const number_of_mentions_per_workitem_per_inbox = 1;

let workItemsToMention = [
  ['S-00001', 'T-00001', 'T-00002', 'T-00003', 'T-00004', 'T-00005', 'AT-00001', 'AT-00002', 'AT-00003', 'AT-00004', 'AT-00005'],
  ['S-00002', 'T-00011', 'T-00012', 'T-00013', 'T-00014', 'T-00015', 'AT-00011', 'AT-00012', 'AT-00013', 'AT-00014', 'AT-00015'],
  ['S-00003', 'T-00021', 'T-00022', 'T-00023', 'T-00024', 'T-00025', 'AT-00021', 'AT-00022', 'AT-00023', 'AT-00024', 'AT-00025']
];

let createInstanceWithData = async (iteration) => {
  let inboxesToCreate = [
    {
      name: `GitHub Repo ${iteration}`,
      family: 'GitHub'
    },
    {
      name: `GitLab Repo ${iteration}`,
      family: 'GitLab'
    },
    {
      name: `Bitbucket Repo ${iteration}`,
      family: 'Bitbucket'
    }
  ];

  let instance = await csApiClient.post('/instances', {});
  let digest = await csApiClient.postToLink(instance, 'digest-create', {
    description: `Digest for ${iteration}`
  });
  for (let n = 0; n < number_of_inbox_iterations; n++) {
    let inboxNum = 0;
    for (let inboxToCreate of inboxesToCreate) {
      let inbox = await csApiClient.postToLink(digest, 'inbox-create', inboxToCreate);
      let workItemGroupNum = inboxNum % 3;
      let workItemsGroup = workItemsToMention[workItemGroupNum];
      for(let workItem of workItemsGroup) {
        console.log(workItem)
        for (let mentionNum = 0; mentionNum < number_of_mentions_per_workitem_per_inbox; mentionNum++) {
          let message = `${workItem} mention # ${mentionNum} on ${iteration} in  ${inbox.inboxId} of family = ${inbox.family}`;
          let commitAddResponse = await csApiClient.families[inboxToCreate.family].commitAdd(inbox, message);
          console.log(message);
          console.log(commitAddResponse.message);
        }
      }
    }
  }
};

//for(let instanceNum = 0; instanceNum < number_of_instances; instanceNum++) createInstanceWithData(instanceNum);
for(let instanceNum = 0; instanceNum < 1; instanceNum++) createInstanceWithData(instanceNum);