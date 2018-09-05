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
 * @name AmdItemsCtrl
 * @description Generic controller of items collection
 * 
 * This controller is used manages a collection of a virtual items. it is the
 * base of all other collection controllers such as accounts, groups, etc.
 * 
 * There are two types of function in the controller: view and data related. All
 * data functions are considered to be overried by extensions.
 * 
 */
function MbItemsCtrl($scope, $usr, $q, QueryParameter) {
    var STATE_INIT = 'init';
    var STATE_BUSY = 'busy';
    var STATE_IDEAL = 'ideal';

    /**
     * List of all loaded items
     * 
     * All loaded items will be stored into this variable for later usage. This
     * is related to view.
     * 
     * @type array
     * @memberof AmdItemsCtrl
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
     * @memberof AmdItemsCtrl
     */
    this.state = 'init';

    /**
     * Store last paginated response
     * 
     * This is a collection controller and suppose the result of query to be a
     * valid paginated collection. The last response from data layer will be
     * stored in this variable.
     * 
     * @type PaginatedCollection
     * @memberof AmdItemsCtrl
     */
    this.lastResponse = null;

    /**
     * Query parameter
     * 
     * This is the query parameter which is used to query items from the data
     * layer.
     * 
     * @type QueryParameter
     * @memberof AmdItemsCtrl
     */
    this.queryParameter = new QueryParameter();
    this.queryParameter.setOrder('id', 'd');

    /**
     * Reload the controller
     * 
     * Remove all old items and reload the controller state. If the controller
     * is in progress, then cancel the old promiss and start the new job.
     * 
     * @memberof AmdItemsCtrl
     * @returns promiss to reload
     */
    function reload(){
        // relaod data
        this.state=STATE_INIT;
        delete this.requests;
        this.items = [];

        // start the controller
        this.state=STATE_IDEAL;
        return this.loadNextPage();
    }

    /**
     * Loads next page
     * 
     * Load next page and add to the current items.
     * 
     * @memberof AmdItemsCtrl
     * @returns promiss to load next page
     */
    function loadNextPage() {
        // Check functions
        if(!angular.isFunction(this.getItems)){
            throw 'The controller dose not implement getItems function';
        }

        // check state
        if (this.state !== STATE_IDEAL) {
            throw 'Items controller is not in ideal state';
        }
        this.state = STATE_BUSY;

        // set next page
        if (this.lastResponse) {
            if(!this.lastResponse.hasMore()){
                return $q.resolve();
            }
            this.queryParameter.setPage(lastResponse.next());
        }

        // Get new items
        var ctrl = this;
        return this.getItems(this.queryParameter)//
        .then(function(response) {
            ctrl.lastResponse = response;
            ctrl.items = ctrl.items.concat(response.items);
            ctrl.error = null;
        }, function(error){
            ctrl.error = error;
        })//
        .finally(function(){
            ctrl.state = STATE_BUSY;
        });
    }


    /**
     * Set a GraphQl format of data
     * 
     * By setting this the controller is not sync and you have to reload the
     * controller. It is better to set the data query at the start time.
     * 
     * @memberof AmdItemsCtrl
     * @param graphql
     */
    function setDataQuery(grqphql){
        this.grqphql = grqphql;
    }

    /**
     * Get properties to sort
     * 
     * @return array of getProperties to use in search, sort and filter
     */
    function getProperties(){
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
    }

    /**
     * Load controller actions
     * 
     * @return list of actions
     */
    function getActions(){
        var actions = this._actions;
        // TODO: maso, 2018: add flag to cache 
        // add item action
        if(angular.isFunction(this.addItem)){
            // TODO: maso, 2018: crate action from add item
        }
        // reload items action
        {
            // TODO: maso, 2018: crate action from reload
        }
    }

    /**
     * Adds new action into the controller
     * 
     * @param action to add to list
     */
    function addAction(action) {
        if(!angular.isDefined(this._actions)){
            this._actions = [];
        }
        // TODO: maso, 2018: assert the action is MbAction
        this._actions = this._actions.concat(action);
    }

















    /**
     * Gets object schema
     * 
     * @memberof AmdItemsCtrl
     * @return promise to get schema
     */
    function getSchema(){
        // Controllers are supposed to override the function
        return $q.resolve({
            name: 'Item',
            properties:[{
                id: 'int',
                title: 'string'
            }]
        });
    }

    /**
     * Query and get items
     * 
     * @param queryParameter to apply search
     * @return promiss to get items
     */
    function getItems(queryParameter){

    }

    /**
     * Get item with id
     * 
     * @param id of the item
     * @return promiss to get item
     */
    function getItem(id){

    }

    /**
     * Adds new item
     * 
     * This is default implementation of the data access function. Controllers
     * are supposed to override the function
     * 
     * @memberof AmdItemsCtrl
     * @return promiss to add and return an item
     */
    function addItem(){
        // Controllers are supposed to override the function
        var item = {
                id: random(),
                title: 'test item'
        }
        return $q.accept(item);
    }

    /**
     * Deletes item
     * 
     * @memberof AmdItemsCtrl
     * @param item
     * @return promiss to delete item
     */
    function deleteItem(item){
        // Controllers are supposed to override the function

    }


    // view layer functions
    this.reload = reload;
    this.loadNextPage = loadNextPage;
    this.setDataQuery = setDataQuery;
    this.getProperties = getProperties;
    this.getActions = getActions;

    // default data layer of item
    this.getSchema = getSchema;
    this.getItems = getItems;
    this.getItem = getItem;
    this.addItem = addItem;
    this.deleteItem = deleteItem;

    this.state = STATE_IDEAL;
}

angular.module('mblowfish-core')
.controller('MbItemsCtrl', MbItemsCtrl);
