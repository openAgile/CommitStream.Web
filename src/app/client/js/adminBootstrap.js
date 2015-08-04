(function() {
  'use strict';

  var prependStyleSheet = function(el, href) {
    el.prepend($('<link type="text/css" rel="stylesheet" href="' + href + '">'));
  };

  var getServiceUrl = function(scriptEl) {
    var src = scriptEl.attr('src');
    if (src.indexOf('/') !== 0) {
      return src.substr(0, src.indexOf('/js/adminBootstrap.js'));
    }
    return '';
  };

  var callAngular = function() {
    var config = angular.module('commitStreamAdmin.config', []);

    config.provider('serviceUrl', function() {
      return {
        $get: function() {
          return serviceUrl;
        }
      }
    });
    config.provider('configGetUrl', function() {
      return {
        $get: function() {
          return configGetUrl;
        }
      }
    });
    config.provider('configSaveUrl', function() {
      return {
        $get: function() {
          return configSaveUrl;
        }
      }
    });

    CommitStreamAdminBoot($('#' + rootElementId));
  };

  var loadScripts = function(scripts, cb) {
    if (!scripts || !scripts.length) {
      return;
    }
    var currentScript = scripts.shift();
    $.getScript(currentScript)
      .done(function() {
        if (scripts.length > 0) {
          loadScripts(scripts, cb);
        } else {
          cb();
        }
      })
      .fail(onLoadScriptsFailure);
  };

  var onLoadScriptsFailure = function(jqXhr, settings, exception) {
    console.error('CommitStream dependency loading exception for script:' + currentScript);
    console.error('CommitStream dependency loading exception details:');
    console.error(exception);
  };

  var prependXdomain = function(commitStreamRoot) {
    setTimeout(function() {
      if (window.xdomain) {
        return;
      }
      commitStreamRoot.prepend(
        $('<scr' + 'ipt src="' + serviceUrl + '/bower_components/xdomain/dist/xdomain.min.js" slave="' + serviceUrl + '/proxy.html"></scr' + 'ipt>"')
      );
    }, 1000);
  };

  try {

    var scriptEl = $($('script[data-commitstream-root]')[0]);

    var serviceUrl = getServiceUrl(scriptEl);
    var configGetUrl = scriptEl.attr('data-commitstream-config-get-url');
    var configSaveUrl = scriptEl.attr('data-commitstream-config-save-url');

    var rootElementId = scriptEl.attr('data-commitstream-root');
    var commitStreamRoot = $('#' + rootElementId);

    var bowerUrl = serviceUrl + '/bower_components/';

    var loadOnceScripts = [
      bowerUrl + 'angular/angular.min.js',
      bowerUrl + 'angular-route/angular-route.min.js',
      bowerUrl + 'angular-bootstrap/ui-bootstrap.min.js',
      bowerUrl + 'angular-bootstrap/ui-bootstrap-tpls.min.js',
      bowerUrl + 'angular-prompt/dist/angular-prompt.min.js',
      bowerUrl + 'angular-hal/angular-hal.js',
      bowerUrl + 'rfc6570/rfc6570.js',
      bowerUrl + 'bootstrap/dist/js/bootstrap.min.js',
      bowerUrl + 'bootstrap-toggle/js/bootstrap-toggle.min.js',
    ];

    var scripts = [
      serviceUrl + '/js/admin.js',
      serviceUrl + '/js/controllers.js',
      serviceUrl + '/js/directives.js'
    ];

    // TODO: enable after new styles are released in V1 Prod
    //prependStyleSheet(commitStreamRoot, serviceUrl + '/css/manage.css');
    prependStyleSheet(commitStreamRoot, serviceUrl + '/css/bootstrap-toggle.min.css');
    //prependStyleSheet(commitStreamRoot, serviceUrl + '/css/bootstrap-theme.min.css');
    prependStyleSheet(commitStreamRoot, serviceUrl + '/css/glyphicon.css');

    // XDomain support for IE9 especially
    prependXdomain(commitStreamRoot);

    //only load angular and friends once
    if (window.CommitStreamAdminBoot) {
      loadScripts(scripts, callAngular);
    } else {
      loadScripts(loadOnceScripts, function() {
        loadScripts(scripts, callAngular);
      });
    }

  } catch (ex) {
    console.error('CommitStream adminBootstrap error:');
    console.error(ex);
  }
}());