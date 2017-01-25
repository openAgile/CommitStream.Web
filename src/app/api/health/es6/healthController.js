import healthStatusGet from './healthStatusGet';
import healthProjectionsGet from './healthProjectionsGet';

export default {
  init(app) {
    app.get('/health/status', healthStatusGet);
    app.get('/health/projections', healthProjectionsGet);
  }
};