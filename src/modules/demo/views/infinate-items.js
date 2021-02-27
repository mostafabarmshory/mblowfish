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
import templateUrl from './infinate-items.html';

export default {
	icon: 'list',
	title: 'Infinit Item List',
	description: 'List of item is infinit and load by scroll',
	groups: ['UI'],
	templateUrl: templateUrl,
	controllerAs: 'ctrl',
	controller: function($q, $timeout) {
		'ngInject';
		this.working = false;
		this.items = [];

		this.getItems = function() {
			var defer = $q.defer();
			$timeout(() => {
				var items = [];
				for (var i = 0; i < 20; i++) {
					items.push({
						icon: 'wizard',
						title: 'title',
						subTitle: 'sub title',
						description: 'description of :' + Math.random()
					});
				}
				defer.resolve(items);
			}, 2000);
			return defer.promise;
		}

		/**
		 * Loading next page
		 * 
		 * @returns
		 */
		this.nextPage = function() {
			if (this.working) {
				return;
			}
			// start state (device list)
			this.working = false;
			this.getItems()//
				.then((items) => {
					this.items = this.items.concat(items);
				})
				.finally(() => this.working = false);
		}


		/**
		 * Reload data
		 * 
		 * @returns
		 */
		this.reload = function() {
			this.items = [];
			this.nextPage();
		}

		this.isWorking = function() {
			return this.wokring;
		}

		this.reload();
	}
}
