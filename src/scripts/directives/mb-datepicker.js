/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


angular.module('mblowfish-core')


/**
 * @ngdoc Directives
 * @name mb-datepicker
 * @descritpion Date picker
 * 
 * Select a date based on local.
 * 
 */
.directive('mbDatepicker', function($mdUtil, $rootScope) {

    // **********************************************************
    // Private Methods
    // **********************************************************
    function postLink(scope, element, attr, ctrls) {
        scope.app = $rootScope.app || {};
        var ngModelCtrl = ctrls[0] || $mdUtil.fakeNgModel();

        function render() {
            if(!ngModelCtrl.$modelValue){
                scope.date = null;
                return;
            }
            var date = moment //
            .utc(ngModelCtrl.$modelValue) //
            .local();
            if (date.isValid()) {
                scope.date = date;
                return;
            }
            // TODO: maso, 2018: handle invalid date
        }

        function setValue() {
            if(!scope.date) {
                ngModelCtrl.$setViewValue(null);
                return;
            }
            var date = moment(scope.date) //
            .utc() //
            .format('YYYY-MM-DD HH:mm:ss');
            ngModelCtrl.$setViewValue(date);
        }

        ngModelCtrl.$render = render;
        scope.$watch('date', setValue);
    }


    return {
        replace : false,
        template : function(){
        	var app = $rootScope.app || {};
            if(app.calendar === 'Gregorian'){
                return '<md-datepicker ng-model="date" md-hide-icons="calendar" md-placeholder="{{placeholder || \'Enter date\'}}"></md-datepicker>';
            }
            return '<md-persian-datepicker ng-model="date" md-hide-icons="calendar" md-placeholder="{{placeholder || \'Enter date\'}}"></md-persian-datepicker>';
        },
        restrict : 'E',
        scope : {
            minDate : '=mbMinDate',
            maxDate : '=mbMaxDate',
            placeholder: '@mbPlaceholder',
            hideIcons: '@?mbHideIcons'
            //		        currentView: '@mdCurrentView',
            //		        dateFilter: '=mdDateFilter',
            //		        isOpen: '=?mdIsOpen',
            //		        debounceInterval: '=mdDebounceInterval',
            //		        dateLocale: '=mdDateLocale'
        },
        require : [ 'ngModel' ],
        priority : 210, // Run before ngAria
        link : postLink
    };
});