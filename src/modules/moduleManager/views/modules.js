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

mblowfish.view(MB_MODULE_MODULES_VIEW, {
	title: 'Modules',
	icon: 'language',
	description: 'Manage global modules to enable for all users.',
	templateUrl: 'scripts/module-moduleManager/views/modules.html',
	groups: ['Utilities'],
	controllerAs: 'ctrl',
	controller: function(
	/* angularjs */ $scope, $controller,
	/* Mblowfish */ $mbModules, $mbActions
	) {
		'ngInject';
		/*
		 * Extends collection controller from MbAbstractCtrl 
		 */
		angular.extend(this, $controller('MbAbstractCtrl', {
			$scope: $scope
		}));

		this.loadModules = function() {
			this.modules = $mbModules.getModules();
		}

		this.addModule = function($event) {
			$mbActions.exec(MB_MODULE_CREATE_ACTION, $event);
		};

		this.deleteModule = function(item, $event) {
			$event.modules = [item];
			$mbActions.exec(MB_MODULE_DELETE_ACTION, $event);
		};

		this.openMenu = function($mdMenu, $event) {
			return $mdMenu.open($event);
		};

		var ctrl = this;
		this.addEventHandler(MB_MODULE_SP, function() {
			ctrl.loadModules();
		});

		ctrl.loadModules();
	}
});