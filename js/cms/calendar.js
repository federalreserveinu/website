pubwebApp.requires.push('ui.bootstrap', 'checklist-model')
pubwebApp.config(['$compileProvider',function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|javascript):/);
}]);
pubwebApp.run(['$templateCache', function($templateCache) {
    $templateCache.put('searchForm.html', '<h3>Filter by:</h3><form class="eventSearch form-inline" role="form"><div class="eventSearch__label"><p class="form-control-static"><strong><label>Month:</label></strong></p></div><div class="eventSearch__inputs"><div class="input-group input-group-sm"><div class=\'input-group date\'><input type="text" class="form-control" aria-label="Search for Month" name="month" placeholder="Choose Month" ng-model="datepicker.date" uib-datepicker-popup="MMMM yyyy" is-open="datepicker.openedStart" datepicker-options="dateOptions" close-text="Close" /><span class="input-group-btn"><button type="button" aria-label="Open Calendar" class="btn btn-default openCalendarStart" ng-click="open($event,\'openedStart\')"><span class="icon icon--centered icon__xs icon-calendar-no-circle"></span></button></span></div></div></div><br/><div class="eventSearch__label"><p class="form-control-static"><strong><label>Type:</label></strong></p></div><div class="eventSearch__inputs"><div class="checkbox" ng-repeat="(key, value) in checkboxes"><label class="neLabel"><input type="checkbox" aria-label="Checkbox for {{value.label}}" checklist-model="checked" checklist-value="value" />{{value.label}}</label></div></div><div class="eventSearch__submit" ng-click="changeValue()"><a href="#">Submit<span class="icon icon__sm icon--right icon-more"></span></a></div><p class="help-block"></p></form>');
    $templateCache.put('calendar.html', '<div class="row-title"><h4 class="text-center"><span ng-bind="month | monthName"></span> <span ng-bind="year"></span></h4></div><div class="row-header"><div class="prev"><a ng-if="!min" ng-href="#" eat-click ng-click="previousMonth()"><span class="icon icon__sm icon-more icon--rotate"></span><b>Previous</b></a></div><div class="next"><a ng-if="!max" ng-click="nextMonth()" ng-href="#" eat-click><b>Next</b><span class="icon icon__sm icon--right icon-more"></span></a></div></div><div id="calendar"><div class="row row-condensed" ng-if="(value.events | selected:q:checkboxNames).length !== 0" ng-repeat="(key, value) in data | orderObjectBy:\'_key\' " ng-init="key = value[\'_key\']"><div class="col-xs-2 col-sm-3 col-md-2 calendarTime"><div ng-class="{hover: value.today}" class="dateStamp"><time datetime="{{year}}-{{month}}-{{key}}"><span ng-bind="key | weekdayName:month:year"></span><br><span ng-bind="month"></span>/<span ng-bind=\'key\'></span></time></div></div><div class="calendarRow panel panel-default col-xs-8 col-sm-9 col-md-10"><div class="panel-body"><div class="row"><div ng-if=\'value.announcement\' class="alertText"><div class="col-md-2 col-xs-3 eventlist__time"><span class="icon icon__sm icon-alert"></span></div><div class="col-xs-9 col-md-10"><span ng-bind-html=\'value.announcement | unsafe\'></span></p></div></div></div><div data-item="{{value2.type}}" class="row" ng-repeat="(key2, value2) in value.events | orderObjectByTime | selected:q:checkboxNames" ng-init="key = value[\'_key\']"><div class="col-xs-3 col-md-2 eventlist__time"><p ng-bind=\'value2.time\'></p></div><div class="col-xs-9 col-md-10 eventlist__event"><p ng-if="value2.link"><a href="{{value2.link}}" ng-bind="value2.title" title=""></a></p><p ng-if="!value2.link" ng-bind="value2.title"></p><p ng-if="value2.live"><a class="watchLive" href="{{value2.live}}" title="Watch Live"><span class="icon-video icon icon__sm"></span>Watch Live</a></p><p ng-if="value2.description && !value2.location" ng-bind-html="value2.description | unsafe"></p><p ng-if="value2.description && value2.location" class="calendar__title"><em ng-bind-html="value2.description | unsafe"></em></p><p ng-if="value2.location" ng-bind="value2.location"></p></div></div></div></div></div></div><div class="row-footer"><div  class="prev"><a ng-if="!min" ng-href="#" eat-click  ng-click="previousMonth()"><span class="icon icon__sm icon--left icon-more icon--rotate"></span><b>Previous</b></a></div><div class="next"><a ng-if="!max" ng-click="nextMonth()" ng-href="#" eat-click ><b>Next</b><span class="icon icon__sm icon--right icon-more"></span></a></div></div>');
    $templateCache.put('calendarMod.html', '<div class="newsCarousel" equalize-height><div class="item"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12"><div class="col-xs-12 col-sm-12 col-md-2 newsItems" ng-repeat="(key,value) in data | orderObjectBy:\'_key\'" ng-init="key = value[\'_key\']" equalize-height-add="value"><div class="dateStamp" ng-class="{hover: value.today}"><time>{{value.weekday}}<br/>{{key}}</time></div><p ng-if="value.announcement"><span ng-bind-html=\'value.announcement | unsafe\'></span></p><p ng-repeat="(key2, value2) in value.events | orderObjectByTime:\'time\'" ng-init="key = value[\'_key\']"><a ng-if="value2.link" href="{{value2.link}}"><span ng-if="value2.time">{{value2.time}} - </span>{{value2.title}} </a><span ng-if="!value2.link"><span ng-if="value2.time">{{value2.time}} - </span>{{value2.title}}</span></p></div></div></div></div><a class="left carousel-control icon__carousel icon icon-next icon--rotate" href="#" ng-if="page!==0" ng-click="lastWeek()" role="button" eat-click><span class="sr-only">Last Week</span></a><a class="right carousel-control icon__carousel icon icon-next" href="#" ng-if="page!==1 && max!==0" ng-click="nextWeek()" role="button" eat-click><span class="sr-only">Next Week</span></a></div>');
     
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
        getCheckboxItems: function() {
            return $http.get('/json/calendar-checkbox.json', {
                cache: true
            }).then(function(result) {
                result.data.pop();
                return result.data;
            },function() {
                $(".angularEvents").remove();
                $(".js__Hide").removeClass('js__Hide');
            });
        },
        getCalendar: function() {
            //$http.defaults.transformResponse.unshift(removeWhitespace);
            return $http.get('/json/calendar.json').then(function(result) {
                var object = new Object();
                var today = new Date();
                result.data.events.pop();
                result.data.announcement.pop();
                result.data.events.forEach(function(item) {
                    var days = item.days.split(',');
                    var yearMonth = item.month.split('-');
                    var year = parseInt(yearMonth[0]);
                    var month = parseInt(yearMonth[1]);
                    days.forEach(function(day) {
                        day = parseInt(day.trim());
                        createNestedObject(object, [year, month, day]);
                        if (parseInt(year) === today.getFullYear() && parseInt(month) === today.getMonth() + 1 && parseInt(day) === today.getDate()) {
                            object[year][month][day]["today"] = true;
                        }
                        if (!angular.isObject(object[year][month][day]["events"])) {
                            object[year][month][day]["events"] = [];
                        }
                 
                        if (item.description) {
                            item.description = htmlDecode(item.description);
                        }  
                        if (item.location) {
                            item.location = htmlDecode(item.location);
                        }
                        object[year][month][day]["events"].push({
                            "title": htmlDecode(item.title),
                            "link": item.link,
                            "time": item.time,
                            "description": item.description,
                            "type": item.type,
                            "location": item.location,
                            "live": item.live,
                            "popup": item.popup
                        });
                    });
                });
                result.data.announcement.forEach(function(item) {
                    var yearMonth = item.month.split('-');
                    var year = parseInt(yearMonth[0]);
                    var month = parseInt(yearMonth[1]);
                    item.title = htmlDecode(item.title);
                    createNestedObject(object, [year, month, item.day, 'announcement'], item.title);
                });
                return object;
            },function() {
                $(".angularEvents").remove();
                $(".js__Hide").removeClass('js__Hide');
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
pubwebApp.controller('calendarController', ['$scope', 'calendarRequestFactory', function($scope, requestFactory) {
    $scope.datepicker = {};
    $scope.datepicker.date = new Date();
    $scope.month = $scope.datepicker.date.getMonth() + 1;
    $scope.year = $scope.datepicker.date.getFullYear();
    $scope.day = $scope.datepicker.date.getDate();
    $scope.datepicker.minDate = new Date($scope.year - 1, $scope.month - 1, $scope.day);
    $scope.min = false;
    $scope.max = false;
    $scope.datepicker.maxDate = null;
    $scope.q = "";
    $scope.checked = [];
    var tempDay = {};
    //$scope.datepicker.date = date;
    $scope.dateOptions = {
        //'format-month': 'MMM',
        'minMode': 'month',
        'showWeeks':false,
        'minDate': $scope.datepicker.minDate
    };
    requestFactory.getCalendar().then(setYear);
    requestFactory.getCheckboxItems().then(setupCheckboxes);

    function setupCheckboxes(labels) {
    if(!labels) {
    return;}
        $scope.checkboxes = labels;
        $scope.checkboxNames = $scope.checkboxes.map(function(label) {
            return label.name;
        });
    }

    function setYear(data) {
    if(!data) {
    return
    }
          if (!$scope.original) {
            var maxYear = 0,
                maxMonth = 1,
                minYear = 9999,
                minMonth = 12,
                year;
            $scope.original = data;

            var temp = Object.keys(data);
            for (i = 0; i < temp.length; i++) {
                year = parseInt(temp[i]);
                minYear = Math.min(minYear, year);
                maxYear = Math.max(maxYear, year);
            }
            if (minYear < new Date().getFullYear() - 1) {
                minYear = new Date().getFullYear() - 1;
            }
            var maxYearMonths = Object.keys(data[maxYear]);
            for (i = 0; i < maxYearMonths.length; i++) {
                month = parseInt(maxYearMonths[i]);
                maxMonth = Math.max(maxMonth, month);
            }
            if (data[minYear]) {
                var minYearMonths = Object.keys(data[minYear]);
                for (i = 0; i < minYearMonths.length; i++) {
                    month = parseInt(minYearMonths[i]);
                    minMonth = Math.min(minMonth, month);
                }
            } else {
                minMonth = 1;
                minYear++;
            }
            $scope.datepicker.maxDate = $scope.dateOptions.maxDate = new Date(maxYear, maxMonth - 1);
            $scope.datepicker.minDate = $scope.dateOptions.minDate = new Date(minYear, minMonth - 1);

        }
        if (!angular.isObject(data[$scope.year]) || !angular.isObject(data[$scope.year][$scope.month])) {
            $scope.data = null;
        } else {
            $scope.data = data[$scope.year][$scope.month];
        }
      
        $scope.datepicker.date = new Date($scope.year, $scope.month - 1);
        $scope.min = $scope.datepicker.date <= $scope.datepicker.minDate;
        $scope.max = $scope.datepicker.date >= $scope.datepicker.maxDate;
    }
    $scope.nextMonth = function(e) {
        $scope.month = $scope.month + 1;
        if ($scope.month === 13) {
            $scope.month = 1;
            $scope.year += 1;
        }
        setYear($scope.original);  
        var height = 0;
        var selectors = '#nav-primary,.t4_nav--horizontal,.t2__offcanvas';
    if($(window).scrollTop() !== 0) { 
    selectors += ",.t1_nav";
    }
    $(selectors).each(function() {
        var $navbar = $(this);
        if ($navbar.is(":visible")) {
            height += $navbar.height();
        }
    });

        $("html, body").animate({scrollTop:  $('#calendar').parent().offset().top - height - 5 +'px'},500);
    };
    $scope.previousMonth = function() {
        $scope.month = $scope.month - 1;
        if ($scope.month === 0) {
            $scope.month = 12;
            $scope.year -= 1;
        }
        setYear($scope.original);
          var height = 0;

    $('.t1_nav,#nav-primary,.t4_nav--horizontal,.t2__offcanvas').each(function() {
        var $navbar = $(this);
        if ($navbar.is(":visible")) {
            height += $navbar.height();
        }
    });
        $("html,body").animate({scrollTop:  $('#calendar').parent().offset().top - height - 5 +'px'},500);
    };
    $scope.open = function($event, opened) {
         
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datepicker[opened] = true;
    };
    $scope.changeValue = function() {
        $scope.q = $scope.checked.map(function(item) {
            return item.name;
        });
        $scope.year = $scope.datepicker.date.getFullYear();
        $scope.month = $scope.datepicker.date.getMonth() + 1;
        setYear($scope.original);
    };
}]);
pubwebApp.controller('calendarModule', ['$scope', 'calendarRequestFactory', function($scope, requestFactory) {
    $scope.original = {};
    requestFactory.getCalendar().then(setWeeks);

    function sortNum(a, b) {
        return a - b;
    }

    function setWeeks(data) {
        var today = new Date();
        var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var page = 0;
        var index = 0;
        var lastYear = Object.keys(data).sort(sortNum).reverse()[0];
        var lastMonth = Object.keys(data[lastYear]).sort(sortNum).reverse()[0];
        var lastDay = Object.keys(data[lastYear][lastMonth]).sort(sortNum).reverse()[0];
        var lastDate = new Date(lastYear, lastMonth - 1, lastDay);
        while (today.getTime() <= lastDate.getTime() && index < 10) {
            if (angular.isObject(data[today.getFullYear()]) && angular.isObject(data[today.getFullYear()][today.getMonth() + 1]) && angular.isObject(data[today.getFullYear()][today.getMonth() + 1][today.getDate()])) {
                createNestedObject($scope.original, [page, (today.getMonth() + 1) + '/' + today.getDate()], data[today.getFullYear()][today.getMonth() + 1][today.getDate()]);
                index++;
                $scope.original[page][(today.getMonth() + 1) + '/' + today.getDate()]['weekday'] = dayNames[today.getDay()];
                if (today.getDate() === new Date().getDate()) {
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
