import program from 'commander';
import CSApiClient from './lib/cs-api-client';

program
  .version('0.0.0')
  .option('-u, --url [url]', 'The base URL for the CommitStream Service API, default: http://localhost:6565/api', 'http://localhost:6565/api')
  .parse(process.argv);

let client = new CSApiClient(program.url);

console.log(`Operating against this CommitStream Service API: ${client.baseUrl}`);

let createInstanceWithDigest = async () => {  
  let instance = await client.instanceCreate();
  let digest = await instance.digestCreate({description:`Global Digest`});

  if (!program.json) {
    console.log(`The digest: ${digest._links['teamroom-view'].href}&apiKey=${client.apiKey}`);
    console.log(`POST here to create an inbox for this digest: ${digest._links['inbox-create'].href}?apiKey=${client.apiKey}`);
  }
};

let run = async () => {
  await createInstanceWithDigest();
}
try {
  run();
} catch (e) {
  console.log(e);
}