pubwebApp.config(['$compileProvider',function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|javascript):/);
}]);
pubwebApp.run(['$templateCache', function($templateCache) {
   $templateCache.put('careersCalendarMod.html', '<div class="newsCarousel" equalize-height><div class="item"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12"><div class="col-xs-12 col-sm-12 col-md-2 newsItems" ng-repeat="(key,value) in data | orderObjectBy:\'value.sort\'" ng-init="key = value[\'_key\']" equalize-height-add="value"><div class="dateStamp" ng-class="{hover: value.today}"><time>{{value.weekday}}<br/>{{key}}</time></div><p ng-repeat="(key2, value2) in value.events | orderObjectByTime:\'time\'" ng-init="key = value[\'_key\']"><span ng-if="value2.time">{{value2.time}}</span><br/>{{value2.title}}<br/>{{value2.location}}<br/><a ng-if="value2.external" href="{{value2.external}}">More information</a></p></div></div></div></div><a class="left carousel-control icon__carousel icon icon-next icon--rotate" href="#" ng-if="page!==0" ng-click="lastWeek()" role="button" eat-click><span class="sr-only">Last Week</span></a><a class="right carousel-control icon__carousel icon icon-next" href="#" ng-if="page !== max" ng-click="nextWeek()" role="button" eat-click><span class="sr-only">Next Week</span></a></div>');
}]);
pubwebApp.filter('unsafe', ['$sce', function($sce) {
    return $sce.trustAsHtml;
}]);
//function removeWhitespace(response) {
//  return response.replace(/(\r\n|\n|\r)/gm,"");
//}
function htmlDecode(input) {
    var e = document.createElement('textarea');
    e.innerHTML = input;
    return e.value;
}
pubwebApp.factory('calendarRequestFactory', ['$http', function($http) {
    return {
        getCalendar: function() {
            //$http.defaults.transformResponse.unshift(removeWhitespace);
            return $http.get('/json/careersEvents.json').then(function(result) {
                var object = new Object;
                var today = new Date();
                result.data.events.pop();
                result.data.events.forEach(function(item) {
                if(item.days !== ""){
                    var tempDate = new Date(item.days);
                    var day = parseInt(tempDate.getDate());
                    var year = parseInt(tempDate.getFullYear());
                    var month = parseInt(tempDate.getMonth()) + 1;
                        createNestedObject(object, [year, month, day]);
                        if (parseInt(year) === today.getFullYear() && parseInt(month) === today.getMonth() + 1 && parseInt(day) === today.getDate()) {
                            object[year][month][day]["today"] = true;
                        }
                        if (!angular.isObject(object[year][month][day]["events"])) {
                            object[year][month][day]["events"] = [];
                        }
                        if (item.popup === "Popup") {
                            item.live = "javascript:exitWindow('" + item.live + "','external',false,true)";
                        }
                        if (item.description) {
                            item.description = htmlDecode(item.description);
                        }
                        object[year][month][day]["events"].push({
                            "title": item.title,
                            "link": item.link,
                            "time": item.time,
                            "description": item.description,
                            "type": item.type,
                            "location": item.location,
                            "live": item.live,
                            "external":item.external,
                            "popup": item.popup
                        });
                        }
                    });
              
               
                return object;
            });
        }
    };
}]);
pubwebApp.filter('selected', function() {
    return function(items, selected, names) {
        if (selected.length !== 0) {
            var filteredItems = [];
            items.forEach(function(item) {
                selected.forEach(function(selected) {
                    if (selected === item.type.toString()) {
                        filteredItems.push(item);
                    }
                });
            });
            return filteredItems;
        } else {
            return items;
        }
    };
});
pubwebApp.directive('eatClick', function() {
    return function(scope, element, attrs) {
        $(element).click(function(event) {
            event.preventDefault();
        });
    }
});
pubwebApp.directive('equalizeHeight', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        controller: function($scope) {
            var elements = [];
            this.addElement = function(element) {
                    elements.push(element);
                }
                // resize elements once the last element is found
            this.resize = function() {
                $timeout(function() {
                    // find the tallest
                    var tallest = 0,
                        height;
                    angular.forEach(elements, function(el) {
                        height = el[0].offsetHeight;
                        if (height > tallest)
                            tallest = height;
                    });
                    // resize
                    angular.forEach(elements, function(el) {
                        el[0].style.height = tallest + 'px';
                    });
                }, 0);
            };
        }
    };
}]);
pubwebApp.directive('equalizeHeightAdd', [function($timeout) {
    return {
        restrict: 'A',
        require: '^^equalizeHeight',
        link: function(scope, element, attrs, ctrl_for) {
            // add element to list of elements
            ctrl_for.addElement(element);
            if (scope.$last)
                ctrl_for.resize();
        }
    };
}]);
pubwebApp.filter('monthName', [function() {
    return function(monthNumber) { //1 = January
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[monthNumber - 1];
    }
}]);
pubwebApp.filter('weekdayName', [function() {
    return function(day, month, year) { //1 = January
        var date = new Date(year, month - 1, day);
        var monthNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return monthNames[date.getDay()];
    }
}]);
pubwebApp.filter('orderObjectBy', function() {
    return function(input, attribute) {
        if (!angular.isObject(input)) {
            return input;
        }
        var array = [];
        for (var objectKey in input) {
            input[objectKey]['_key'] = objectKey;
            array.push(input[objectKey]);
        }

        array.sort(function(a, b) {
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);

            return a - b;
        });

        return array;
    }
});
pubwebApp.filter('orderObjectByTime', function() {
    return function(input) {
        if (!angular.isObject(input)) {
            return input;
        }
        var array = [];
        for (var objectKey in input) {
            input[objectKey]['_key'] = objectKey;
              if(input.hasOwnProperty(objectKey)){
                array.push(input[objectKey]);
            }
        }
        array.sort(function(a, b) {
            var pma = a['time'].substr(a['time'].length - 4);
            var datea = new Date('1970/01/01 ' + a['time'].slice(0, -4));
            var pmb = b['time'].substr(b['time'].length - 4);
            var dateb = new Date('1970/01/01 ' + b['time'].slice(0, -4));
            if (pma === 'p.m.' && a['time'].slice(0, 2) !== '12') {
                datea.setHours(datea.getHours() + 12);
            } else if (pma === 'a.m.' && a['time'].slice(0, 2) === '12') {
                datea.setHours(datea.getHours() - 12);
            }
            if (pmb === 'p.m.' && b['time'].slice(0, 2) !== '12') {
                dateb.setHours(dateb.getHours() + 12);
            } else if (pmb === 'a.m.' && b['time'].slice(0, 2).slice(0, 2) === '12') {
                dateb.setHours(dateb.getHours() - 12);
            }
            if ((datea - dateb) === 0) {
                if (a.title > b.title) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                return datea - dateb;
            }
        });
        return array;
    }
});
// Function: createNestedObject( base, names[, value] )
//   base: the object on which to create the hierarchy
//   names: an array of strings contaning the names of the objects
//   value (optional): if given, will be the last object in the hierarchy
// Returns: the last object in the hierarchy
var createNestedObject = function(base, names, value) {
    // If a value is given, remove the last name and keep it for later:
    var lastName = arguments.length === 3 ? names.pop() : false;
    // Walk the hierarchy, creating new objects where needed.
    // If the lastName was removed, then the last object is not set yet:
    for (var i = 0; i < names.length; i++) {
        base = base[names[i]] = base[names[i]] || {};
    }
    // If a value was given, set it to the last name:
    if (lastName) base = base[lastName] = value;
    // Return the last object in the hierarchy:
    return base;
};

