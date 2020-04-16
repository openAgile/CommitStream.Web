(() => {
  let serviceUrl, 
      configGetUrl,
      configSaveUrl,
      rootElementId,
      commitStreamRoot;

  let prependStyleSheet = (el, href) => {
    el.prepend($(`<link type="text/css" rel="stylesheet" href="${href}">`));
  };

  let getServiceUrl = scriptEl => {
    let src = scriptEl.attr('src');
    if (src.indexOf('/') !== 0) {
      return src.substr(0, src.indexOf('/js/adminBootstrap.js'));
    }
    return '';
  };

  let callAngular = () => {
    let config = angular.module('commitStreamAdmin.config', []);

    config.provider('serviceUrl', () => {
      return {
        $get: function() {
          return serviceUrl;
        }
      }
    });
    config.provider('configGetUrl', () => {
      return {
        $get: function() {
          return configGetUrl;
        }
      }
    });
    config.provider('configSaveUrl', () => {
      return {
        $get: function() {
          return configSaveUrl;
        }
      }
    });

    CommitStreamAdminBoot($('#' + rootElementId));
  };

  let loadScripts = (scripts, cb) => {
    if (!scripts || !scripts.length) {
      return;
    }
    let currentScript = scripts.shift();
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

  let onLoadScriptsFailure = (jqXhr, settings, exception) => {
    console.error('CommitStream dependency loading exception for script:' + currentScript);
    console.error('CommitStream dependency loading exception details:');
    console.error(exception);
  };

  try {
    let scriptEl = $($('script[data-commitstream-root]')[0]);

    serviceUrl = getServiceUrl(scriptEl);
    configGetUrl = scriptEl.attr('data-commitstream-config-get-url');
    configSaveUrl = scriptEl.attr('data-commitstream-config-save-url');

    rootElementId = scriptEl.attr('data-commitstream-root');
    commitStreamRoot = $('#' + rootElementId);

    let bowerUrl = serviceUrl + '/bower_components/';

    let loadOnceScripts = [
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
    let scripts = [
      serviceUrl + '/js/admin.js',
      serviceUrl + '/js/controllers.js',
      serviceUrl + '/js/directives.js'
    ];
    let isDarkMode = function() {
      if (document.body.getAttribute('data-theme') == 'light') {
        return false;
      }
      else
        return true;
    };

    if (isDarkMode() ) {
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
      loadScripts(loadOnceScripts, function() {
        loadScripts(scripts, callAngular);
      });
    }

  } catch (ex) {
    console.error('CommitStream adminBootstrap error:');
    console.error(ex);
  }
}());