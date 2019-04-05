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


/*
 * Add to angular
 */
angular.module('mblowfish-core')//

/**
 * @ngdoc Controllers
 * @name MbAbstractCtrl
 * @description Generic controller which is used as base in the platform
 * 
 */
.controller('MbAbstractCtrl', function($scope, $dispatcher, MbEvent) {
	'use strict';

	this._hids = [];


	//--------------------------------------------------------
	// --Events--
	//--------------------------------------------------------
	var EventHandlerId = function(type, id, callback){
		this.type = type;
		this.id = id;
		this.callback = callback;
	};

	/**
	 * Add a callback for an specific type
	 * 
	 * @memberof MbAbstractCtrl
	 */
	this.addEventHandler = function(type, callback){
		var callbackId = $dispatcher.on(type, callback);
		this._hids.push(new EventHandlerId(type, callbackId, callback));
	};
	
	/**
	 * Remove a callback for an specific type
	 * 
	 * @memberof MbAbstractCtrl
	 */
	this.removeEventHandler = function(type, callback){
		// XXX: maso, 2019: remove handler
	};

	/**
	 * Fire an action is performed on items
	 * 
	 * Here is common list of action to dils with objects:
	 * 
	 * - created
	 * - read
	 * - updated
	 * - deleted
	 * 
	 * to fire an item is created:
	 * 
	 * this.fireEvent(type, 'created', item);
	 * 
	 * to fire items created:
	 * 
	 * this.fireEvent(type, 'created', item_1, item_2, .. , item_n);
	 * 
	 * to fire list of items created
	 * 
	 * var items = [];
	 * ...
	 * this.fireEvent(type, 'created', items);
	 * 
	 * @memberof MbAbstractCtrl
	 */
	this.fireEvent = function(type, action, items) {
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 2);
		var source = this;
		return $dispatcher.dispatch(type, new MbEvent({
			source: source,
			type: type,
			key: action,
			values: values
		}));
	};

	/**
	 * Fires items created
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireCreated = function(type, items){
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 1);
		return this.fireEvent(type, 'created', values);
	};

	/**
	 * Fires items read
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireRead = function(type, items){
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 1);
		return this.fireEvent(type, 'read', values);
	};

	/**
	 * Fires items updated
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireUpdated = function(type, items){
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 1);
		return this.fireEvent(type, 'updated', values);
	};

	/**
	 * Fires items deleted
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireDeleted = function(type, items){
		var values = angular.isArray(items) ? items : Array.prototype.slice.call(arguments, 1);
		return this.fireEvent(type, 'deleted', values);
	};


	//--------------------------------------------------------
	// --View--
	//--------------------------------------------------------
	/*
	 * Remove all resources
	 */
	var ctrl = this;
	$scope.$on('$destroy', function() {
		for(var i = 0; i < ctrl._hids.length; i++){
			var handlerId = ctrl._hids[i];
			$dispatcher.off(handlerId.type, handlerId.id);
		}
		ctrl._hids = [];
	});

});
