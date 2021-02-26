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
@ngdoc Controllers
@name MbAbstractCtrl
@description Generic controller which is used as base in the platform

@ngInject
 */
export default function($scope, $mbDispatcher, MbEvent, $mbDispatcherUtil) {

	//--------------------------------------------------------
	// --Events--
	//--------------------------------------------------------
	var EventHandlerId = function(type, id, callback) {
		this.type = type;
		this.id = id;
		this.callback = callback;
	};

	/**
	 * Add a callback for an specific type
	 * 
	 * @memberof MbAbstractCtrl
	 */
	this.addEventHandler = function(type, callback) {
		var callbackId = $mbDispatcher.on(type, callback);
		this._hids.push(new EventHandlerId(type, callbackId, callback));
	};

	/**
	 * Remove a callback for an specific type
	 * 
	 * @memberof MbAbstractCtrl
	 */
	this.removeEventHandler = function(type, callback) {
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
	this.fireEvent = $mbDispatcherUtil.fireEvent;


	/**
	 * Fires items read
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireRead = $mbDispatcherUtil.fireRead;

	/**
	 * Fires items updated
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireUpdated = $mbDispatcherUtil.fireUpdated;

	/**
	 * Fires items deleted
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireDeleted = $mbDispatcherUtil.fireDeleted;

	/**
	 * Fires items created
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	this.fireCreated = $mbDispatcherUtil.fireCreated;


	this.destroy = function() {
		for (var i = 0; i < ctrl._hids.length; i++) {
			var handlerId = ctrl._hids[i];
			$mbDispatcher.off(handlerId.type, handlerId.id);
		}
		ctrl._hids = [];
	};

	//--------------------------------------------------------
	// --View--
	//--------------------------------------------------------
	/*
	 * Remove all resources
	 */
	var ctrl = this;
	ctrl._hids = [];
	$scope.$on('$destroy', function() {
		ctrl.destroy();
	});
}
