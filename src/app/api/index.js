(function(api) {
  api.init = function(app) {
    var controllers = [
      'settings',
      'digests/digests',
      'inboxes/inboxes'
    ];
    controllers.forEach(function(controllerPrefix) {
      var controller = require('./' + controllerPrefix + 'Controller');
      controller.init(app);
    });
  };
})(module.exports);