pubwebApp.controller('calendarModule', ['$scope', 'calendarRequestFactory', function($scope, requestFactory) {
    $scope.original = {};
    requestFactory.getCalendar().then(setWeeks);

    function sortNum(a, b) {
        return a - b;
    }

    function setWeeks(data) {
        var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var page = 0;
        var index = 0;
        var lastYear = Math.max.apply(null, Object.keys(data));
        var lastMonth = Math.max.apply(null, Object.keys(data[lastYear]));
        var lastDay = Math.max.apply(null, Object.keys(data[lastYear][lastMonth]));
        var lastDate = new Date(lastYear, lastMonth - 1, lastDay);
        while (today.getTime() <= lastDate.getTime()) {
            if (angular.isObject(data[today.getFullYear()]) && angular.isObject(data[today.getFullYear()][today.getMonth() + 1]) && angular.isObject(data[today.getFullYear()][today.getMonth() + 1][today.getDate()])) {
                createNestedObject($scope.original, [page, (today.getMonth() + 1) + '/' + today.getDate()], data[today.getFullYear()][today.getMonth() + 1][today.getDate()]);
                index++;
                $scope.original[page][(today.getMonth() + 1) + '/' + today.getDate()]['weekday'] = dayNames[today.getDay()];
                $scope.original[page][(today.getMonth() + 1) + '/' + today.getDate()]['sort'] = today.getTime();
                if (today.getDate() === new Date().getDate() && today.getMonth() === new Date().getMonth()) {
                    $scope.original[page][(today.getMonth() + 1) + '/' + today.getDate()]['today'] = true;
                }
            }
            today.setDate(today.getDate() + 1);
            if (typeof $scope.original[page] !== 'undefined' && Object.keys($scope.original[page]).length === 5) {
                page++;
            }
        }
    $scope.max = Object.keys($scope.original).length - 1;
        $scope.page = 0;
        $scope.data = $scope.original[$scope.page];
    }

    $scope.nextWeek = function() {
        $scope.data = $scope.original[++$scope.page];
    };
    $scope.lastWeek = function() {
        $scope.data = $scope.original[--$scope.page];
    };
}]);
