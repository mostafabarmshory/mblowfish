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
 * @name MbSeenAbstractItemCtrl
 * @description Generic controller of item of seen
 * 
 * There are three categories of actions;
 * 
 * - view
 * - model
 * - controller
 * 
 */
.controller('MbSeenAbstractItemCtrl', function($scope, $controller, $q, $navigator, $window, QueryParameter, Action) {
	

	/*
	 * Extends collection controller from MbAbstractCtrl 
	 */
	angular.extend(this, $controller('MbSeenGeneralAbstractCollectionCtrl', {
		$scope : $scope
	}));


	// Messages
	var DELETE_MODEL_MESSAGE = 'Delete the item?';
	var Load_ACTION_FAIL_MESSAGE = 'Fail to load item';
	var IMPLEMENT_BY_CHILDREN_ERROR = 'This method must be override in clild class';

	/*
	 * Extra actions
	 */
	this.actions = [];

	/**
	 * Is true if the controller is busy
	 * 
	 * @type boolean
	 * @memberof SeenAbstractItemCtrl
	 */
	this.busy = false;

	/**
	 * Is true if the controller is dirty
	 * 
	 * The controller is dirty if and only if a property of the item is changed by 
	 * the view.
	 * 
	 * @type boolean
	 * @memberof SeenAbstractItemCtrl
	 */
	this.dirty = false;

	// -------------------------------------------------------------------------
	// Model
	//
	// We suppose that all model action be override by the new controllers.
	//
	//
	//
	//
	// -------------------------------------------------------------------------
	/**
	 * Deletes model
	 * 
	 * @param item
	 * @return promiss to delete item
	 * @memberof SeenAbstractItemCtrl
	 */
	this.deleteModel = function(item){
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};

	/**
	 * Gets item schema
	 * 
	 * @return promise to get schema
	 * @memberof SeenAbstractItemCtrl
	 */
	this.getModelSchema = function(){
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};

	/**
	 * Query and get items
	 * 
	 * @param queryParameter to apply search
	 * @return promiss to get items
	 * @memberof SeenAbstractItemCtrl
	 */
	this.getModel = function(id){
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};

	/**
	 * Update current model
	 * 
	 * @memberof SeenAbstractItemCtrl
	 * @return promiss to add and return an item
	 */
	this.updateModel = function(model){
		return $q.reject(IMPLEMENT_BY_CHILDREN_ERROR);
	};


	// -------------------------------------------------------------------------
	// View
	//
	//
	//
	//
	//
	//
	// -------------------------------------------------------------------------
	/**
	 * Current item 
	 * 
	 * @type Object
	 * @memberof SeenAbstractItemCtrl
	 */
	this.item;

	/**
	 * Sets item to view
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.setItem = function(item) {
		this.item = item;
	};

	/**
	 * Get view item
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.getItem = function(){
		return this.item;
	}

	/**
	 * get properties of the item
	 * 
	 * @return {boolean} true if the controller is busy
	 * @memberof SeenAbstractItemCtrl
	 */
	this.getItemProperty = function(key, defaultValue) {

	}

	/**
	 * Changes property of the model
	 * 
	 * @return {boolean} true if the controller is busy
	 * @memberof SeenAbstractItemCtrl
	 */
	this.setItemProperty = function(key, value) {

	}

	/**
	 * Checks if the state of the controller is busy
	 * 
	 * @return {boolean} true if the controller is busy
	 * @memberof SeenAbstractItemCtrl
	 */
	this.isBusy = function() {
		return this.busy;
	}

	/**
	 * Checks if the state of the controller is dirty
	 * 
	 * @return {boolean} true if the controller is dirty
	 * @memberof SeenAbstractItemCtrl
	 */
	this.dirty = function(){
		return this.dirty;
	}

	/**
	 * Check if confirmation is required for critical tasks
	 * 
	 * @return {boolean} true if the confirmation is required
	 * @memberof SeenAbstractItemCtrl
	 */
	this.isConfirmationRequired = function(){
		return this.confirmationRequired;
	}

	/**
	 * Set confirmation
	 * 
	 * @params confirmationRequired {boolean}
	 * @memberof SeenAbstractItemCtrl
	 */
	this.setConfirmationRequired = function(confirmationRequired){
		this.confirmationRequired = confirmationRequired;
	}


	/**
	 * Creates new item with the createItemDialog
	 */
	this.deleteItem = function(item, $event){
		// prevent default event
		if($event){
			$event.preventDefault();
			$event.stopPropagation();
		}

		// XXX: maso, 2019: update state
		var ctrl = this;
		var tempItem = _.clone(item);
		function _deleteInternal() {
			ctrl.busy = true;
			return ctrl.deleteModel(item)
			.then(function(){
				ctrl.fireDeleted(ctrl.eventType, tempItem);
			}, function(){
				// XXX: maso, 2019: handle error
			})
			.finally(function(){
				ctrl.busy = false;
			});
		}
		// delete the item
		if(this.isConfirmationRequired()){
			$window.confirm(DELETE_MODEL_MESSAGE)
			.then(function(){
				return _deleteInternal();
			});
		} else {
			return _deleteInternal();
		}
	};

	/**
	 * Reload the controller
	 * 
	 * 
	 * @memberof SeenAbstractItemCtrl
	 * @returns promise to reload
	 */
	this.reload = function(){
		// safe reload
		var ctrl = this;
		function safeReload(){
			ctrl.setItem(null);
			return ctrl.loadItem(this.getItemId());
		}

		// attache to old promise
		if(this.isBusy()){
			return this.getLastPromis()
			.then(safeReload);
		}
		
		// create new promise
		var promise = safeReload();
		this.setLastPromis(promise);
		return promise;
	};

	/**
	 * Set a GraphQl format of data
	 * 
	 * By setting this the controller is not sync and you have to reload the
	 * controller. It is better to set the data query at the start time.
	 * 
	 * @memberof SeenAbstractItemCtrl
	 * @param graphql
	 */
	this.setDataQuery = function(grqphql){
		this.queryParameter.put('graphql', '{page_number, current_page, items'+grqphql+'}');
		// TODO: maso, 2018: check if refresh is required
	};

	/**
	 * Generate default event handler
	 * 
	 * If you are about to handle event with a custom function, please
	 * override this function.
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.eventHandlerCallBack = function(){
		if(this._eventHandlerCallBack){
			return this._eventHandlerCallBack ;
		}
		var ctrl = this;
		this._eventHandlerCallBack = function($event){
			switch ($event.key) {
			case 'updated':
				ctrl.updateViewItems($event.values);
				break;
			case 'removed':
				ctrl.removeViewItems($event.values);
				break;
			default:
				break;
			}
		};
		return this._eventHandlerCallBack;
	};

	/**
	 * Sets controller event type
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.setEventType = function(eventType) {
		if(this.eventType === eventType){
			return;
		}
		var callback = this.eventHandlerCallBack();
		if(this.eventType){
			this.removeEventHandler(callback);
		}
		this.eventType = eventType;
		this.addEventHandler(this.eventType, callback);
	};
	
	
	this.seen_abstract_item_supperInit = this.init;
	/**
	 * Loads and init the controller
	 * 
	 * NOTE: All children must call this function at the end of the cycle
	 * 
	 * Properties:
	 * 
	 * - confirmation: show confirmation dialog
	 * - eventType: type of the events
	 * - dataQuery: a query to data
	 * - modelId:
	 * - model
	 * 
	 * @memberof SeenAbstractItemCtrl
	 */
	this.init = function(configs){
	    if(this.seen_abstract_item_supperInit){
		this.seen_abstract_item_supperInit(configs);
	    }
		var ctrl = this;
		if(!angular.isDefined(configs)){
			return;
		}

		// add path
		this.setEventType(configs.eventType);

		// confirm delete
		this.setConfirmationRequired(!angular.isDefined(configs.confirmation) || configs.confirmation);
		
		// data query
		if(config.dataQuery) {
			this.setDataQuery(config.dataQuery);
		}
		
		// model id
		if(config.modelId) {
			// TODO: load model
		}
		
		// Modl
		if(config.model){
			// TODO: load model
		}
	};

});
