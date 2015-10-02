import bunyan from 'bunyan';
import azBunyan from 'az-bunyan';

// TODO: pull from app settings:
// define the target azure storage table name
const tableName = 'developingapplogtable';
// define the connection string to your azure storage account
const connectionString = 'DefaultEndpointsProtocol=https;AccountName=commitstreamdev;AccountKey=PBr7JHysuTvIXJwljstuPLmBoVCao/UQvPVqiJQRrfXgAdXAw41hQpXKz1f+fSzQ3niJVMwgTU7fsSA+1esmIA==';
const level = 'info';
const name = 'CSError-Logger';

// initialize the az-bunyan table storage stream
const azureStream = azBunyan.createTableStorageStream(level, {
  connectionString,
  tableName
});

const logger = bunyan.createLogger({
  name,
  serializers: {
    req: bunyan.stdSerializers.req,
    err: bunyan.stdSerializers.err
  },
  streams: [
    {
      level,
      stream: process.stderr
    },
    azureStream
  ]
});

export default logger;
