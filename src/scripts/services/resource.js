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

var RESOURCE_CHILDREN_AUNCHOR = 'wb-select-resource-children';

/**
@ngdoc Services
@name $mbResource
@description Resource management system

This is a service to get resources. 

 */
mblowfish.provider('$mbResource', function() {



	//--------------------------------------------------------
	// Services
	//--------------------------------------------------------
	var provider;
	var service;

	var mbDialog,
		rootElement;



	//--------------------------------------------------------
	// variables
	//--------------------------------------------------------
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
		return provider;
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
				pages.push(page);
			}
		});
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
		var tmplUrl = pages.length > 1 ? 'scripts/services/resource-multi.html' : 'scripts/services/resource-single.html';
		return mbDialog.show({
			controller: 'ResourceDialogCtrl',
			controllerAs: 'ctrl',
			templateUrl: tmplUrl,
			parent: rootElement,
			targetEvent: option.targetEvent,
			clickOutsideToClose: false,
			fullscreen: true,
			multiple: true,
			locals: {
				$pages: pages,
				$style: option.$style || {
					title: tag
				},
				$value: option.$value || {},
				$options: option,
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
		/* @ngInject */
		$get: function($mbDialog, $rootElement) {
			mbDialog = $mbDialog;
			rootElement = $rootElement;
			return service;
		},
		addPage: addPage
	};
	return provider;
});





/**
@name ResourceDialogCtrl
@description
Manages resource dialog and allows internal containers to work.

Resources are free to set a process to performe before closing the dialog. It is common in
resources required process.

@example
	mblowfish.addResource('test',{
		tags:['image'],
		controller: function($resource){
			$resource.process = function(){
				return $http.get('resource/from/web')
					.then(function(value){
						$resources.setValue(value);
					});
			}
		}
	});

@ngInject
 */
mblowfish.controller('ResourceDialogCtrl', function(
	$scope, $value, $element, $pages, $style, $options,
	$mdDialog, MbContainer) {

	var isFunction = _.isFunction;
	//-------------------------------------------------------------
	// Variables
	//-------------------------------------------------------------

	var value = angular.copy($value);
	var ctrl = this;
	var currentContainer;
	var currentPage;


	//-------------------------------------------------------------
	// functions
	//-------------------------------------------------------------
	function cancel() {
		return $mdDialog.cancel();
	}

	/**
	Answer the dialog
	
	If there is an answer function in the current page controller
	then the result of the answer function will be returned as 
	the main result.
	
	@memberof WbResourceCtrl
	 */
	function answer() {
		if (isFunction(ctrl.process)) {
			return ctrl.isBusy = ctrl.process()
				.then(function() {
					return $mdDialog.hide(value);
				})
				.finally(function() {
					delete ctrl.isBusy;
				});
		}
		return $mdDialog.hide(value);
	}

	function getValue() {
		return value;
	}

	function setValue(newValue) {
		value = newValue;
		return this;
	}

	/**
	 * تنظیمات را به عنوان تنظیم‌های جاری سیستم لود می‌کند.
	 * 
	 * @returns
	 */
	function loadPage(page) {
		// 1- Find element
		var target = $element.find('#' + RESOURCE_CHILDREN_AUNCHOR);

		// 2- Clear childrens
		if (currentContainer) {
			currentContainer.destroy();
			target.empty();
		}
		delete ctrl.process;

		currentPage = page;
		currentContainer = new MbContainer(page);
		return currentContainer.render(_.assign({}, $options, {
			$element: target,
			$scope: $scope.$new(false),
			$style: $style,
			$options: $options,
			$value: value,
			$resource: ctrl,
			$keepRootElement: true, // Do not remove element
		}));
	}

	function isPageVisible(page) {
		return page === currentPage;
	}

	//-------------------------------------------------------------
	// end
	//-------------------------------------------------------------
	_.assign(ctrl, {
		style: $style,
		pages: $pages,

		getValue: getValue,
		setValue: setValue,
		answer: answer,
		cancel: cancel,

		loadPage: loadPage,
		isPageVisible: isPageVisible,
	});

	if ($pages.length) {
		loadPage($pages[0]);
	}
});
