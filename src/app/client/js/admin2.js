(function() {
  'use strict';

  function CommitStreamAdminBoot(el) {

    var app = angular.module('commitStreamAdmin', [
      'commitStreamAdmin.config',
      'angular-hal',
      'ngRoute',
      'ui.bootstrap',
      'cgPrompt',
      'commitStreamControllers',
      'commitStreamAdminDirectives'
    ]);

    app.config(['$sceProvider', '$sceDelegateProvider', '$httpProvider',
      function($sceProvider, $sceDelegateProvider, $httpProvider) {
        $sceProvider.enabled(false);
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
          $httpProvider.defaults.headers.get = {};
        }

        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
      }
    ]);

    var persistentOptions = {
      headers: {
        Bearer: ''
      }
    };

    app.value('persistentOptions', persistentOptions);

    app.factory('CommitStreamApi', ['serviceUrl', 'halClient', 'persistentOptions',
      function(serviceUrl, halClient, persistentOptions) {
        return {
          'load': function() {
            return halClient.$get(serviceUrl + '/api/public', persistentOptions);
          },
        };
      }
    ]);

    app.config(['serviceUrlProvider', '$routeProvider',
      function(serviceUrlProvider, $routeProvider) {
        var serviceUrl = serviceUrlProvider.$get();
        $routeProvider.when('/', {
          templateUrl: serviceUrl + '/partials/commitStreamAdmin-Light.html',
          controller: 'CommitStreamAdminController'
        });

        $routeProvider.otherwise({
          redirectTo: serviceUrl + '/'
        });
      }
    ]);

    angular.bootstrap(el, ['commitStreamAdmin']);
  };
  window.CommitStreamAdminBoot = CommitStreamAdminBoot;
}());