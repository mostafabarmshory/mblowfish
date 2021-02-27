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

import templateUrlMulti from './mbResource-multi.html';
import templateUrlSingle from  './mbResource-single.html';

export const RESOURCE_CHILDREN_AUNCHOR = 'wb-select-resource-children';

/**
@ngdoc Services
@name $mbResource
@description Resource management system

This is a service to get resources. 

 */
function mbResource() {



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
		var tmplUrl = pages.length > 1 ? templateUrlMulti : templateUrlSingle;
		return mbDialog.show({
			controller: 'MbResourceDialogCtrl',
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
}


export default mbResource;

