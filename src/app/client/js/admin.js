(function(){
  'use strict';
  function CommitStreamAdminBoot(el) {
    var persistentOptions = {
      headers: { Bearer: '' }
    };

    var app = angular.module('commitStreamAdmin', ['commitStreamAdmin.config', 
      'angular-hal', 'ngRoute', 'ui.bootstrap','cgPrompt']);
    app.config(['$sceProvider', '$sceDelegateProvider', function($sceProvider, $sceDelegateProvider) {
      // $sceProvider.enabled(false);
      $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://commitstream.v1host.com/partials/instances.html',
        'https://commitstream.v1host.com/partials/inboxes.html'
      ]);
    }]);

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

    app.directive('resizableOverlay', function($window) {
      return function($scope) {
        return angular.element($window).bind('resize', function() {
          $scope.adjustOverlay();
          return $scope.$apply();
        });
      };
    });

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
            // return $rootScope.resources.$post('instances');
            return false;
          }
        })
        .then(function(instance) {
          if (instance) {
            persistentOptions.headers.Bearer = instance.apiKey; // Ensure apiKey for NEW instance
            $rootScope.instance = instance;
            if (config.configured) {
              return $rootScope.resources.$get('digest', {
                instanceId: config.instanceId,
                digestId: config.globalDigestId
              });
            } else {
              return instance.$post('digest-create', {}, {
                description: 'Global Repositories List'
              });
            }
          } else {
            return false;
          }
        })
        .then(function(digest) {
          if (digest) {
            $rootScope.digest = digest;
          }
          $location.path('/inboxes');
        })
        .catch(errorHandler);
      }]
    );

    app.controller('InboxesController', ['$rootScope', '$scope', '$timeout', 'serviceUrl',
      'configSaveUrl', '$http', '$q', 'prompt', '$location',
      function($rootScope, $scope, $timeout, serviceUrl,
        configSaveUrl, $http, $q, prompt, $location) {

      $scope.inboxesVisible = function() {
        // Only display when we actually have the config in $scope!
        return $rootScope.config;
      };

      if (!$rootScope.config) {
        $location.path('/');
        return;
      }

      $scope.newInbox = {
        url: '',
        name: '',
        family: 'GitHub' // Until we support other systems, hard-code this.
      };

      $scope.serviceUrl = serviceUrl;
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

      // NOTE: this is a bit of a hack to remove errors upon network request to clear 
      // out the UI prompts
      persistentOptions.transformUrl = function(url) {
        $scope.error.value = '';
        return url;
      };

      $scope.urlPattern = /^https?\:\/\/.{1,}\/.{1,}$/;

      $scope.inboxName = function() {
        if (!$scope.newInbox.url || $scope.newInbox.url.length < 1) return '...';
        var index = $scope.newInbox.url.lastIndexOf('/');
        if (index < 0) return '...';
        if (index === $scope.newInbox.url.length - 1) return '...';
        return $scope.newInbox.url.substr(index + 1);
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
          return $rootScope.resources.$post('instances')
          .then(function(instance) {
            persistentOptions.headers.Bearer = instance.apiKey; // Ensure apiKey for NEW instance
            $rootScope.instance = instance;
            return instance.$post('digest-create', {}, {
              description: 'Global Repositories List'
            });
          })
          .then(function(digest) {
            $rootScope.digest = digest;
            $rootScope.config.instanceId = $rootScope.instance.instanceId;
            $rootScope.config.globalDigestId = digest.digestId;
            $rootScope.config.apiKey = $rootScope.instance.apiKey;
            $rootScope.config.configured = true;
            if (configSaveUrl) return $http.post(configSaveUrl, $rootScope.config);
            return $q.when(true);
          });
        } else {
          if (configSaveUrl) return $http.post(configSaveUrl, $rootScope.config);
          return $q.when(true);
        }
      };

      var inboxConfigure = function(inbox) {
        var links = inbox.$links();
        inbox.addCommit = links['add-commit'].href + '?apiKey=' + persistentOptions.headers.Bearer;
        inbox.removeHref = links['self'].href + '?apiKey=' + persistentOptions.headers.Bearer;
      };
      
      var inboxesGet = function() {
        if ($rootScope.digest) {
          $rootScope.digest.$get('inboxes')
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
        }
      };

      var inboxesUpdate = function(enabled) {
        if (enabled) { 
          $('.inbox-url').select().focus();
        }
        inboxesGet();
      }

      inboxesUpdate($rootScope.config.enabled);

      $scope.enabledChanged = function() {
        $scope.newInbox.url = '';

        var toggle = $('.commitstream-admin .enabled');

        var enabled = toggle.prop('checked');

        $scope.enabledState.applying = true;
        toggle.bootstrapToggle('disable');

        configSave(enabled).then(function(configSaveResult) {
          // TODO need to handle configSaveResult?
          inboxesUpdate(enabled);
        })
        .catch(errorHandler)
        .finally(function() {
          $scope.enabledState.applying = false;
          toggle.bootstrapToggle('enable');
        });
      };

      $scope.applying = function() {
        return $scope.enabledState.applying;
      };

      $scope.overlayVisible = function() {
        return $scope.enabledState.applying ||!$rootScope.config.enabled;
      };

      $scope.adjustOverlay = function() {
        var repolistWidth = $('.repos-list').width();
        var repolistHeight = $('.repos-list').height();
        $('.repos-section .overlay').height(repolistHeight);
        $('.repos-section .overlay').width(repolistWidth);
      };

      // A jQuery based way of handling resizing of the window to adjust the overlay
      // when CS is disabled.
      // $(window).resize(function(){
      //   $scope.adjustOverlay();
      // });

      $scope.inboxCreate = function() {
        var index = $scope.newInbox.url.lastIndexOf('/');
        $scope.newInbox.name = $scope.newInbox.url.substr(index + 1);

        $rootScope.digest.$post('inbox-create', {}, $scope.newInbox)
        .then(function(inbox) {
          inboxConfigure(inbox);
          $scope.inboxes.unshift(inbox);
          $scope.newInbox.url = '';
          $scope.inboxHighlightTop(inbox.removeHref);
        })
        .catch(errorHandler);
      };

      $scope.inboxRemove = function(inbox) {
        prompt({
          title: 'Remove Repository?',
          message: 'Are you sure you want to remove the repository ' + inbox.name + '?',
          buttons: [
            { label:'Remove',
              primary: true,
              class: 'action-remove'
            }, 
            { 
              label:'Cancel',
              cancel: true,
              class: 'action-cancel'
            }
          ]
        }).then(function() {
          inbox.$del('self').then(function(result) {
            $scope.message.value = 'Successfully removed repository';      
            var index = $scope.inboxes.indexOf(inbox);
            $scope.inboxes.splice(index, 1);
            $timeout(function() {
              $('.commitstream-admin .message').fadeOut('slow', function() {
                $scope.message.value = '';
              });
            }, 4000);
          })
          .catch(errorHandler);
        });
      };

      var inboxHighlight = function(el) {
        if ($rootScope.config.enabled) {
          el.focus();
          el.select();
        }
      };

      $scope.inboxHighlight = function(evt) {
        inboxHighlight(evt.currentTarget);
      };

      $scope.inboxHighlightTop = function() {
        $timeout(function() {
          var el = $($('.commitstream-admin .inbox')[0]);          
          inboxHighlight(el);
        }, 0);
      };      

    }]);

    angular.bootstrap(el, ['commitStreamAdmin']);
  };
  window.CommitStreamAdminBoot = CommitStreamAdminBoot;
}());