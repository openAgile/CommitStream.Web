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
      ['$rootScope', '$scope', '$location', 'CommitStreamApi',
      function($rootScope, $scope, $location, CommitStreamApi) {        
        CommitStreamApi
        .load()
        .then(function(resources) {
          $rootScope.resources = resources;
          return resources.$post('instances');
        })
        .then(function(instance) {
          persistentOptions.headers.Bearer = instance.apiKey;
          $rootScope.instance = instance;

          return instance.$post('digest-create', {}, {
            description: 'My new digest'
          });
        })
        .then(function(digest) {
          $rootScope.digest = digest;
          $location.path('/inboxes');
        })
        .catch(function(error) {
          console.error("Caught an error adding an instance or a repo list!");
          console.error(error);
        });
      }]
    );

    app.controller('InboxesController', ['$rootScope', '$scope', '$timeout', function($rootScope, $scope, $timeout) {
      $scope.newInbox = {
        url: '',
        name: '',
        family: 'GitHub'
      };
      
      $scope.inboxes = [];

      $scope.enabledState = { 
        enabled: false,
        applying: false,
        onText: 'Enabled',
        offText: 'Disabled'
      };

      $scope.enabledChanged = function() {
        // TODO do we want icons?
        //$scope.enabled.icon = $scope.enabled.selected === 'Enabled' ? 
        // 'glyphicon glyphicon-stop' : 'glyphicon glyphicon-play';
        apply();
      };

      var apply = function() {
        $scope.enabledState.applying = true;
        $('.enabled').bootstrapToggle('disable');
        $timeout(function() {          
          $scope.enabledState.applying = false;
          $('.enabled').bootstrapToggle('enable');
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
          var links = inbox.$links();
          inbox.addCommit = links['add-commit'].href + 'apiKey=' + persistentOptions.headers.Bearer;
          $scope.inboxes.unshift(inbox);
        })
        .catch(function(error) {
          console.error("Caught an error adding a repo!");
          console.error(error);
        });
      };

      var inboxHighlight = function(el) {
        el.focus();
        el.select();
      };

      $scope.inboxHighlight = function(evt) {
        inboxHighlight(evt.currentTarget);
      };

      $scope.inboxHighlightTop = function() {
        var el = $($('.inbox')[0]);
        $timeout(function() {
          inboxHighlight(el);
        }, 0);      
      };

    }]);

    angular.bootstrap(el, ['commitStreamAdmin']);
  };
  window.CommitStreamAdminBoot = CommitStreamAdminBoot;
}());