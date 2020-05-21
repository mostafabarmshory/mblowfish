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
@ngdoc Serivces
@name $mbComponent
@description Manages list of all global component to share with containers 


 */
angular.module('mblowfish-core').provider('$mbComponent', function() {

	var Component;

	var configs = {};
	var components = {};

	function add(componentId, component) {
		components[componentId] = component;
	}

	function get(componentId) {
		return components[componentId];
	}

	function remove(componentId) {
		delete components[componentId];
	}

	function loadItems() {
		var items = configs.items || {};
		_.forEach(items, function(config, componentId) {
			var component = new Component(item);
			add(componentId, component);
		});
	}

	return {
		/* @ngInject */
		$get: function(MbComponent) {
			Component = MbComponent;

			loadItems();

			this.add = add;
			this.remove = remove;
			this.get = get;

			return this;
		},
		init: function(moduleConfigs) {
			configs = moduleConfigs;
		}
	};
});
