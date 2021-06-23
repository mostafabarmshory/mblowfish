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

/**
@ngdoc Services
@name $mbPreferences
@description System setting manager

 */
function mbPreferences() {

	//-------------------------------------------------
	// Services
	//-------------------------------------------------
	var provider;
	var service;

	var location;


	//-------------------------------------------------
	// Variables
	//-------------------------------------------------
	var preferences = {};

	//-------------------------------------------------
	// Functions
	//-------------------------------------------------

	/**
	 * Lists all created pages.
	 * 
	 * @returns
	 */
	function getPages() {
		return preferences;
	}

	/**
	 * Gets a preference page
	 * 
	 * @memberof $mbPreferences
	 * @param id {string} Pereference page id
	 */
	function getPage(id) {
		return preferences[id];
	}


	/**
	 * Opens a setting page
	 * 
	 * @param page
	 * @returns
	 */
	function open(page) {
		return location.url('preferences/' + page.id);
	}

	/**
	 * Creates a new setting page.
	 * 
	 * @param page
	 * @returns
	 */
	function addPage(pageId, page) {
		page.id = pageId;
		preferences[pageId] = page;
		return service;
	}


	function init() {

	}

	//-------------------------------------------------
	// End
	//-------------------------------------------------
	service = {
		getPages: getPages,
		getPage: getPage,
		addPage: addPage,
		open: open
	};
	provider = {
		$get: function($location) {
			"ngInject";
			location = $location;

			init();
			return service;
		},
		addPage: function(pageId, page) {
			page.id = pageId;
			preferences[pageId] = page;
			return provider;
		}
	};
	return provider;
}

export default mbPreferences;


