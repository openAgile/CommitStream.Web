import families from '../api/helpers/vcsFamilies';
import es from '../api/helpers/eventStoreClient';
import gj from 'glance-json';
import _ from 'underscore';

const currentTotals = Promise.all(Object.keys(families).map(async (family) => {
    const args = {
        name: `$et-${family}CommitReceived`,
        count: 1,
        embed: 'tryharder'
    };
    return { family, count: gj(await es.getFromStream(args), 'positionEventNumber') };
}));

currentTotals.then(results => {
    const count = results.reduce((sum, o) => sum + o.count, 0);
    results.forEach((o, i) => o.percentage = (o.count / count * 100).toFixed(2));
    results.push({ family: 'Total', count });
    console.log(_.sortBy(results, o => -o.count));
});