
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
 * @ngdoc action-group
 * @name User
 * @description Global user menu
 * 
 * There are several registred menu in the $actions service. Modules can contribute
 * to the dashbord by addin action into it.
 * 
 * - mb.user : All action related to the current user
 * - mb.toolbar.menu : All action related to the toolbar menu
 * 
 * - navigationPathMenu: All items related to navigation.
 * 
 */


angular.module('mblowfish-core', [ //
//	Angular
	'ngMaterial', 
	'ngAnimate', 
	'ngCookies',
	'ngSanitize', //
	'ngRoute',
//	Seen
	'seen-core',
	'seen-user',
	'seen-tenant',
	'seen-cms',
	'seen-monitor',
//	AM-WB
	'am-wb-core', 
//	Others
	'lfNgMdFileInput', // https://github.com/shuyu/angular-material-fileinput
	'vcRecaptcha', //https://github.com/VividCortex/angular-recaptcha
	'ng-appcache',//
	'ngFileSaver',//
	'mdSteppers',//
	'angular-material-persian-datepicker',
	'ngStorage', // https://github.com/gsklee/ngStorage
	'pascalprecht.translate',
	'mdColorPicker',
])
.run(function instantiateRoute($widget, $routeParams) {
	$widget.setProvider('$routeParams', $routeParams);
})

/*******************************************************
 * Compatibility with old version
 *******************************************************/ 
.factory('Action', function (MbAction) {
	return MbAction;
})
.factory('ActionGroup', function (MbActionGroup) {
	return MbActionGroup;
})
.factory('httpRequestInterceptor', function (MbHttpRequestInterceptor) {
	return MbHttpRequestInterceptor;
})
.controller('MessagesCtrl', function ($scope, $controller) {
    angular.extend(this, $controller('MbSeenUserMessagesCtrl', {
        $scope : $scope
    }));
})
.controller('AmWbSeenCmsContentsCtrl', function ($scope, $controller) {
    angular.extend(this, $controller('MbSeenCmsContentsCtrl', {
        $scope : $scope
    }));
})

;
