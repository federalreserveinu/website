//var filmstripApp = angular.module('filmstrip', ['ngTouch'])
pubwebApp.requires.push("ngTouch");
 pubwebApp.controller('filmstripController', function($scope) {

        $scope.updateView = function(){

            var itemsVisible = parseInt($scope.filmstripWidth/$scope.itemWidth);

            if(itemsVisible != $scope.itemsVisible){

                console.log(itemsVisible,$scope.itemsVisible);
                $scope.currentIndex = 0;
                $scope.itemsVisible = itemsVisible;
            }
            
            var leftOffset = $scope.currentIndex * $scope.filmstripWidth;

            $scope.leftMargin = {"margin-left": (0 - leftOffset)+"px"};
            $scope.hasPrevious = $scope.currentIndex > 0;
            $scope.hasNext = ($scope.itemCount * $scope.itemWidth) > (leftOffset + $scope.filmstripWidth);
        }

        $scope.currentIndex = 0;
        $scope.itemCount = 0;
        $scope.itemWidth = 0;
        $scope.leftMargin = 0;
        $scope.filmstripWidth = 0;
        $scope.hasPrevious = false;
        $scope.hasNext = true;
        $scope.itemsVisible = 0; // use this to see when responsive style changes number of visible items

        $scope.next = function($event) {
            $event.preventDefault();
            if($scope.hasNext){
                $scope.currentIndex++;
                $scope.updateView();
            }
        };

        $scope.previous = function($event) {
            $event.preventDefault();
            if($scope.hasPrevious){
                $scope.currentIndex--;
                $scope.updateView();
            }
        };

    })
    .directive('filmstripItems', ['$window', function($window) {
        return {

            scope: false,
            link: function(scope, el, attr) {
                el = el[0];
                scope.itemCount = el.childElementCount;
                scope.filmstripWidth = el.clientWidth;
                scope.itemWidth = el.children[0].clientWidth;

                scope.updateView();

                angular.element($window).bind('resize', function() {

                    scope.filmstripWidth = el.clientWidth;
                    scope.itemWidth = el.children[0].clientWidth;

                    scope.updateView();

                    // manual $digest required as resize event
                    // is outside of angular
                    scope.$digest();
                });
            }
        }
    }]);
