(function() {
  'use strict';

  var commitStreamAdminDirectives = angular.module('commitStreamAdminDirectives', []);

  commitStreamAdminDirectives.directive('resizableOverlay', function($window) {
    return function($scope) {
      return angular.element($window).bind('resize', function() {
        $scope.adjustOverlay();
        return $scope.$apply();
      });
    };
  });

  commitStreamAdminDirectives.directive('toggleCheckbox', function($timeout) {
    return {
      restrict: 'A',
      transclude: true,
      replace: false,
      require: 'ngModel',
      link: function($scope, $element, $attr, ngModel) {
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
}());