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


import templateUrl from './resources.html';
import ModuleConstants from '../../moduleManager/Constants'

export default {
	icon: 'wizard',
	title: 'Resources ',
	description: 'Alow you to select any resouces you want',
	anchor: 'editors',
	groups: ['UI'],
	templateUrl: templateUrl,
	controllerAs: 'ctrl',
	controller: function($mbResource) {
		'ngInject';
		this.modules = [];

		this.selectModules = ($event) => {
			return $mbResource
				.get(ModuleConstants.MB_MODULE_SP, {
					data: this.modules,
					style: {
						title: 'Select module list',
						description: 'Select one or more module',
						icon: 'package'
					},
					targetEvent: $event
				})//
				.then((modules) => {
					this.modules = modules;
				});
		};
	}
}

