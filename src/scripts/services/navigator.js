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
 * @ngdoc service
 * @name $navigator
 * @description A default system navigator
 *
 * # Item
 *
 * An item is a single navigation part wich may be a page, link, action, and etc.
 *
 */
.service('$navigator', function($q, $route, $mdDialog, $location, $window) {

	var _items = [];
	var _groups = [];

	function loadAllItems(pagination) {
		setTimeout(function() {
			deferred.notify('about to search items.');
			deferred.resolve(items(pagination));
		}, 100);
		return deferred.promise;
	}

	/**
	 * Gets list of all items in the navigation
	 *
	 * Returns all items added into the navigation list.
	 *
	 * Note: this is an unsynchronized function and the return value is a promiss
	 */
	function items(pagination){
		var items = _items;
		if(pagination){
			// Filter items
			if(pagination.param._px_fk){
				items = [];
				// group
				if(pagination.param._px_fk === 'group'){
					angular.forEach(_items, function(item){
						if(item.groups &&
								angular.isArray(item.groups) &&
								item.groups.indexOf(pagination.param._px_fv) > -1){
							items.push(item);
						}
					});
				}
				// TODO: maso, support others
			}
			// TODO: maso, support sort
		}
		return items;
	}

	/**
	 * Adding the item into the navigation list
	 *
	 * Note: this is an unsynchronized function and the return value is a promiss
	 */
	function newItem(item){
		item.priority = item.priority || 100;
		_items.push(item);
		return this;
	}

	/**
	 * Remove the item from navigation list
	 *
	 * Note: this is an unsynchronized function and the return value is a promiss
	 */
	function removeItem(item) {
		var index = _items.indexOf(item);
		if (index > -1) {
			_items.splice(index, 1);
		}
		return this;
	}

	/**
	 * List all groups
	 */
	function groups(paginationParam){
		return _groups;
	}

	/**
	 * Create new group
	 *
	 * Note: if group with the same id exist, it will bet updated
	 */
	function newGroup(group){
		if(!(group.id in _groups)){
			_groups[group.id] = {
					id: group.id
			};
		}
		angular.merge(_groups[group.id], group);
	}

	/**
	 * Getting the group
	 *
	 * If the group is not register before, new empty will be created.
	 */
	function group(groupId){
		if(!(groupId in _groups)){
			_groups[groupId] = {
					id: groupId
			};
		}
		return _groups[groupId];
	}


	/**
	 * Open an dialog view
	 *
	 * A dialogs needs:
	 *
	 * <ul>
	 * <li>templateUrl</li>
	 * <li>config (optinal)</li>
	 * </ul>
	 *
	 * templateUrl is an html template.
	 *
	 * the config element is bind into the scope of the template automatically.
	 *
	 * @param dialog
	 * @returns promiss
	 */
	function openDialog(dialog) {
		var dialogCnf = {};
		angular.extend(dialogCnf, {
			controller : 'AmdNavigatorDialogCtrl',
			parent : angular.element(document.body),
			clickOutsideToClose : true,
			fullscreen: true,
			multiple:true
		}, dialog);
		if (!dialogCnf.config) {
			dialogCnf.config = {};
		}
		if(!dialogCnf.locals){
			dialogCnf.locals = {};
		}
		dialogCnf.locals.config = dialogCnf.config;
		return $mdDialog.show(dialogCnf);
	}

	/**
	 * Open a page
	 *
	 * @param page
	 */
	function openPage(page, params){
		//TODO: support page parameters
		if(page && page.toLowerCase().startsWith("http")){
			$window.open(page);
		}
		if(params){
			$location.path(page).search(params);
		}else{
			$location.path(page);
		}
	}

	/**
	 * Check page is the current one
	 *
	 * If the input page is selected and loaded before return true;
	 *
	 * @param page String the page path
	 * @return boolean true if page is selected.
	 */
	function isPageSelected(page){
		// XXX: maso, 2017: check if page is the current one
		return false;
	}

	return {
		loadAllItems : loadAllItems,
		openDialog : openDialog,
		openPage: openPage,
		isPageSelected: isPageSelected,
		// Itmes
		items : items,
		newItem: newItem,
		// Group
		groups: groups,
		newGroup: newGroup,
		group: group
	};
});
