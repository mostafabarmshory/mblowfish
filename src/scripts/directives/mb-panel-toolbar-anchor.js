/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
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
'use strict';


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-panel-toolbar-anchor
 * @description display a toolbar
 * 
 */
.directive('mbPanelToolbarAnchor', function($route, $toolbar, $rootScope, $q, $wbUtil, $controller, $compile) {

    /*
     * Load page and create an element
     */
    function _loadPage($scope, page, prefix, postfix) {
        // 1- create scope
        var childScope = $scope.$new(false, $scope);
        childScope = Object.assign(childScope, {
            app : $rootScope.app,
            _page : page,
            _visible : function() {
                if (angular.isFunction(this._page.visible)) {
                    var v = this._page.visible(this);
                    return v;
                }
                return true;
            }
        });

        // 2- create element
        return $wbUtil.getTemplateFor(page)
        .then(function(template) {
            var element = angular.element(prefix + template + postfix);

            // 3- bind controller
            var link = $compile(element);
            if (angular.isDefined(page.controller)) {
                var locals = {
                        $scope : childScope,
                        $element : element
                };
                var controller = $controller(page.controller, locals);
                if (page.controllerAs) {
                    childScope[page.controllerAs] = controller;
                }
                element.data('$ngControllerController', controller);
            }
            return {
                element : link(childScope),
                page : page
            };
        });
    }

    function postLink($scope, $element) {
        var _toolbars = [];

        /*
         * Remove all sidenaves
         */
        function _removeElements(pages, elements) {
            var cache = [];
            for(var i = 0; i < elements.length; i++){
                var flag = false;
                for(var j = 0; j < pages.length; j++){
                    if(pages[j].id === elements[i].page.id) {
                        flag = true;
                        break;
                    }
                }
                if(flag){
                    elements[i].element.detach();
                    elements[i].cached = true;
                    cache.push(elements[i]);
                } else {
                    elements[i].element.remove();
                }
            }
            return cache;
        }


        function _getToolbarElement(page){
            for(var i = 0; i < _toolbars.length; i++){
                if(_toolbars[i].page.id === page.id){
                    return $q.when(_toolbars[i]);
                }
            }

            var prefix = page.raw ? '' : '<md-toolbar ng-show="_visible()" md-theme="{{app.setting.theme || app.config.theme || \'default\'}}" md-theme-watch layout="column" layout-gt-xs="row" layout-align="space-between stretch">';
            var postfix = page.raw ? '' : '</md-toolbar>';
            return _loadPage($scope, page, prefix, postfix)
            .then(function(pageElement) {
                _toolbars.push(pageElement);
            });
        }

        /*
         * Reload toolbars
         */
        function _reloadToolbars(toolbars) {
            _toolbars = _removeElements(toolbars, _toolbars);
            var jobs = [];
            for (var i = 0; i < toolbars.length; i++) {
                jobs.push(_getToolbarElement(toolbars[i]));
            }
            $q.all(jobs) //
            .then(function() {
                // Get Anchor
                var _anchor = $element;
                // maso, 2018: sort
                _toolbars.sort(function(a, b){
                    return (a.page.priority || 10) > (b.page.priority || 10);
                });
                for (var i = 0; i < _toolbars.length; i++) {
                    var ep = _toolbars[i];
                    if(ep.chached){
                        continue;
                    }
                    _anchor.prepend(ep.element);
                }
            });
        }

        /*
         * Reload UI
         * 
         * - sidenav
         * - toolbar
         */
        function _reloadUi(){
            if(!$route.current){
                return;
            }
            // Toolbars
            var tids = $route.current.toolbars || $toolbar.defaultToolbars();
            if(angular.isArray(tids)){
                var ts = [];
                var jobs = [];
                angular.forEach(tids, function(item){
                    jobs.push($toolbar.toolbar(item)
                            .then(function(toolbar){
                                ts.push(toolbar);
                            }));
                });
                $q.all(jobs)
                .then(function(){
                    _reloadToolbars(ts);
                });
            }
        }

//        function _isVisible(item){
//            if (angular.isFunction(item.visible)) {
//                var v = item.visible(this);
//                return v;
//            }
//            if(angular.isDefined(item.visible)){
//                // item.visible is defined but is not a function
//                return item.visible;
//            }
//            return true;
//        }

        $scope.$watch(function(){
            return $route.current;
        },_reloadUi);
//      _reloadUi();
    }


    return {
        restrict : 'A',
//      replace : true,
//      templateUrl : 'views/directives/mb-panel.html',
        link : postLink
    };
});