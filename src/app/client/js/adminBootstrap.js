'use strict';

(function () {
  var serviceUrl = undefined,
      configGetUrl = undefined,
      configSaveUrl = undefined,
      rootElementId = undefined,
      commitStreamRoot = undefined;

  var prependStyleSheet = function prependStyleSheet(el, href) {
    el.prepend($('<link type="text/css" rel="stylesheet" href="' + href + '">'));
  };

  var getServiceUrl = function getServiceUrl(scriptEl) {
    var src = scriptEl.attr('src');
    if (src.indexOf('/') !== 0) {
      return src.substr(0, src.indexOf('/js/adminBootstrap.js'));
    }
    return '';
  };

  var callAngular = function callAngular() {
    var config = angular.module('commitStreamAdmin.config', []);

    config.provider('serviceUrl', function () {
      return {
        $get: function $get() {
          return serviceUrl;
        }
      };
    });
    config.provider('configGetUrl', function () {
      return {
        $get: function $get() {
          return configGetUrl;
        }
      };
    });
    config.provider('configSaveUrl', function () {
      return {
        $get: function $get() {
          return configSaveUrl;
        }
      };
    });

    CommitStreamAdminBoot($('#' + rootElementId));
  };

  var loadScripts = function loadScripts(scripts, cb) {
    if (!scripts || !scripts.length) {
      return;
    }
    var currentScript = scripts.shift();
    $.getScript(currentScript).done(function () {
      if (scripts.length > 0) {
        loadScripts(scripts, cb);
      } else {
        cb();
      }
    }).fail(onLoadScriptsFailure);
  };

  var onLoadScriptsFailure = function onLoadScriptsFailure(jqXhr, settings, exception) {
    console.error('CommitStream dependency loading exception for script:' + currentScript);
    console.error('CommitStream dependency loading exception details:');
    console.error(exception);
  };

  try {
    (function () {
      var scriptEl = $($('script[data-commitstream-root]')[0]);

      serviceUrl = getServiceUrl(scriptEl);
      configGetUrl = scriptEl.attr('data-commitstream-config-get-url');
      configSaveUrl = scriptEl.attr('data-commitstream-config-save-url');

      rootElementId = scriptEl.attr('data-commitstream-root');
      commitStreamRoot = $('#' + rootElementId);

      var bowerUrl = serviceUrl + '/bower_components/';

      var loadOnceScripts = [bowerUrl + 'angular/angular.min.js', bowerUrl + 'angular-route/angular-route.min.js', bowerUrl + 'angular-bootstrap/ui-bootstrap.min.js', bowerUrl + 'angular-bootstrap/ui-bootstrap-tpls.min.js', bowerUrl + 'angular-prompt/dist/angular-prompt.min.js', bowerUrl + 'angular-hal/angular-hal.js', bowerUrl + 'rfc6570/rfc6570.js', bowerUrl + 'bootstrap/dist/js/bootstrap.min.js', bowerUrl + 'bootstrap-toggle/js/bootstrap-toggle.min.js'];
      var scripts = [serviceUrl + '/js/admin.js', serviceUrl + '/js/controllers.js', serviceUrl + '/js/directives.js'];
      var isDarkMode = function isDarkMode() {
        if (document.body.getAttribute('data-theme') == 'light') {
          return false;
        } else return true;
      };

      if (isDarkMode()) {
        scripts.shift();
        scripts.unshift(serviceUrl + '/js/admin-Dark.js');
      }

      // TODO: enable after new styles are released in V1 Prod
      prependStyleSheet(commitStreamRoot, serviceUrl + '/css/bootstrap-toggle.min.css');
      prependStyleSheet(commitStreamRoot, serviceUrl + '/css/glyphicon.css');

      //only load angular and friends once
      if (window.CommitStreamAdminBoot) {

        loadScripts(scripts, callAngular);
      } else {
        loadScripts(loadOnceScripts, function () {
          loadScripts(scripts, callAngular);
        });
      }
    })();
  } catch (ex) {
    console.error('CommitStream adminBootstrap error:');
    console.error(ex);
  }
})();
