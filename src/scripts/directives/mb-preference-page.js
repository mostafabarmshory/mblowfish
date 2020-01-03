/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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


angular
.module('mblowfish-core')
/**
 * @ngdoc Directives
 * @name mb-preference-page
 * @description Preference page
 * 
 * Preference page
 * 
 */
.directive('mbPreferencePage', function ($compile, $controller, $preferences, $wbUtil,
        $rootScope, $mdTheming) {

    var bodyElementSelector = 'div#mb-preference-body';
    var placeholderElementSelector = 'div#mb-preference-placeholder';
    /**
     * 
     */
    function loadPreference($scope, page, anchor) {
        // 1- create scope
        var childScope = $scope.$new(false, $scope);
        // legacy
        childScope.app = $rootScope.__app;
        // New
        childScope.__app = $rootScope.__app;
        childScope.__tenant = $rootScope.__tenant;
        childScope.__account = $rootScope.__account;
        // childScope.wbModel = model;

        // 2- create element
        $wbUtil.getTemplateFor(page)
        .then(function (template) {
            var element = angular.element(template);

            // 3- bind controller
            var link = $compile(element);
            if (angular.isDefined(page.controller)) {
                var locals = {
                        $scope: childScope,
                        $element: element
                        // TODO: maso, 2018:
                };
                var controller = $controller(
                        page.controller, locals);
                if (page.controllerAs) {
                    childScope[page.controllerAs] = controller;
                }
                element.data('$ngControllerController', controller);
            }

            // Load preferences
            anchor.empty();
            anchor.append(link(childScope));
            
            $mdTheming(element);
        });
    }

    /**
     * Adding preloader.
     * 
     * @param scope
     * @param element
     * @param attr
     * @returns
     */
    function postLink(scope, element) {
        // Get Anchor
        var _anchor = element; //
//      .children(bodyElementSelector) //
//      .children(placeholderElementSelector);
        // TODO: maso, 2018: check auncher exist
        scope.$watch('mbPreferenceId', function (id) {
            if (id) {
                $preferences.page(id)
                .then(function (page) {
                    loadPreference(scope, page, _anchor);
                }, function () {
                    // TODO: maso, 2017: handle errors
                });
            }
        });
    }

    return {
        restrict: 'E',
        templateUrl: 'views/directives/mb-preference-page.html',
        replace: true,
        scope: {
            mbPreferenceId: '='
        },
        link: postLink
    };
});