import _ from 'underscore';
import path from 'path';
import fs from 'fs';
import EventStore from 'eventstore-client';

export default {
  boot(config) {
    const getLocalProjections = cb => {
      const projections = [];
      const dir = path.join(__dirname, 'projections');
      fs.readdir(dir, (err, files) => {
        for(const name of files) {
          const fullPath = path.join(dir, name);
          fs.readFile(fullPath, 'utf-8', (err, script) => cb({ name: name.slice(0, -3), projection: script }));
        }
      });
    };

    const initProjections = existingProjections => {
      console.log('Looking for new projections...');
      getLocalProjections(item => {
        if (!_.findWhere(existingProjections.projections, { effectiveName: item.name })) createProjection(item);
        else console.log(`OK found ${item.name}`);
      });
    };

    const createProjection = projectionObject => {
      es.projections.post(projectionObject, (error, response) => {
        if (error) {
          console.error(`ERROR could not create projection ${projectionObject.name}:`);
          console.error(error);
        } else {
          console.log(`OK created projection ${projectionObject.name}`);
          console.log(response.body);
        }
      });
    };

    const es = new EventStore({
      baseUrl: config.eventStoreBaseUrl,
      username: config.eventStoreUser,
      password: config.eventStorePassword
    });
       
    console.log('Enabling system projections...');
    es.projection.enableSystemAll(() => {});

    console.log('Looking for already existing projections...');
    es.projections.get((error, response) => initProjections(JSON.parse(response.body)));
  }
};