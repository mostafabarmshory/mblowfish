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


angular.module('mblowfish-core')

/**
 * @ngdoc Directives
 * @name mb-panel-sidenav-anchor
 * @description Display a sidenave anchor
 * 
 */
.directive('mbPanelSidenavAnchor', function ($mbRoute, $sidenav, $rootScope, $mdSidenav, $q,
        $wbUtil, $controller, $compile) {

    /*
     * Bank of sidnav elements.
     */
    var elementBank = angular.element('<div></div>');

    /*
     * Load page and create an element
     */
    function _loadPage($scope, page, prefix, postfix) {
        // 1- create scope
        var childScope = $scope.$new(false, $scope);
        childScope = Object.assign(childScope, {
            app : $rootScope.app,
            _page : page,
            _visible : function () {
                if (angular.isFunction(this._page.visible)) {
                    var v = this._page.visible(this);
                    if (v) {
                        $mdSidenav(this._page.id).open();
                    } else {
                        $mdSidenav(this._page.id).close();
                    }
                    return v;
                }
                return true;
            }
        });

        // 2- create element
        return $wbUtil
        .getTemplateFor(page)
        .then(
                function (template) {
                    var element = angular
                    .element(prefix + template + postfix);
                    elementBank.append(element);

                    // 3- bind controller
                    var link = $compile(element);
                    if (angular.isDefined(page.controller)) {
                        var locals = {
                                $scope : childScope,
                                $element : element
                        };
                        var controller = $controller(
                                page.controller, locals);
                        if (page.controllerAs) {
                            childScope[page.controllerAs] = controller;
                        }
                        element
                        .data(
                                '$ngControllerController',
                                controller);
                    }
                    return {
                        element : link(childScope),
                        page : page
                    };
                });
    }

    function postLink($scope, $element) {
        var _sidenaves = [];

        /*
         * Remove all sidenaves
         */
        function _removeElements(pages, elements) {
            var cache = [];
            for (var i = 0; i < elements.length; i++) {
                var flag = false;
                for (var j = 0; j < pages.length; j++) {
                    if (pages[j].id === elements[i].page.id) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    elements[i].element.detach();
                    elements[i].cached = true;
                    cache.push(elements[i]);
                } else {
                    elements[i].element.remove();
                }
            }
            return cache;
        }

        function _getSidenavElement(page) {
            for (var i = 0; i < _sidenaves.length; i++) {
                if (_sidenaves[i].page.id === page.id) {
                    return $q.when(_sidenaves[i]);
                }
            }
            return _loadPage(
                    $scope,
                    page,
                    '<md-sidenav md-theme="{{app.setting.theme || app.config.theme || \'default\'}}" md-theme-watch md-component-id="{{_page.id}}" md-is-locked-open="_visible() && (_page.locked && $mdMedia(\'gt-sm\'))" md-whiteframe="2" ng-class="{\'md-sidenav-right\': app.dir==\'rtl\',  \'md-sidenav-left\': app.dir!=\'rtl\', \'mb-sidenav-ontop\': !_page.locked}" class=" wb-layer-sidenav-top">',
            '</md-sidenav>').then(
                    function (pageElement) {
                        _sidenaves.push(pageElement);
                    });
        }

        /*
         * reload sidenav
         */
        function _reloadSidenavs(sidenavs) {
            _sidenaves = _removeElements(sidenavs, _sidenaves);
            var jobs = [];
            for (var i = 0; i < sidenavs.length; i++) {
                jobs.push(_getSidenavElement(sidenavs[i]));
            }
            $q
            .all(jobs)
            //
            .then(
                    function () {
                        // Get Anchor
                        var _anchor = $element;
                        // maso, 2018: sort
                        _sidenaves
                        .sort(function (a, b) {
                            return (a.page.priority || 10) > (b.page.priority || 10);
                        });
                        for (var i = 0; i < _sidenaves.length; i++) {
                            var ep = _sidenaves[i];
                            if (ep.chached) {
                                continue;
                            }
                            if (ep.page.position === 'start') {
                                _anchor
                                .prepend(ep.element);
                            } else {
                                _anchor
                                .append(ep.element);
                            }
                        }
                    });
        }

        /*
         * Reload UI
         * 
         * Get list of sidenavs for the current state and load
         * them.
         */
        function _reloadUi() {
            if (!angular.isDefined($mbRoute.current)) {
                return;
            }
            // Sidenavs
            var sdid = $mbRoute.current.sidenavs || $sidenav.defaultSidenavs();
            sdid = sdid.slice(0);
            sdid.push('settings');
            sdid.push('help');
            sdid.push('messages');
            var sidenavs = [];
            var jobs = [];
            angular.forEach(sdid, function (item) {
                jobs.push($sidenav.sidenav(item).then(
                        function (sidenav) {
                            sidenavs.push(sidenav);
                        }));
            });
            $q.all(jobs).then(function () {
                _reloadSidenavs(sidenavs);
            });
        }

        $scope.$watch(function () {
            return $mbRoute.current;
        }, _reloadUi);
    }

    return {
        restrict : 'A',
        priority : 601,
        link : postLink
    };
});