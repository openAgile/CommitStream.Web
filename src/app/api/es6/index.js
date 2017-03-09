export default {
  init(app) {
    const controllers = [
      'digests/digests',
      'health/health',
      'inboxes/inboxes'
    ];
    for(let controllerPrefix of controllers) {
      const controller = require(`./${controllerPrefix}Controller`);
      controller.init(app);
    }
  }
};