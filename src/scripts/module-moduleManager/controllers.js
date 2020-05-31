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
 * @ngdoc Controllers
 * @name MbHelpCtrl
 * @description Help page controller
 * 
 * Watches total system and update help data.
 * 
 */
angular.module('mblowfish-core').controller('MbLocalModulesCtrl', function(
	/* angularjs */ $scope, $controller,
	/* Mblowfish */ $modules, $mbActions
) {

	/*
	 * Extends collection controller from MbAbstractCtrl 
	 */
	angular.extend(this, $controller('MbAbstractCtrl', {
		$scope: $scope
	}));

	this.loadModules = function() {
		this.modules = $modules.getLocalModules();
	}

	this.addModule = function($event) {
		$actions.exec('mb.app.local.modules.create', $event);
	};

	this.deleteModule = function(item, $event) {
		$event.modules = [item];
		$actions.exec('mb.app.local.modules.delete', $event);
	};

	var ctrl = this;
	this.addEventHandler('/app/local/modules', function() {
		ctrl.loadModules();
	});
	ctrl.loadModules();
});

angular.module('mblowfish-core').controller('MGlobalModulesCtrl', function(
	/* angularjs */ $scope, $controller,
	/* Mblowfish */ $modules, $mbActions
) {

	/*
	 * Extends collection controller from MbAbstractCtrl 
	 */
	angular.extend(this, $controller('MbAbstractCtrl', {
		$scope: $scope
	}));

	this.loadModules = function() {
		this.modules = $modules.getGlobalModules();
	}

	this.addModule = function($event) {
		$actions.exec('mb.app.global.modules.create', $event);
	};

	this.deleteModule = function(item, $event) {
		$event.modules = [item];
		$actions.exec('mb.app.global.modules.delete', $event);
	};

	var ctrl = this;
	this.addEventHandler('/app/global/modules', function() {
		ctrl.loadModules();
	});
	ctrl.loadModules();
});


