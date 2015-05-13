(function() { 
  function CommitStreamAdminLoad(serviceUrl) {
    var commitStreamAdminStyles = $("#commitStreamAdminStyles");
    commitStreamAdminStyles.append($('<link type="text/css" rel="stylesheet" href="' + serviceUrl + '/bower_components/bootstrap/dist/css/bootstrap.css">'));

    var loadScripts = function(scripts) {
      if (!scripts || !scripts.length) {
        return;
      }
      var currentScript = scripts.shift();
      $.getScript(currentScript)
        .done(function() {
          if (scripts.length > 0) {
            loadScripts(scripts);
          } else {
            // Bootstrap time...
            var config = angular.module('commitStreamAdmin.config', []);
            config.provider('serviceUrl', function () {
              return {
                $get: function () { return serviceUrl; }
              }
            });
            console.log("About to boot");
            CommitStreamAdminBoot($('#commitStreamAdmin'));
          }
        })
        .fail(function(jqXhr, settings, exception) {
          console.error("CommitStream dependency loading exception for script:" + currentScript);
          console.error("CommitStream dependency loading exception details:");
          console.error(exception);
        });
    };

    loadScripts([
      serviceUrl + "/bower_components/angular/angular.js",
      serviceUrl + "/bower_components/angular-route/angular-route.js",
      serviceUrl + "/bower_components/angular-hal/angular-hal.js",
      serviceUrl + "/bower_components/rfc6570/rfc6570.js",
      serviceUrl + "/js/admin.js"
    ]);
  };
  window.CommitStreamAdminLoad = CommitStreamAdminLoad;
}());