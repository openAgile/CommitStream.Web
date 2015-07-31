(function() {
  'use strict';

  var prependStyleSheet = function(el, href) {
    el.prepend($('<link type="text/css" rel="stylesheet" href="' + href + '">'));
  }

  var getServiceUrl = function(scriptEl) {
    var src = scriptEl.attr('src');
    if (src.indexOf('/') !== 0) {
      return src.substr(0, src.indexOf('/js/adminBootstrap.js'));
    }
    return '';
  }

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
  }

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
          callAngular();
        }
      })
      .fail(onLoadScriptsFailure);
  };

  var onLoadScriptsFailure = function(jqXhr, settings, exception) {
    console.error('CommitStream dependency loading exception for script:' + currentScript);
    console.error('CommitStream dependency loading exception details:');
    console.error(exception);
  }

  var prependXdomain = function(commitStreamRoot) {
    setTimeout(function() {
      if (window.xdomain) {
        return;
      }
      commitStreamRoot.prepend(
        $('<scr' + 'ipt src="' + serviceUrl + '/bower_components/xdomain/dist/xdomain.min.js" slave="' + serviceUrl + '/proxy.html"></scr' + 'ipt>"')
      );
    }, 1000);
  }

  try {

    var scriptEl = $($('script[data-commitstream-root]')[0]);

    var serviceUrl = getServiceUrl(scriptEl);
    var configGetUrl = scriptEl.attr('data-commitstream-config-get-url');
    var configSaveUrl = scriptEl.attr('data-commitstream-config-save-url');

    var rootElementId = scriptEl.attr('data-commitstream-root');
    var commitStreamRoot = $('#' + rootElementId);

    var scripts = [
      serviceUrl + '/bower_components/angular/angular.min.js',
      serviceUrl + '/bower_components/angular-route/angular-route.min.js',
      serviceUrl + '/bower_components/angular-bootstrap/ui-bootstrap.min.js',
      serviceUrl + '/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      serviceUrl + '/bower_components/angular-prompt/dist/angular-prompt.min.js',
      serviceUrl + '/bower_components/angular-hal/angular-hal.js',
      serviceUrl + '/bower_components/rfc6570/rfc6570.js',
      serviceUrl + '/bower_components/bootstrap/dist/js/bootstrap.min.js',
      serviceUrl + '/bower_components/bootstrap-toggle/js/bootstrap-toggle.min.js',
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

    loadScripts(scripts);
  } catch (ex) {
    console.error('CommitStream adminBootstrap error:');
    console.error(ex);
  }
}());