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
 * ## Add new item
 * 
 * To create and add new mode item, add a function and return created model
 * as promisse or an object.
 * 
 * For example;
 * 
 * <code><pre>
 *  this.createModel = function(){};
 * </pre></code>
 * 
 * ## Delete item
 * 
 * To delete and remove item from view, sub class must override the following function:
 * 
 * <code><pre>
 *  this.deleteModel = function(item){ ... }
 * </pre></code>
 * 
 * @ngInject
 */
function SeenAbstractCollectionCtrl($q, QueryParameter, Action) {
    var STATE_INIT = 'init';
    var STATE_BUSY = 'busy';
    var STATE_IDEAL = 'ideal';
    this.state = STATE_IDEAL;


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
        // relaod data
        delete this.lastResponse;
        this.items = [];
        this.queryParameter.setPage(1);
        return this.loadNextPage();
    };

    /**
     * Loads and init the controller
     * 
     * All childs must call this function at the end of the cycle
     */
    this.init = function(){
        var ctrl = this;
        this.state=STATE_IDEAL;
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
        if(!angular.isFunction(this.getItems)){
            throw 'The controller does not implement getItems function';
        }

        if (this.state === STATE_INIT) {
            throw 'this.init() function is not called in the controller';
        }

        // check state
        if (this.state !== STATE_IDEAL) {
            if(this.lastQuery){
                return this.lastQuery;
            }
            throw 'Items controller is not in ideal state';
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
        this.lastQuery = this.getItems(this.queryParameter)//
        .then(function(response) {
            ctrl.lastResponse = response;
            ctrl.items = ctrl.items.concat(response.items);
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
     * Set a GraphQl format of data
     * 
     * By setting this the controller is not sync and you have to reload the
     * controller. It is better to set the data query at the start time.
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @param graphql
     */
    this.setDataQuery = function(grqphql){
        this.queryParameter.put('graphql', '{page_number, current_page, items'+grqphql+'}');
        // TODO: maso, 2018: check if refresh is required
    };

    /**
     * Get properties to sort
     * 
     * @return array of getProperties to use in search, sort and filter
     */
    this.getProperties = function(){
        if(!angular.isFunction(this.getSchema)){
            return [];
        }
        if(angular.isDefined(this._schema)){
            // TODO: maso, 2018: 
            return this._schema;
        }
        var ctrl = this;
        $q.when(this.getSchema())
        .then(function(schema){
            ctrl._schema = schema;
        });
        // view must check later
        return [];
    };

    /**
     * Load controller actions
     * 
     * @return list of actions
     */
    this.getActions = function(){
        var actions = this._actions;
        // TODO: maso, 2018: add flag to cache 
        // add item action
        var ctrl = this;
        if(angular.isFunction(this.createModel)){
            // maso, 2018: crate action from add item
            actions.push(new Action({
                action: function(){
                    var model = ctrl.createModel();
                    $q.when(model)
                    .then(function(item){
                        ctrl.items.push(item);
                    });
                }
            }));
        }
        // reload items action
        {
            // TODO: maso, 2018: crate action from reload
        }
        return actions;
    };

    /**
     * Adds new action into the controller
     * 
     * @param action to add to list
     */
    this.addAction = function(action) {
        if(!angular.isDefined(this._actions)){
            this._actions = [];
        }
        // TODO: maso, 2018: assert the action is MbAction
        if(!(action instanceof Action)){
            action = new Action(action);
        }
        this._actions = this._actions.push(action);
    };


    /**
     * Deletes item
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @param item
     * @return promiss to delete item
     */
    this.deleteItem = function(item){
        // TODO: maso, 2018: update state of the controller to busy
        var ctrl = this;
        var index;
        confirm('Delete item?')
        .then(function(){
            index = ctrl.items.indexOf(item);
            return ctrl.deleteModel(item);
        })
        .then(function(){
            ctrl.items.splice(index, 1);
        });
    };

    /**
     * Gets object schema
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @return promise to get schema
     */
    this.getSchema = function(){
        // Controllers are supposed to override the function
        return $q.resolve({
            name: 'Item',
            properties:[{
                id: 'int',
                title: 'string'
            }]
        });
    };

    /**
     * Query and get items
     * 
     * @param queryParameter to apply search
     * @return promiss to get items
     */
    this.getItems = function(/*queryParameter*/){

    };

    /**
     * Get item with id
     * 
     * @param id of the item
     * @return promiss to get item
     */
    this.getItem = function(id){
        return {
            id: id
        };
    };

    /**
     * Adds new item
     * 
     * This is default implementation of the data access function. Controllers
     * are supposed to override the function
     * 
     * @memberof SeenAbstractCollectionCtrl
     * @return promiss to add and return an item
     */
    this.addItem = function(){
        // Controllers are supposed to override the function
        var item = {
                id: Math.random(),
                title: 'test item'
        };
        return $q.accept(item);
    };
    

}

/*
 * Add to angular
 */
angular.module('mblowfish-core')//
    .controller('AmWbSeenAbstractCollectionCtrl', SeenAbstractCollectionCtrl) //
    .controller('MbItemsCtrl', SeenAbstractCollectionCtrl);
