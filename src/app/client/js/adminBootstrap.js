(function() { 
  function CommitStreamAdminLoad(serviceUrl, rootElementId) {
    var commitStreamAdminStyles = $('#' + rootElementId);
    commitStreamAdminStyles.prepend($('<link type="text/css" rel="stylesheet" href="' + serviceUrl + '/bower_components/bootstrap-toggle/css/bootstrap-toggle.min.css">'));
    commitStreamAdminStyles.prepend($('<link type="text/css" rel="stylesheet" href="' + serviceUrl + '/bower_components/bootstrap/dist/css/bootstrap.css">'));

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
            var scriptEl = $($('script[data-commitstream-root]')[0]);
            console.log(scriptEl);
            console.log(scriptEl.attr('data-commitstream-root'));
            var baseUrl = '';
            var src = scriptEl.attr('src');
            console.log(src);
            if (src.indexOf('/') !== 0) {
              baseUrl = src.substr(0, src.indexOf('/js/adminBootstrap.js'));
            }
            CommitStreamAdminBoot($('#' + rootElementId));
          }
        })
        .fail(function(jqXhr, settings, exception) {
          console.error('CommitStream dependency loading exception for script:' + currentScript);
          console.error('CommitStream dependency loading exception details:');
          console.error(exception);
        });
    };

    var scripts = [    
      serviceUrl + '/bower_components/angular/angular.min.js',
      serviceUrl + '/bower_components/angular-route/angular-route.min.js',
      serviceUrl + '/bower_components/angular-hal/angular-hal.js',
      serviceUrl + '/bower_components/rfc6570/rfc6570.js',
      serviceUrl + '/bower_components/bootstrap-toggle/js/bootstrap-toggle.min.js',
      serviceUrl + '/js/admin.js'
    ];

    loadScripts(scripts);    
  };
  window.CommitStreamAdminLoad = CommitStreamAdminLoad;
}());