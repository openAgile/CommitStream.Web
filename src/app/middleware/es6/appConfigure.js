import href from './resHref';
import hal from './resHal';

export default app => app.use(href).use(hal);