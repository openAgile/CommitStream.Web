import program from 'commander';
import CSApiClient from './lib/cs-api-client';

program
  .version('0.0.0')
  .option('-u, --url [url]', 'The base URL for the CommitStream Service API, default: http://localhost:6565/api', 'http://localhost:6565/api')
  .option('-i, --instances [number]', 'Number of instances to create, default: 1', 1)
  .option('-r, --repos [number]', 'Number of repos creation iterations to run (creates one repo per family type during each iteration), default 1', 1)
  .option('-m, --mentions [number]', 'Number of times to post a commit with each mention (one story, 5 tasks, 5 tests in each group of workitems), default 1', 1)
  .option('-d, --debug', 'Show results of each commit, not just summary information')
  .option('-j, --json', 'Log only the JSON output with all the query URLs needed for the performance client')
  .parse(process.argv);

const number_of_instances = parseInt(program.instances);
const number_of_repo_iterations = parseInt(program.repos);
const number_of_mentions_per_workitem_per_repo = parseInt(program.mentions);

let client = new CSApiClient(program.url);

if (!program.json) console.log(`Operating against this CommitStream Service API: ${client.baseUrl}`);

let workItemsToMention = [
  ['S-00001', 'T-00001', 'T-00002', 'T-00003', 'T-00004', 'T-00005', 'AT-00001', 'AT-00002', 'AT-00003', 'AT-00004', 'AT-00005'],
  ['S-00002', 'T-00011', 'T-00012', 'T-00013', 'T-00014', 'T-00015', 'AT-00011', 'AT-00012', 'AT-00013', 'AT-00014', 'AT-00015'],
  ['S-00003', 'T-00021', 'T-00022', 'T-00023', 'T-00024', 'T-00025', 'AT-00021', 'AT-00022', 'AT-00023', 'AT-00024', 'AT-00025'],
  ['S-00004', 'T-00031', 'T-00032', 'T-00033', 'T-00034', 'T-00035', 'AT-00031', 'AT-00032', 'AT-00033', 'AT-00034', 'AT-00035']
];

let createInstanceWithData = async (iteration) => {
  let inboxesToCreate = [
    {
      name: `Deveo Repo ${iteration}`,
      family: 'Deveo'
    },
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
    },
    {
      name: `VsoGit Repo ${iteration}`,
      family: 'VsoGit'
    },
    {
      name: `CtfSvn Repo ${iteration}`,
      family: 'CtfSvn'
    },
    {
      name: `CtfGit Repo ${iteration}`,
      family: 'CtfGit'
    }
  ];

  let instance = await client.instanceCreate();
  let digest = await instance.digestCreate({description:`Digest for ${iteration}`});

  if (!program.json) {
    console.log(`The digest: ${digest._links['teamroom-view'].href}&apiKey=${client.apiKey}`);
    console.log(`#${iteration}: Populating instance ${client.instanceId} (apiKey = ${client.apiKey})`);
  }

  for (let n = 0; n < number_of_repo_iterations; n++) {
    let inboxNum = 0;
    for (let inboxToCreate of inboxesToCreate) {
      let inbox = await digest.inboxCreate(inboxToCreate);
      let workItemGroupNum = inboxNum % 4;
      let workItemsGroup = workItemsToMention[workItemGroupNum];
      let comma = (iteration === 0 && inboxNum === 0) ? '' : ',';
      inboxNum++;
      if (!program.json) {
        console.log(`Adding commits to ${inbox.inboxId} of family ${inbox.family}`);
        console.log(`${inbox._links['add-commit'].href}?apiKey=${client.apiKey}`);
      }
      else console.log(`${comma}"${client.baseUrl}/${client.instanceId}/commits/tags/versionone/workitem?numbers=${workItemsGroup.join(',')}&apiKey=${client.apiKey}"`);
      for(let workItem of workItemsGroup) {
        for (let mentionNum = 0; mentionNum < number_of_mentions_per_workitem_per_repo; mentionNum++) {
          let message = `${workItem} mention # ${mentionNum} on ${iteration} in  ${inbox.inboxId} of family = ${inbox.family}`;
          let commitAddResponse = await inbox.commitCreate(message);
          if (program.debug) {
            console.log(commitAddResponse.message);
          }
        }
      }
    }
  }
};

let run = async () => {
  if (program.json) console.log('[');
  for(let instanceNum = 0; instanceNum < number_of_instances; instanceNum++) {
    await createInstanceWithData(instanceNum);
  }
  if (program.json) console.log(']');
}
try {
  run();
} catch (e) {
  console.log(e);
}
