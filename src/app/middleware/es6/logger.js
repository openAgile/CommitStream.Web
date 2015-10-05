import bunyan from 'bunyan';
import azBunyan from 'az-bunyan';
import config from '../config';

const level = 'info';
const name = 'CSError-Logger';

var streamsConfigured = [{
  level,
  stream: process.stderr
}];
if (config.azureLoggerConfigured) {
  const tableName = config.azureTableName;
  const connectionString = config.azureTableConnectionString;
  streamsConfigured.push(azBunyan.createTableStorageStream(level, {
    connectionString,
    tableName
  }));
}

const logger = bunyan.createLogger({
  name,
  serializers: {
      req: bunyan.stdSerializers.req,
      err: bunyan.stdSerializers.err
    },
    streams: streamsConfigured
});

export default logger;
