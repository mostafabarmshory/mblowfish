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

/**
@ngdoc Services
@name $mbResource
@description Resource management system

This is a service to get resources. 

 */
angular.module('mblowfish-core').provider('$mbResource', function() {



	//--------------------------------------------------------
	// Services
	//--------------------------------------------------------
	var provider;
	var service;

	var rootScope;
	var mbDialog;



	//--------------------------------------------------------
	// variables
	//--------------------------------------------------------
	var CHILDREN_AUNCHOR = 'wb-select-resource-children';
	var resourcePages = {};




    /**
    Fetches a page.
    
    @param {string} pageId The id of the page
    @returns Related page.
     */
	function getPage(pageId) {
		return resourcePages[pageId];
	}

    /**
     * Adds new page.
     * 
     * @returns
     */
	function addPage(pageId, page) {
		page.id = pageId;
		resourcePages[pageId] = page;
	}

    /**
     * Finds and lists all pages.
     * 
     * @returns
     */
	function getPages(tag) {
		var pages = [];
		_.forEach(resourcePages, function(page) {
			if (angular.isArray(page.tags) && page.tags.includes(tag)) {
				this.push(page);
			}
		}, pages);
		return pages;
	}

    /**
     * Get a resource 
     * 
     * - option.data: current value of the date
     * - option.style: style of the dialog (title, descritpion, image, ..)
     * 
     * @param tags
     * @returns
     */
	function get(tag, option) {
		if (!option) {
			option = {};
		}
		var pages = getPages(tag);
		var tmplUrl = pages.length > 1 ? 'views/dialogs/wb-select-resource.html' : 'views/dialogs/wb-select-resource-single-page.html';
		return $mdDialog.show({
			controller: ResourceCtrl,
			templateUrl: tmplUrl,
			parent: angular.element(document.body),
			clickOutsideToClose: false,
			fullscreen: true,
			multiple: true,
			locals: {
				'pages': pages,
				'style': option.style || {
					title: tag
				},
				'data': option.data || {}
			}
		});
	}

	function hasPageFor(tag) {
		var pages = getPages(tag);
		return pages.length > 0;
	}


	//--------------------------------------------------------
	// End
	//--------------------------------------------------------
	service = {
		get: get,
		hasPageFor: hasPageFor,
		getPage: getPage,
		getPages: getPages,
	};
	provider = {
		$get: function() {

			return service;
		},
		addPage: addPage
	};
	return provider;
});





//    /*
//     * Manages resource dialog
//     * @ngInject
//     */
//	function ResourceCtrl($scope, $mdDialog, $wbUtil,
//		$q, $controller, $compile, pages, style, data, $element, $window) {
//
//		$scope.value = angular.copy(data);
//		$scope.style = style;
//		var currentScope = null;
//
//		function hide() {
//			$mdDialog.hide();
//		}
//
//		function cancel() {
//			return $mdDialog.cancel();
//		}
//
//        /**
//         * Answer the dialog
//         * 
//         * If there is an answer function in the current page controller
//         * then the result of the answer function will be returned as 
//         * the main result.
//         * 
//         * @memberof WbResourceCtrl
//         */
//		function answer() {
//			$scope.loadingAnswer = true;
//			var res = null;
//			if (currentScope && angular.isFunction(currentScope.answer)) {
//				res = $q.when(currentScope.answer())
//					.then($mdDialog.hide);
//			} else {
//				res = $mdDialog.hide($scope.value);
//			}
//			return res.finally(function() {
//				$scope.loadingAnswer = false;
//			});
//		}
//
//        /*
//         * Sets value to the real var
//         */
//		this.setValue = function(value) {
//			$scope.value = value;
//		};
//
//        /*
//         * Gets current value
//         */
//		this.getValue = function() {
//			return $scope.value;
//		};
//
//        /**
//         * encapsulate template srce with panel widget template.
//         * 
//         * @param page
//         *            setting page config
//         * @param tempateSrc
//         *            setting page html template
//         * @returns encapsulate html template
//         */
//		function _encapsulatePanel(page, template) {
//			// TODO: maso, 2017: pass all paramter to the setting
//			// panel.
//			return template;
//		}
//
//        /**
//         * تنظیمات را به عنوان تنظیم‌های جاری سیستم لود می‌کند.
//         * 
//         * @returns
//         */
//		function loadPage(page) {
//			var jobs = [];
//			var pages2 = [];
//
//			$scope._selectedIndex = pages.indexOf(page);
//
//			// 1- Find element
//			var target = $element.find('#' + CHILDREN_AUNCHOR);
//
//			// 2- Clear childrens
//			target.empty();
//			currentScope = null;
//
//
//			// 3- load pages
//			//          var page = pages[index];
//			var template = $wbUtil.getTemplateFor(page);
//			if (angular.isDefined(template)) {
//				jobs.push($q.when(template).then(function(templateSrc) {
//					templateSrc = _encapsulatePanel(page, templateSrc);
//					var element = angular.element(templateSrc);
//					var scope = $rootScope.$new(false, $scope);
//					currentScope = scope;
//					scope.page = page;
//					scope.value = $scope.value;
//					if (angular.isDefined(page.controller)) {
//						var controller = $controller(page.controller, {
//							$scope: scope,
//							$element: element,
//							style: style,
//							data: data
//						});
//						if (page.controllerAs) {
//							scope[page.controllerAs] = controller;
//						}
//					}
//					$compile(element)(scope);
//					pages2.push(element);
//				}));
//			}
//
//			$q.all(jobs).then(function() {
//				angular.forEach(pages2, function(element) {
//					target.append(element);
//				});
//			});
//		}
//
//		if (angular.isFunction($window.openHelp)) {
//			$scope.openHelp = function($event) {
//				cancel().then(function() {
//					$window.openHelp(pages[$scope._selectedIndex], $event);
//				});
//			};
//		}
//
//		$scope.pages = pages;
//
//		$scope.loadPage = loadPage;
//
//		$scope.hide = hide;
//		$scope.cancel = cancel;
//		$scope.answer = answer;
//
//		if (pages.length) {
//			loadPage(pages[0]);
//		}
//
//		var ctrl = this;
//		$scope.setValue = function(value) {
//			return ctrl.setValue(value);
//		};
//	}
