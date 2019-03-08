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
 * @name SeenAbstractCollectionCtrl
 * @description Generic controller of model collection of seen
 * 
 * This controller is used manages a collection of a virtual items. it is the
 * base of all other collection controllers such as accounts, groups, etc.
 * 
 * There are two types of function in the controller: view and data related. All
 * data functions are considered to be override by extensions.
 * 
 * There are three categories of actions;
 * 
 * - view
 * - model
 * - controller
 * 
 * view actions are about to update view. For example adding an item into the view
 * or remove deleted item.
 * 
 * Model actions deal with model in the repository. These are equivalent to the view
 * actions but removes items from the storage.
 * 
 * However, controller function provide an interactive action to the user to performs
 * an action.
 * 
 * ## Add
 * 
 * - addItem: controller
 * - addModel: model
 * - addViewItem: view
 */
.controller('AmWbSeenAbstractCollectionCtrl', function($scope, $q, $navigator, $window, $dispatcher, QueryParameter, Action) {
    'use strict';

    /*
     * util function
     */
    function differenceBy (source, filters, key) {
        var result = source;
        for(var i = 0; i < filters.length; i++){
            result = _.remove(result, function(item){
                return item[key] !== filters[i][key];
            });
        }
        return result;
    };

    var STATE_INIT = 'init';
    var STATE_BUSY = 'busy';
    var STATE_IDEAL = 'ideal';
    this.state = STATE_IDEAL;
    
    
    // Messages
    var ADD_ACTION_FAIL_MESSAGE = 'Fail to add new item';
    var DELETE_MODEL_MESSAGE = 'Delete item?';

    this.actions = [];


    /**
     * State of the controller
     * 
     * Controller may be in several state in the lifecycle. The state of the
     * controller will be stored in this variable.
     * 
     * <ul>
     * <li>init: the controller is not ready</li>
     * <li>busy: controller is busy to do something (e. loading list of data)</li>
     * <li>ideal: controller is ideal and wait for user </li>
     * </ul>
     * 
     * @type string
     * @memberof SeenAbstractCollectionCtrl
     */
    this.state = STATE_INIT;

    /**
     * Store last paginated response
     * 
     * This is a collection controller and suppose the result of query to be a
     * valid paginated collection. The last response from data layer will be
     * stored in this variable.
     * 
     * @type PaginatedCollection
     * @memberof SeenAbstractCollectionCtrl
     */
    this.lastResponse = null;

    /**
     * Query parameter
     * 
     * This is the query parameter which is used to query items from the data
     * layer.
     * 
     * @type QueryParameter
     * @memberof SeenAbstractCollectionCtrl
     */
    this.queryParameter = new QueryParameter();
    this.queryParameter.setOrder('id', 'd');

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
     * List of all loaded items
     * 
     * All loaded items will be stored into this variable for later usage. This
     * is related to view.
     * 
     * @type array
     * @memberof SeenAbstractCollectionCtrl
     */
    this.items = [];

    /**
     * Add item to view
     */
    this.pushViewItems = function(items) {
        if(!angular.isDefined(items)){
            return;
        }
        // Push new items
        var deff = differenceBy(this.items, items, 'id');
        this.items = _.union(items, deff);
    };

    /**
     * Add item to view
     */
    this.addViewItems = this.pushViewItems;

    /**
     * remove item from view
     */
    this.removeViewItems = function(items) {
        this.items = differenceBy(this.items, items, 'id');
    };

    this.updateViewItems = function(items) {
        // XXX: maso, 2019: update view items
    };

    this.getViewItems = function(){
        return this.items;
    };

    /**
     * Removes all items from view
     */
    this.clearViewItems = function(){
        this.items = [];
    };


    // -------------------------------------------------------------------------
    // Model
    //
    // We suppose that all model action be overid by the new controllers.
    //
    //
    //
    //
    // -------------------------------------------------------------------------
    /**
     * Deletes model
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @param item
     * @return promiss to delete item
     */
//  this.deleteModel = function(item){};

    /**
     * Gets object schema
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @return promise to get schema
     */
//  this.getModelSchema = function(){};

    /**
     * Query and get items
     * 
     * @param queryParameter to apply search
     * @return promiss to get items
     */
//  this.getModels = function(queryParameter){};

    /**
     * Get item with id
     * 
     * @param id of the item
     * @return promiss to get item
     */
//  this.getModel = function(id){};

    /**
     * Adds new item
     * 
     * This is default implementation of the data access function. Controllers
     * are supposed to override the function
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @return promiss to add and return an item
     */
//  this.addModel = function(model){};



    // -------------------------------------------------------------------------
    // Controller
    //
    //
    //
    //
    //
    //
    //
    // -------------------------------------------------------------------------

    /**
     * Creates new item with the createItemDialog
     * 
     * XXX: maso, 2019: handle state machine
     */
    this.addItem = function(){
        var ctrl = this;
        $navigator.openDialog({
            templateUrl: this._addDialog,
            config: {
                model:{}
            }
        })//
        .then(function(model){
            return ctrl.addModel(model);
        })//
        .then(function(item){
            $dispatcher.dispatch(ctrl.eventType, {
                key: 'created',// CRUD
                values: [item]
            });
        }, function(){
            $window.alert(ADD_ACTION_FAIL_MESSAGE);
        });
    };

    /**
     * Creates new item with the createItemDialog
     */
    this.deleteItem = function(item){
        // XXX: maso, 2019: update state
        var ctrl = this;
        var tempItem = _.clone(item);
        function _deleteInternal() {
            return ctrl.deleteModel(item)
            .then(function(){
                $dispatcher.dispatch(ctrl.eventType, {
                    key: 'removed', // CRUD
                    values: [tempItem]
                });
            }, function(){
                // XXX: maso, 2019: handle error
            });
        }
        // delete the item
        if(this.deleteConfirm){
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
     * Remove all old items and reload the controller state. If the controller
     * is in progress, then cancel the old promiss and start the new job.
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns promiss to reload
     */
    this.reload = function(){
        // safe reload
        var ctrl = this;
        function safeReload(){
            delete ctrl.lastResponse;
            ctrl.clearViewItems();
            ctrl.queryParameter.setPage(1);
            return ctrl.loadNextPage();
        }

        // check states
        if(this.isBusy()){
            return this.getLastQeury()
            .then(safeReload);
        }
        return safeReload();
    };



    /**
     * Loads next page
     * 
     * Load next page and add to the current items.
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns promiss to load next page
     */
    this.loadNextPage = function() {
        // Check functions
        if(!angular.isFunction(this.getModels)){
            throw 'The controller does not implement getModels function';
        }

        if (this.state === STATE_INIT) {
            throw 'this.init() function is not called in the controller';
        }

        // check state
        if (this.state !== STATE_IDEAL) {
            if(this.lastQuery){
                return this.lastQuery;
            }
            throw 'Models controller is not in ideal state';
        }

        // set next page
        if (this.lastResponse) {
            if(!this.lastResponse.hasMore()){
                return $q.resolve();
            }
            this.queryParameter.setPage(this.lastResponse.getNextPageIndex());
        }

        // Get new items
        this.state = STATE_BUSY;
        var ctrl = this;
        this.lastQuery = this.getModels(this.queryParameter)//
        .then(function(response) {
            ctrl.lastResponse = response;
            ctrl.addViewItems(response.items);
            // XXX: maso, 2019: handle error
            ctrl.error = null;
        }, function(error){
            ctrl.error = error;
        })//
        .finally(function(){
            ctrl.state = STATE_IDEAL;
            delete ctrl.lastQuery;
        });
        return this.lastQuery;
    };





    /**
     * Loads and init the controller
     * 
     * All childs must call this function at the end of the cycle
     */
    this.init = function(configs){
        var ctrl = this;
        this.state = STATE_IDEAL;
        if(!angular.isDefined(configs)){
            return;
        }

        // add actions
        if(angular.isArray(configs.actions)){
            this.addActions(configs.actions)
        }

        // enable create action
        if(configs.addAction && angular.isFunction(this.addItem)){
            var temp = configs.addAction;
            var createAction = {
                    title: temp.title || 'New item',
                    icon: temp.icocn || 'add',
                    action: temp.action,
            };
            if(!angular.isFunction(temp.action) && temp.dialog) {
                this._addDialog = temp.dialog;
                createAction.action = function(){
                    ctrl.addItem();
                };
            }
            if(angular.isFunction(createAction.action)) {
                this.addAction(createAction);
            }
        }

        // add path
        this._setEventType(configs.eventType);
        
        // confirm delete
        this.deleteConfirm = !angular.isDefined(configs.deleteConfirm) || configs.deleteConfirm;
        
        // init
        $scope.$on('$destroy', function(){
            ctrl.destroy();
        });
    };

    /**
     * Returns last executed query
     */
    this.getLastQeury = function(){
        return this.lastQuery;
    };

    /**
     * Load controller actions
     * 
     * @return list of actions
     */
    this.getActions = function(){
        return this.actions;
    };

    /**
     * Adds new action into the controller
     * 
     * @param action to add to list
     */
    this.addAction = function(action) {
        if(!angular.isDefined(this.actions)){
            this.actions = [];
        }
        // TODO: maso, 2018: assert the action is MbAction
        if(!(action instanceof Action)){
            action = new Action(action);
        }
        this.actions.push(action);
        return this;
    };

    /**
     * Adds list of actions to the controller
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @params array of actions
     */
    this.addActions = function(actions) {
        for(var i = 0; i < actions.length; i++){
            this.addAction(actions[i]);
        }
    };


    /**
     * Gets the query parameter
     * 
     * NOTE: if you change the query parameter then you are responsible to
     * call reload the controller too.
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns QueryParameter
     */
    this.getQueryParameter = function(){
        return this.queryParameter;
    };

    /**
     * Checks if the state is busy
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns true if the state is ideal
     */
    this.isBusy = function(){
        return this.state === STATE_BUSY;
    };

    /**
     * Checks if the state is ideal
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @returns true if the state is ideal
     */
    this.isIdeal = function(){
        return this.state === STATE_IDEAL;
    };

    /*
     * handle events
     */
    this.eventHandlerCallBack = function(){
        if(this._eventHandlerCallBack){
            return this._eventHandlerCallBack ;
        }
        var ctrl = this;
        this._eventHandlerCallBack = function($event){
            switch ($event.key) {
            case 'created':
                ctrl.pushViewItems($event.values);
                break;
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
        return this._eventHandlerCallBack ;
    };
    
    /*
     * Listen to dispatcher for new event
     */
    this._setEventType = function(eventType) {
        this.eventType = eventType;
        $dispatcher.on(this.eventType, this.eventHandlerCallBack());
    };
    

    /**
     * Remove all resources
     * 
     * @memberof SeenAbstractCollectionCtrl
     */
    this.destroy = function() {
        $dispatcher.off(this.eventType, this.eventHandlerCallBack());
    };
});
