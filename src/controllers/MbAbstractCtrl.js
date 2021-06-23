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

import $mbDispatcher from '../services/mbDispatcher';
import $mbDispatcherUtil from '../services/mbDispatcherUtil';

//--------------------------------------------------------
// --Events--
//--------------------------------------------------------
class EventHandlerId {
	constructor(type, id, callback) {
		this.type = type;
		this.id = id;
		this.callback = callback;
	}
}

/**
@ngdoc Controllers
@name MbAbstractCtrl
@description Generic controller which is used as base in the platform

@ngInject
 */
export default class MbAbstractCtrl {
	constructor($scope) {
		'ngInject';
		this._hids = [];

		/*
		 * Remove all resources
		 */
		$scope.$on('$destroy', () => this.destroy());
	}

	destroy() {
		this._hids.forEach((item) => $mbDispatcher.off(item.type, item.id));
		this._hids = [];
	}

	/**
	 * Add a callback for an specific type
	 * 
	 * @memberof MbAbstractCtrl
	 */
	addEventHandler(type, callback) {
		var callbackId = $mbDispatcher.on(type, callback);
		this._hids.push(new EventHandlerId(type, callbackId, callback));
	}


	/**
	 * Remove a callback for an specific type
	 * 
	 * @memberof MbAbstractCtrl
	 */
	removeEventHandler(/*type, callback*/) {
		// XXX: maso, 2019: remove handler
	}



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
	fireEvent(type, action, items) {
		return $mbDispatcherUtil.fireEvent(type, action, items);
	}

	/**
	 * Fires items read
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	fireRead(type, items) {
		return $mbDispatcherUtil.fireRead(type, items);
	}

	/**
	 * Fires items updated
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	fireUpdated(type, items) {
		return $mbDispatcherUtil.fireUpdated(type, items);
	}

	/**
	 * Fires items deleted
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	fireDeleted(type, items) {
		return $mbDispatcherUtil.fireDeleted(type, items);
	}

	/**
	 * Fires items created
	 * 
	 * @see MbAbstractCtrl#fireEvent
	 * @memberof MbAbstractCtrl
	 */
	fireCreated(type, items) {
		return $mbDispatcherUtil.fireCreated(type, items);
	}

}
