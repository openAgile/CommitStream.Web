(function(){
  "use strict";
  function CommitStreamAdminBoot(el) {
    var persistentOptions = {
      headers: { Bearer: '' }
    };

    var app = angular.module('commitStreamAdmin', ['commitStreamAdmin.config', 'angular-hal', 'ngRoute']);
    app.config(function($sceProvider) {
      $sceProvider.enabled(false);
    });

    app.factory('CommitStreamApi', ['serviceUrl', 'halClient', function(serviceUrl, halClient) {
      return {
        'load' : function() {
          return halClient.$get(serviceUrl + '/api/public', persistentOptions);
        },
      };
    }]);

    app.config(['serviceUrlProvider', '$routeProvider', function(serviceUrlProvider, $routeProvider) {
      var serviceUrl = serviceUrlProvider.$get();
      $routeProvider.when('/', {templateUrl: serviceUrl + '/partials/instances.html', controller: 'InstancesController'});
      $routeProvider.when('/inboxes', {templateUrl: serviceUrl + '/partials/inboxes.html', controller: 'InboxesController'});
      $routeProvider.otherwise({redirectTo: serviceUrl + '/'});
    }]);

    app.directive('toggleCheckbox', function($timeout) {
      /**
       * Directive
       */
      return {
        restrict: 'A',
        transclude: true,
        replace: false,
        require: 'ngModel',
        link: function ($scope, $element, $attr, ngModel) {
          // update model from Element
          var updateModelFromElement = function() {
            // If modified
            var checked = $element.prop('checked');
            if (checked != ngModel.$viewValue) {
              // Update ngModel
              ngModel.$setViewValue(checked);
              $scope.$apply();
            }
          };

          // Update input from Model
          var updateElementFromModel = function(newValue) {
            $element.trigger('change');
          };

          // Observe: Element changes affect Model
          $element.on('change', function() {
            updateModelFromElement();
          });

          $scope.$watch(function() {
            return ngModel.$viewValue;
          }, function(newValue) { 
            updateElementFromModel(newValue);
          }, true);

          // Initialise BootstrapToggle
          $element.bootstrapToggle();
        }
      };
    });

    app.controller('InstancesController',
      ['$rootScope', '$scope', '$http', '$location', 'CommitStreamApi', 'serviceUrl', 'configGetUrl', 'configSaveUrl',
      function($rootScope, $scope, $http, $location, CommitStreamApi, serviceUrl, configGetUrl, configSaveUrl) {       
        var config;
      
        $scope.loaderUrl = serviceUrl + '/ajax-loader.gif';

        var loading = true;

        $scope.loading = function() {
          return loading;
        };

        var errorHandler = function(error) {
          loading = false;
          if (error.data && error.data.errors && error.data.errors.length) {
            $scope.error.value = error.data.errors[0];
          } else {
            $scope.error.value = 'There was an unexpected error when processing your request.';
          }
        };

        $scope.error = { value: ''};

        $scope.errorActive = function() {
          return $scope.error.value !== '';
        };

        CommitStreamApi
        .load()
        .then(function(resources) {
          $rootScope.resources = resources;
          if (!configGetUrl) return {
            data: {
              serviceUrl: serviceUrl,
              instanceId: '',
              apiKey: '',
              globalDigestId: '',
              configured: false,
              enabled: false
            }
          }
          return $http.get(configGetUrl);
        })
        .then(function(configRes) {
          // TODO handle null case?
          config = configRes.data;
          $rootScope.config = config;

          if (config.configured) {
            persistentOptions.headers.Bearer = config.apiKey;
            return $rootScope.resources.$get('instance', {instanceId: config.instanceId});
          } else {
            return $rootScope.resources.$post('instances');
          }
        })
        .then(function(instance) {
          persistentOptions.headers.Bearer = instance.apiKey; // Ensure apiKey for NEW instance
          $rootScope.instance = instance;

          if (config.configured) {
            return $rootScope.resources.$get('digest', {
              instanceId: config.instanceId,
              digestId: config.globalDigestId
            });
          }
          else {
            return instance.$post('digest-create', {}, {
              description: 'Global Repositories List'
            });
          }
        })
        .then(function(digest) {
          $rootScope.digest = digest;
          $location.path('/inboxes');
        })
        .catch(errorHandler);
      }]
    );

    app.controller('InboxesController', ['$rootScope', '$scope', '$timeout', 'serviceUrl', 'configSaveUrl', '$http', '$q', function($rootScope, $scope, $timeout, serviceUrl, configSaveUrl, $http, $q) {
      $scope.newInbox = {
        url: '',
        name: '',
        family: 'GitHub' // Until we support other systems, hard-code this.
      };

      $scope.loaderUrl = serviceUrl + '/ajax-loader.gif';
      
      $scope.inboxes = [];

      $scope.enabledState = { 
        enabled: $rootScope.config.enabled,
        applying: false,
        onText: 'Enabled',
        offText: 'Disabled'
      };

      $scope.message = { value: ''};

      $scope.messageActive = function() {
        return $scope.message.value !== '';
      };

      $scope.error = { value: ''};

      $scope.errorActive = function() {
        return $scope.error.value !== '';
      };

      var errorHandler = function(error) {
        if (error.data && error.data.errors && error.data.errors.length) {
          $scope.error.value = error.data.errors[0];
        } else {
          $scope.error.value = 'There was an unexpected error when processing your request.';
        }
      };

      var configSave = function(enabled) {
        $rootScope.config.enabled = enabled;
        
        if (!$rootScope.config.configured) {
          $rootScope.config.instanceId = $rootScope.instance.instanceId;
          $rootScope.config.globalDigestId = $rootScope.digest.digestId;
          $rootScope.config.apiKey = $rootScope.instance.apiKey;
          $rootScope.config.configured = true;
        }
        if (configSaveUrl) return $http.post(configSaveUrl, $rootScope.config);
        return $q.when(true);
      };

      var inboxConfigure = function(inbox) {
        var links = inbox.$links();
        inbox.addCommit = links['add-commit'].href + 'apiKey=' + persistentOptions.headers.Bearer;
        inbox.removeHref = links['self'].href + 'apiKey=' + persistentOptions.headers.Bearer;
      };
      
      var inboxesGet = function() {
        return $rootScope.digest.$get('inboxes')
          .then(function(inboxesRes) {
            return inboxesRes.$get('inboxes');
          }).then(function(inboxes) {
            $scope.inboxes.length = 0;
            inboxes.forEach(function(inbox) {
              inboxConfigure(inbox);
              $scope.inboxes.unshift(inbox);
            });
          })
          .catch(errorHandler);
      };

      if ($rootScope.config.enabled) inboxesGet();

      $scope.enabledChanged = function() {
        var enabled = $('.commitstream-admin .enabled').prop('checked');

        apply(); // TODO clean up...

        configSave(enabled).then(function(configSaveResult) {
          // TODO handle configSaveResult
          if (enabled) inboxesGet();
        })
        .catch(errorHandler);
      };

      var apply = function() {
        $scope.enabledState.applying = true;
        $('.commitstream-admin .enabled').bootstrapToggle('disable');
        $timeout(function() {          
          $scope.enabledState.applying = false;
          $('.commitstream-admin .enabled').bootstrapToggle('enable');
        }, 2000);
      };

      $scope.applying = function() {
        return $scope.enabledState.applying;
      };

      $scope.reposVisible = function() {
        return ($scope.enabledState.enabled && !$scope.enabledState.applying) 
        || (!$scope.enabledState.enabled && $scope.enabledState.applying);
      }

      $scope.inboxCreate = function() {
        var index = $scope.newInbox.url.lastIndexOf('/');
        $scope.newInbox.name = $scope.newInbox.url.substr(index + 1);

        $rootScope.digest.$post('inbox-create', {}, $scope.newInbox)
        .then(function(inbox) {
          inboxConfigure(inbox);
          $scope.inboxes.unshift(inbox);
          $scope.newInbox.url = '';
        })
        .catch(errorHandler);
      };

      $scope.inboxRemove = function(inbox) {
        inbox.$del('self').then(function(result) {
          $scope.message.value = 'Successfully removed inbox';      
          var index = $scope.inboxes.indexOf(inbox);
          $scope.inboxes.splice(index, 1);
          $timeout(function() {
            $('.commitstream-admin .message').fadeOut('slow', function() {
              $scope.message.value = '';
            });
          }, 4000);
        })
        .catch(errorHandler);
      };

      var inboxHighlight = function(el) {
        el.focus();
        el.select();
      };

      $scope.inboxHighlight = function(evt) {
        inboxHighlight(evt.currentTarget);
      };

      $scope.inboxHighlightTop = function() {
        var el = $($('.commitstream-admin .inbox')[0]);
        $timeout(function() {
          inboxHighlight(el);
        }, 0);      
      };      

    }]);

    angular.bootstrap(el, ['commitStreamAdmin']);
  };
  window.CommitStreamAdminBoot = CommitStreamAdminBoot;
}());