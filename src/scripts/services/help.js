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
 * @ngdoc services
 * @name $help
 * @description A help management service
 * 
 * Manage application help.
 * 
 */
.service('$help', function($q, $navigator, $rootScope) {

	var _tips = [];
	var _currentItem = null;
	
	/**
	 * Adds new tip
	 * 
	 * New tip is added into the tips list.
	 * 
	 * @memberof $help
	 * @param {object} tipData - Data of a tipe
	 * @return {$help} for chaine mode
	 */
	function tip(tipData){
		_tips.push(tipData);
		return this;
	}
	
	/**
	 * List of tips
	 * 
	 * @memberof $help
	 * @return {promise<Array>} of tips
	 */
	function tips(){
		return $q.resolve({
			items: _tips
		});
	}
	
	/**
	 * Gets current item in help system
	 * 
	 * @memberof $help
	 * @return {Object} current item
	 */
	function currentItem() {
	    return _currentItem;
	}
	
	/**
	 * Sets current item in help system
	 * 
	 * @memberof $help
	 * @params item {Object} target of the help system
	 */
	function setCurrentItem(item) {
	    _currentItem = item;
	}
	
	/**
	 * Display help for an item
	 * 
	 * This function change current item automatically and display help for it.
	 * 
	 * @memberof $help
	 * @params item {Object} an item to show help for
	 */
	function openHelp(item){
	    setCurrentItem(item);
	    $rootScope.showHelp = true;
	}
	
	/*
	 * Service struct
	 */
	return {
		tip: tip,
		tips: tips,
		
		currentItem: currentItem,
		setCurrentItem: setCurrentItem,
		openHelp: openHelp
	};
});
