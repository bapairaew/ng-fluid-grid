angular.module('ngFluidGrid', [])
  .controller('FluidGridController', [ '$scope', '$attrs', '$element', '$window', function ($scope, $attrs, $element, $window) {
    this.blocks = [];

    this.addBlock = function (block) {
      this.blocks.push(block);
      
      block.$on('$destroy', function () {
        this.removeBlock(block);
      }.bind(this));
    };

    this.removeBlock = function (block) {
      var index = this.blocks.indexOf(block);
      if (index !== -1) {
        this.blocks.splice(index, 1);
      }
    };

    this.getTotalBlocks = function () {
      return this.blocks.length;
    };

    this.getGridSize = function () {
      return { width: +$element[0].clientWidth, height: +$element[0].clientHeight };
    };

    this.getBlockMinWidth = function () {
      return angular.isDefined($scope.blockMinWidth) ? $scope.blockMinWidth : 400;
    };

    this.getBlockMinHeight = function () {
      return angular.isDefined($scope.blockMinHeight) ? $scope.blockMinHeight : 400;
    };

    this.getBlockVerticalMargin = function () {
      return angular.isDefined($scope.blockVerticalMargin) ? $scope.blockVerticalMargin : 400;
    };

    this.getBlockHorizontalMargin = function () {
      return angular.isDefined($scope.blockHorizontalMargin) ? $scope.blockHorizontalMargin : 400;
    };
  }])
  .directive('fluidGrid', [ '$window', '$timeout', function ($window, $timeout) {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      controller: 'FluidGridController',
      template: '<div class="fluid-grid" ng-transclude></div>',
      scope: {
        blockMinWidth: '@',
        blockMinHeight: '@',
        blockVerticalMargin: '@',
        blockHorizontalMargin: '@'
      }
    };
  }])
  .directive('fluidGridBlock', [ '$window', function ($window) {
    return {
      restrict: 'EA',
      require: '^fluidGrid',
      transclude: true,
      replace: true,
      template: '<div class="fluid-grid-block" style="float: left; width: {{blockWidth}}; height: {{blockHeight}};" ng-transclude></div>',
      link: function (scope, element, attrs, fluidGridController) {
        fluidGridController.addBlock(scope);

        var minWidth = fluidGridController.getBlockMinWidth();
        var minHeight = fluidGridController.getBlockMinHeight();
        var blockVerticalMargin = fluidGridController.getBlockVerticalMargin();
        var blockHorizontalMargin = fluidGridController.getBlockHorizontalMargin();

        // https://coderwall.com/p/ngisma
        var safeApply = function (fn) {
          var phase = this.$root.$$phase;
          if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
              fn();
            }
          } else {
            this.$apply(fn);
          }
        }.bind(scope);

        var setSize = function (scope, size, totalBlocks) {
          var blockWidth = size.width / totalBlocks;

          // TODO: improve this
          var row = 1;
          while (blockWidth < minWidth) {
            blockWidth = size.width / Math.floor(totalBlocks / row);
            row++;
          }
          var blockHeight = Math.max(size.height / row, minHeight);

          scope.blockWidth = (blockWidth - blockHorizontalMargin) + 'px';
          scope.blockHeight = (blockHeight - blockVerticalMargin) + 'px';
        };

        scope.$parent.$watch('blocks', function () {
          // BUG: fluidGridController.getGridSize() does not return the same size for every block here...
          // setSize(scope, fluidGridController.getGridSize(), fluidGridController.getTotalBlocks());

          // WORKAROUND: call window.resize instead
          angular.element($window).triggerHandler('resize');
        }, true);

        scope.$on('$destroy', function () {
          // BUG: fluidGridController.getGridSize() does not return the same size for every block here...
          // setSize(scope, fluidGridController.getGridSize(), fluidGridController.getTotalBlocks());

          // WORKAROUND: call window.resize instead
          angular.element($window).triggerHandler('resize');
        }.bind(this));

        angular.element($window).on('resize', function () {
          safeApply(function () {
            setSize(scope, fluidGridController.getGridSize(), fluidGridController.getTotalBlocks());
          });
        });
      }
    }
  }]);