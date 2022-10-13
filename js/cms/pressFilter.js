var app = angular.module('neApp', ['ui.bootstrap', 'checklist-model']);
app.run(['$templateCache', function($templateCache) {
    $templateCache.put('neForm.html', '<h3>Filter by:</h3><div class="sr-only sr-only-focusable" tabindex="0"><h5>Calendar Keyboard Shortcuts</h5><ul><li><kbd>Left</kbd>: Move focus to the previous date. Will move to the last date of the previous view, if the current date is the first date of a view. </li><li><kbd>Right</kbd>: Move focus to the next date. Will move to the first date of the following view, if the current date is the last date of a view.</li><li><kbd>Up</kbd>: Move focus to the same column of the previous row. Will wrap to the appropriate row in the previous view. </li><li><kbd>Down</kbd>: Move focus to the same column of the following row. Will wrap to the appropriate row in the following view.</li><li><kbd>PgUp</kbd>: Move focus to the same date of the previous view. If that date does not exist, focus is placed on the last date of the month.</li><li><kbd>PgDn</kbd>: Move focus to the same date of the following view. If that date does not exist, focus is placed on the last date of the month.</li><li><kbd>Home</kbd>: Move to the first date of the view.</li><li><kbd>End</kbd>: Move to the last date of the view.</li><li><kbd>Enter/Space</kbd>: Select date.</li><li><kbd>Ctrl+Up</kbd>: Move to an upper mode.</li><li><kbd>Ctrl+Down</kbd>: Move to a lower mode.</li><li><kbd>Esc</kbd>: Will close popup, and move focus to the input.</li></ul></div><form class="eventSearch form-inline"><div class="eventSearch__label"><p class="form-control-static"><strong><legend>Date:</legend></strong></p></div><div class="eventSearch__inputs"><div class="input-group input-group-sm"><div class=\'input-group date\'><input type="text" class="form-control" aria-label="Search from Date" placeholder="From Date:" uib-datepicker-popup="M!/d!/yyyy" ng-model="datepicker.startDate" is-open="datepicker.openedStart" datepicker-options="dateOptions" min-date="datepicker.minDate" init-date="datepicker.minDate" max-date="datepicker.endDate" close-text="Close" showWeeks="false" /><span class="input-group-btn"><button type="button" aria-label="Open Calendar" class="btn btn-default openCalendarStart" ng-click="open($event,\'openedStart\')"><span class="icon icon--centered icon__xs icon-calendar-no-circle"></span></button></span></div><p class="input-group eventSearch__label--middle">to</p><div class=\'input-group date\'><input type="text" class="form-control" aria-label="Search to Date" placeholder="To Date:" uib-datepicker-popup="M!/d!/yyyy" ng-model="datepicker.endDate" is-open="datepicker.openedEnd" datepicker-options="dateOptions" min-date="datepicker.startDate" max-date="datepicker.maxDate" close-text="Close" showWeeks="false" /><span class="input-group-btn"><button type="button" aria-label="Open Calendar" class="btn btn-default openCalendarEnd"  ng-click="open($event,\'openedEnd\')"><span class="icon icon--centered icon__xs icon-calendar-no-circle"></span></button></span></div></div></div><div class="eventSearch__label"><p class="form-control-static"><strong><legend>{{label}}:</legend></strong></p></div><div class="eventSearch__inputs"><div class="checkbox" ng-repeat="(key, value) in checkboxes"><label class="neLabel"><input type="checkbox" aria-label="Checkbox for {{value.label}}" checklist-model="checked" checklist-value="value" />{{value.label}}</label></div></div><div class="eventSearch__submit" ng-click="changeValue()"><a href="#">Submit<span class="icon icon__sm icon--right icon-more"></span></a></div><p class="help-block">Note: Press releases prior to 2006 are available in our <a href="/newsevents/pressreleases/press-release-archive.htm">archive</a></p></form>');
    $templateCache.put('items.html', '<div class="row" ng-repeat="item in items | selected:query:checkboxNames | dateRange: datepicker.start: datepicker.end | startFrom:(currentPage-1)*itemsPerPage | limitTo:itemsPerPage"><div class="col-xs-3 col-md-2 eventlist__time"><time class=\'itemDate\' datetime="{{item.d}}">{{item.d}}</time></div><div class="col-xs-9 col-md-10 eventlist__event"><p class=\'itemTitle\'><em><a href="{{item.l}}" ng-bind-html=\'item.title\'></a></em></p><p><a class="watchLive" ng-if="item.v" ng-href="{{item.v}}"><span class="icon icon__sm icon-video"></span><span class="icon-label">{{item.videoTitle}}</span></a></p><p class=\'news__speaker\' ng-bind-html=\'item.s\'></p><p class=\'result__location\' ng-bind-html=\'item.lo | trusted\'></p><p class=\'addendum\'><strong><em ng-bind-html=\'item.a\'></em></strong></p></div></div><div class="row" ng-if="filtered.length === 0"><div class="col-xs-9 col-md-10 eventlist__event"><p>No Results try a new search</p></div></div>');
    $templateCache.put('Press_Release.html', '<div class="row" ng-repeat="item in items | selectedPress:query:checkboxNames | dateRange: datepicker.start : datepicker.end | startFrom:(currentPage-1)*itemsPerPage | limitTo:itemsPerPage"><div class="col-xs-3 col-md-2 eventlist__time"><time class=\'itemDate\' datetime="{{item.d}}">{{item.d}}</time></div><div class="col-xs-9 col-md-10 eventlist__event"><p><span class=\'itemTitle\'> <a href="{{item.l}}" ng-bind-html=\'item.title\'></a></span></p><p class=\'eventlist__press\'><b><em ng-bind-html=\'item.press_type\'></em></b></p><p ng-if="item.press_type2" class=\'eventlist__press\'><b><em ng-bind-html=\'item.press_type2\'></em></b></p></div></div><div class="row" ng-if="filtered.length === 0"><div class="col-xs-9 col-md-10 eventlist__event"><p>No Results try a new search</p></div></div>');
    $templateCache.put('meetings.html', '<ul class="list-unstyled"><li class="row" ng-repeat="item in items | selectedPress:query:checkboxNames | dateRange: datepicker.start : datepicker.end | startFrom:(currentPage-1)*itemsPerPage | limitTo:itemsPerPage"><h5 class="col-xs-12">{{item.d | fullDate:item.d2}}</h5><span class="col-xs-3">{{item.time}}</span><span class="col-xs-2">{{item.pt}}</span><span class="col-xs-7"><a href="{{item.l}}">Meeting details {{item.pt | materials:item.memoranda}}</a><br ng-if="item.a"/><span ng-if="item.a" class="icon icon__xs icon-alert"></span> <span ng-if="item.a">({{item.alertType}}, see notice)</span><br ng-if="item.v"><a class="watchLive" ng-if="item.v" ng-href="{{item.v}}"><span class="icon icon__sm icon-video"></span><span class="icon-label">{{item.videoTitle}}</span></a></span></li></ul><div class="row" ng-if="filtered.length === 0"><div class="col-xs-9 col-md-10 eventlist__event"><p>No Results try a new search</p></div></div>');
}]);
app.factory('requestFactory', ['$http', function($http) {
    var jsonConfig = {
        transformResponse: function(data) {
            try {
                var jsonObject = JSON.parse(data); // verify that json is valid
                return jsonObject;
            } catch (e) {
                $(".angularEvents").remove();
                $(".js__Hide").removeClass('js__Hide');
                throw new Error("did not receive a valid Json: " + e);
            }
            return {};
        }
    };
    return {
        getCheckboxItems: function(title) {
            return $http.get('/json/press-type.json',jsonConfig).then(function(result) {
                result.data.pop();
                return result.data;
            },function() {
                $(".angularEvents").remove();
                $(".js__Hide").removeClass('js__Hide');
            });
        },
        getItems: function(title) {
            return $http.get('/json/ne-press.json',jsonConfig).then(function(result) {
                return result.data;
            },function() {
                $(".angularEvents").remove();
                $(".js__Hide").removeClass('js__Hide');
            });
        }
    };
}]);
app.filter('trusted', ['$sce', function($sce) {
    var div = document.createElement('div');
    return function(text) {
        div.innerHTML = text;
        return $sce.trustAsHtml(div.textContent);
    };
}]);
app.filter('materials', function() {
    return function(type, memoranda) {
        if (type === "Open" && memoranda === "Yes") {
            return "and materials";
        }
    };
});
app.filter('startFrom', function() {
    return function(input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});
function formerOfficial(speaker, names) {
    var former = true;
    names.forEach(function(name) {
        if (speaker.indexOf(name) != -1) {
            former = false;
        }
    });
    return former;
}
app.filter('selected', function() {
    return function(items, selected, names) {
        var filteredItems = [];
        if (selected.length !== 0) {
            items.forEach(function(item) {
                selected.forEach(function(selected) {
                    if (item.s.toString().indexOf(selected) != -1) {
                        filteredItems.push(item);
                    } else if (selected === 'Other Officials' && item.o) {
                        filteredItems.push(item);
                    } else if (selected === 'Former Officials' && !item.o && formerOfficial(item.s.toString(), names)) {
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
app.filter('fullDate', function() {
    return function(item, item2) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var date = new Date(item);

        if (typeof item2 !== "undefined") {
            var date2 = new Date(item2);
            if (date.getMonth() === date2.getMonth()) {
                return (months[date.getMonth()] + " " + date.getDate() + "-" + date2.getDate() + ", " + date.getFullYear());
            } else if (date.getYear() === date2.getYear()) {
                return (months[date.getMonth()] + " " + date.getDate() + "-" + months[date2.getMonth()] + " " + date2.getDate() + ", " + date.getFullYear());
            } else {
                return (months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + "-" + months[date2.getMonth()] + " " + date2.getDate() + ", " + date2.getFullYear());
            }
        } else {
            return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        }
    };
});
app.filter('fullTime', function() {
    return function(item) {
        var date = new Date(item);
        return date;
    };
});
app.filter('selectedPress', function() {
    return function(items, selected, names) {
        var filteredItems = [];
        if (selected.length !== 0) {
            items.forEach(function(item) {
                selected.forEach(function(selected) {
                    var exists = false;
                    filteredItems.some(function(el) {
                        exists = el.l === item.l;
                    }); 
                    if(!exists && (item.pt.toString() === selected || (item.pt2 && item.pt2.toString() === selected))) {
                        filteredItems.push(item);
                    }
                    else if(selected === 'Other Announcements' && !item.o && $.inArray(item.pt.toString(), names) === -1) {
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
app.filter('dateRange', function() {
    return function(items, startDate, endDate) {
        var filtered = [];
        startDate = (startDate && !isNaN(Date.parse(startDate))) ? startDate.getTime() : (new Date('1970-01-01')).getTime();
        endDate = (endDate && !isNaN(Date.parse(endDate))) ? endDate.getTime() : new Date(8640000000000000);
        angular.forEach(items, function(item) {
            var date = (new Date(item.d)).getTime();
            if (date >= startDate && date <= endDate) {
                filtered.push(item);
            }
        });
        return filtered;
    };
});
app.controller('searchController', ['$scope', '$sce', 'selectedFilter', 'selectedPressFilter', 'dateRangeFilter', 'requestFactory', '$filter', function($scope, $sce, selectedFilter, selectedPressFilter, dateFilter, requestFactory, $filter) {
    $scope.checked = JSON.parse(sessionStorage.getItem("presschecked")) || [];
    $scope.query = "";
    $scope.datepicker = {};
   
    $scope.changeValue = function(e) {
        $scope.query = $scope.checked.map(function(item) {
            return item.name;
        });
        $scope.datepicker.start = $scope.datepicker.startDate;
        $scope.datepicker.end = $scope.datepicker.endDate;
        sessionStorage.setItem("presschecked", JSON.stringify($scope.checked));
        sessionStorage.setItem("pressquery", JSON.stringify($scope.query));
        sessionStorage.setItem("pressstart", $scope.datepicker.startDate);
        sessionStorage.setItem("pressend", $scope.datepicker.endDate);
        $scope.changeFilter();
    };
    $scope.datepicker.openedStart = false;
    $scope.datepicker.openedEnd = false;
    $scope.dateOptions = {
        'formatYear': 'yyyy',
        'format-day-header': 'EEE',
        'format-month': 'MMM',
        'year-range': 15,
        'showWeeks': false
    };

    function setupCheckboxes(labels) { 
        if(!labels) {
            return;
        }
        $scope.checkboxes = labels;
        $scope.checkboxNames = $scope.checkboxes.map(function(label) {
            return label.name;
        });
    }

    function setupItems(items) {
        if(!items) {
            return;
        }
        $scope.itemsPerPage = 20;
        $scope.currentPage = 1;
        document.getElementById("lastUpdate").innerHTML = items.pop().updateDate;
        $scope.items = items.map(function(entry) {
            entry.lo = $sce.trustAsHtml(entry.lo);
            entry.s = $sce.trustAsHtml(entry.s);
            entry.videoTitle = "Watch Live";
            if (typeof entry.a !== 'undefined' && entry.a.length !== 0) {
                entry.a = $sce.trustAsHtml(entry.a);
            }
            if (typeof entry.pt !== 'undefined' && entry.pt.length !== 0) {
                entry.press_type = $sce.trustAsHtml(entry.pt);
            }
            if (typeof entry.pt2 !== 'undefined' && entry.pt2.length !== 0) {
                entry.press_type2 = $sce.trustAsHtml(entry.pt2);
            }
            if (typeof entry.video !== 'undefined' && entry.video.length !== 0 && entry.video === "Yes") {
                entry.v = entry.l;
                entry.videoTitle = "Video";
            }
            if (typeof entry.stub !== 'undefined' && entry.stub.length !== 0) {
                entry.l = entry.stub;
            }
            var temp = entry.l.split(".");
            temp = temp[temp.length - 2];

            var tempDate = new Date(entry.d);
            entry.sort = tempDate.getTime();
            if (isNaN(temp[temp.length - 1])) { entry.sort += parseInt(temp[temp.length - 1],36) - 9; }
            entry.d = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + tempDate.getFullYear();

            entry.title = $sce.trustAsHtml(entry.t);
            entry.o = entry.o === 'yes';
            return entry;
        });

        var orderBy = $filter('orderBy');
        $scope.items = orderBy($scope.items, '-sort');
        $scope.filtered = $scope.items;
        $scope.total = $scope.items.length;
        $scope.noOfPages = Math.ceil($scope.total / $scope.itemsPerPage);
        $scope.press = typeof $scope.items[0].s === 'undefined';
        var maxDate = Math.max.apply(Math, $scope.items.map(function(o) {
            return new Date(o.d);
        }));
  var minDate = Math.min.apply(Math, $scope.items.map(function(o) {
            return new Date(o.d);
        }));
        
        if (maxDate < new Date().getTime()) {
            maxDate = new Date();
        }
        
        $scope.query = JSON.parse(sessionStorage.getItem("pressquery")) || "";
        $scope.datepicker.maxDate = $scope.dateOptions.maxDate = new Date(maxDate);
        $scope.dateOptions.minDate = $scope.datepicker.minDate = new Date(minDate);

        if (sessionStorage.getItem("pressend")) {
            $scope.datepicker.endDate = $scope.datepicker.end = new Date(sessionStorage.getItem("pressend"));
        } else {
            $scope.datepicker.endDate = maxDate;
        }
         if (sessionStorage.getItem("pressstart")) {
        $scope.datepicker.startDate = $scope.datepicker.start = new Date(sessionStorage.getItem("pressstart"));
    } else {
        $scope.datepicker.startDate = $scope.datepicker.minDate;
    }

    }
    var title = $('h2').text().toLowerCase();
    if (title.indexOf('press') === -1 && title.indexOf('board') === -1) {
        $scope.label = "Speaker";
    } else {
        $scope.label = "Type";
    }
    requestFactory.getCheckboxItems(title).then(setupCheckboxes);
    requestFactory.getItems(title).then(setupItems);
    $scope.changeFilter = function() {
        $scope.filtered = $scope.press ? selectedPressFilter($scope.items, $scope.query, $scope.checkboxNames) : selectedFilter($scope.items, $scope.query, $scope.checkboxNames);
        $scope.filtered = dateFilter($scope.filtered, $scope.datepicker.start, $scope.datepicker.end);
        $scope.total = $scope.filtered.length;
        $scope.noOfPages = Math.ceil($scope.total / $scope.itemsPerPage);
        $scope.currentPage = 1;
    };
    $scope.open = function($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();
        if (opened === "openedStart") {
            $scope.datepicker.openedEnd = false;
            $scope.datepicker.openedStart = !$scope.datepicker.openedStart;
        } else if (opened === "openedEnd") {
            $scope.datepicker.openedStart = false;
            $scope.datepicker.openedEnd = !$scope.datepicker.openedEnd;
        }
    };
    $scope.$watchCollection('[datepicker.startDate, datepicker.endDate]', function() {
        $scope.changeFilter();
    });
}]);
