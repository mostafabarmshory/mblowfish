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
 * @ngdoc menu
 * @name User
 * @description Global user menu
 * 
 * There are several registred menu in the $menu service. Modules can contribute
 * to the dashbord by addin action into it.
 * 
 * - amd.user : All action related to the current user
 * 
 */
/**
 * @ngdoc menu
 * @name Scope
 * @description Global scope menu
 * 
 * There are several registred menu in the $menu service. Modules can contribute
 * to the dashbord by addin action into it.
 * 
 * - amd.user : All action related to the current user
 * 
 */

angular.module('mblowfish-core', [ //
//	Angular
	'ngMaterial', 
	'ngAnimate', 
	'ngCookies',
	'ngSanitize', //
	'ngRoute', //
//	Seen
	'seen-tenant',
//	AM-WB
	'am-wb-core', 
	'am-wb-common', //
	'am-wb-seen-core',
	'am-wb-seen-monitors',
//	Others
	'lfNgMdFileInput', // https://github.com/shuyu/angular-material-fileinput
	'ngStorage', // https://github.com/gsklee/ngStorage
	'vcRecaptcha', //https://github.com/VividCortex/angular-recaptcha
	'infinite-scroll', // https://github.com/sroze/ngInfiniteScroll
	'nvd3',//
	'ng-appcache',//
	'ngFileSaver',//
	'angular-material-persian-datepicker'
]);

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
 * 
 */
.config(function() {
	// XXX: maso, 2017: adding custom icons 
//	$mdIconProvider.icon('user', 'images/user.svg', 64);
});

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

angular.module('mblowfish-core').config(function($mdDateLocaleProvider) {
	// Change moment's locale so the 'L'-format is adjusted.
	// For example the 'L'-format is DD.MM.YYYY for German
	moment.locale('en');

	// Set month and week names for the general $mdDateLocale service
	var localeData = moment.localeData();
	$mdDateLocaleProvider.months = localeData._months;
	$mdDateLocaleProvider.shortMonths = moment.monthsShort();
	$mdDateLocaleProvider.days = localeData._weekdays;
	$mdDateLocaleProvider.shortDays = localeData._weekdaysMin;
	// Optionaly let the week start on the day as defined by moment's locale data
	$mdDateLocaleProvider.firstDayOfWeek = localeData._week.dow;

	// Format and parse dates based on moment's 'L'-format
	// 'L'-format may later be changed
	$mdDateLocaleProvider.parseDate = function(dateString) {
		var m = moment(dateString, 'L', true);
		return m.isValid() ? m.toDate() : new Date(NaN);
	};

	$mdDateLocaleProvider.formatDate = function(date) {
		var m = moment(date);
		return m.isValid() ? m.format('L') : '';
	};
});
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
 * 
 */
.config(function($routeProvider, $locationProvider) {
	$routeProvider//
	/**
	 * @ngdoc ngRoute
	 * @name /preferences
	 * @description preferences pages
	 */
	.when('/preferences', {
		templateUrl : 'views/amh-preferences.html',
		controller : 'MbPreferencesCtrl',
		helpId: 'preferences',
	}) //
	/**
	 * @ngdoc ngRoute
	 * @name /preferences/:page
	 * @description Preferences page
	 * 
	 * Display a preferences page to manage a part of settings. Here is list of
	 * default pages:
	 * 
	 * - google-analytic
	 * - brand
	 * - update
	 * - pageNotFound
	 */
	.when('/preferences/:preferenceId', {
		templateUrl : 'views/amh-preference.html',
		controller : 'MbPreferenceCtrl',
		helpId: function(currentState){
			return 'preference-' + currentState.params['preferenceId'];
		}
	}); //

	$locationProvider.html5Mode(true);
});

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
 * 
 */
.config(function($mdThemingProvider) {

	// AMD default palette
	$mdThemingProvider.definePalette('amdPrimaryPalette', {
		'50' : '#FFFFFF',
		'100' : 'rgb(255, 198, 197)',
		'200' : '#E75753',
		'300' : '#E75753',
		'400' : '#E75753',
		'500' : '#E75753',
		'600' : '#E75753',
		'700' : '#E75753',
		'800' : '#E75753',
		'900' : '#E75753',
		'A100' : '#E75753',
		'A200' : '#E75753',
		'A400' : '#E75753',
		'A700' : '#E75753'
	});

	// Dark theme
	$mdThemingProvider.theme('dark')//
	.primaryPalette('amdPrimaryPalette')//
	.dark();

	$mdThemingProvider.alwaysWatchTheme(true);
});

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
 * @ngdoc controller
 * @name MainController
 * @description Dashboard
 * 
 */
.controller('MainController2',function($scope, $navigator, $mdSidenav, $mdBottomSheet, $log, $q,
		$mdToast, $usr, $route, $location, $monitor, $rootScope,
		$app) {

	var vm = $scope;

	vm.menuItems = [];
	vm.selectItem = selectItem;
	vm.toggleItemsList = toggleItemsList;
	vm.showActions = showActions;
	// vm.title = $route.current.config.title;
	vm.showSimpleToast = showSimpleToast;
	vm.toggleSidebar = toggleSidebar;
	vm.toggleRightSidebar = toggleRightSidebar;

	$navigator.loadAllItems()//
	.then(function(menuItems) {
		vm.menuItems = [].concat(menuItems);
	});


	// $view service
	function toggleRightSidebar() {
		toggleSidebar('right');
	}

	function toggleSidebar(id) {
		return $mdSidenav(id).toggle();
	}

	function toggleItemsList() {
		var pending = $mdBottomSheet.hide() || $q.when(true);
		pending.then(function() {
			toggleSidebar('left');
		});
	}

	function selectItem(item) {
		vm.title = item.config.name;
		vm.toggleItemsList();
		vm.showSimpleToast(vm.title);
	}

	// $shortcut service
	function showActions($event) {
		$mdBottomSheet.show(
				{
					parent : angular.element(document
							.getElementById('content')),
							templateUrl : 'views/partials/bottomSheet.html',
							controller : [ '$mdBottomSheet', SheetController ],
							controllerAs : "vm",
							bindToController : true,
							targetEvent : $event
				}).then(function(clickedItem) {
					clickedItem && $log.debug(clickedItem.name + ' clicked!');
				});

		function SheetController($mdBottomSheet) {
			var vm = this;
			vm.actions = [ {
				name : 'Share',
				icon : 'share',
				url : 'https://tinc'
			}, {
				name : 'Star',
				icon : 'star',
				url : 'https://stargazers'
			} ];

			vm.performAction = function(action) {
				$mdBottomSheet.hide(action);
			};
		}
	}


	// $notify service
	function showSimpleToast(title) {
		$mdToast.show($mdToast.simple().content(title).hideDelay(2000)
				.position('bottom right'));
	}

	// Message service
	$monitor.monitor('message', 'count')//
	.then(function(monitor){
		$scope.messageMonitor = monitor;
	})
});

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
 * @ngdoc controller
 * @name MbAccountCtrl
 * @description Manages the current user.
 * 
 * Manages current user action
 */
.controller('MbAccountCtrl', function($scope, $app, $navigator) {

	/*
	 * Store controller state
	 */
	var ctrl = {
			loadUser: false,
			changingPassword: false
	};


	/**
	 * Go to the default page
	 * 
	 * @name load
	 * @memberof AmdAccountCtrl
	 * @returns {promiss} to load user data
	 */
	function goToDashboard() {
		// XXX: maso, 1395: ممکن هست این حالت وجود نداشته باشد
		$navigator.openPage('dashboard');
	}

	/**
	 * Call login process for current user
	 * 
	 * @memberof AmdAccountCtrl
	 * @name login
	 * @param {object} cridet          username and password
	 * @param {string} cridet.login    username
	 * @param {stirng} cridig.password Password
	 * @returns {promiss} to do the login
	 */
	function login(cridet) {
		if(ctrl.loadUser){
			return;
		}
		ctrl.loadUser= true;
		return $app.login(cridet)//
		.catch(function(error) {
			ctrl.error = error;
		})//
		.finally(function(){
			ctrl.loadUser = false;
		});
	}


	/**
	 * Loads user data
	 * 
	 * @name load
	 * @memberof AmdAccountCtrl
	 * @returns {promiss} to load user data
	 */
	function loadUser(){
		if(ctrl.loadUser){
			return;
		}
		ctrl.loadUser = true;
		return $usr.session()//
		.then(function(user){
			setUser(user);
			ctrl.loadUser = false;
		}, function(error){
			ctrl.error = error;
		})//
		.finally(function(){
			ctrl .loadUser = false;
		});
	}
	

	/**
	 * Save current user
	 * 
	 * @name load
	 * @memberof AmdAccountCtrl
	 * @returns {promiss} to save
	 */
	function saveUser(){
		if(ctrl.loadUser){
			return;
		}
		// TODO: maso, 2017: check if user exist
		ctrl.saveUser = true;
		return ctrl.user.update()//
		.then(function(){
			ctrl.saveUser = false;
		}, function(error){
			ctrl.error = error;
			ctrl.saveUser = false;
		})
	}

	/**
	 * Change password of the current user
	 * 
	 * @name load
	 * @memberof AmdAccountCtrl
	 * @returns {promiss} to change password
	 */
	function changePassword(data) {
		if(ctrl.changingPassword){
			return;
		}
		ctrl.changingPassword = true;
		var param = {
				'old' : data.oldPass,
				'new' : data.newPass,
				'password': data.newPass,
		};
//		return $usr.resetPassword(param)//
		$scope.app.user.current.newPassword(param)
		.then(function(){
			$scope.logout();
		}, function(error){
			alert('Fail to update password:'+error.data.message);
		})//
		.finally(function(){
			ctrl.changingPassword = false;
		});
	}
	

	/**
	 * Update avatar of the current user
	 * 
	 * @name load
	 * @memberof AmdAccountCtrl
	 * @returns {promiss} to update avatar
	 */
	function updateAvatar(avatarFiles){
		// XXX: maso, 1395: reset avatar
		return ctrl.user.newAvatar(avatarFiles[0].lfFile)//
		.then(function(){
			$window.location.reload();
		}, function(error){
			alert('Fail to update avatar:' + error.data.message);
		});
	}


	// TODO: maso, 2017: getting from server
	// Account property descriptor
	$scope.apds = [ {
		key : 'first_name',
		title : 'First name',
		type : 'string'
	}, {
		key : 'last_name',
		title : 'Last name',
		type : 'string'
	}, {
		key : 'language',
		title : 'language',
		type : 'string'
	}, {
		key : 'timezone',
		title : 'timezone',
		type : 'string'
	} ];
	
	// Bind to scope
	$scope.ctrl = ctrl;
	$scope.login = login;
	$scope.logout = $app.logout;
	$scope.goToDashboard = goToDashboard;
	$scope.load = loadUser;
	$scope.reload = loadUser;
	$scope.saveUser = saveUser;
	$scope.changePassword = changePassword;
	$scope.updateAvatar = updateAvatar;
});

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
 * @ngdoc controller
 * @name AmdConfigCtrl
 * @description Controller of a configs
 * 
 */
.controller('AmdConfigCtrl', function($scope, $settings, $routeParams, $navigator) {

	$settings.config($routeParams['configId'])
	.then(function(config) {
		$scope.config = config;
	}, function() {
		$navigator.openPage('configs');
	});
});
// TODO: Hadi: should be deleted. MbPreferencesCtrl is replaced.
///*
// * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
// * 
// * Permission is hereby granted, free of charge, to any person obtaining a copy
// * of this software and associated documentation files (the "Software"), to deal
// * in the Software without restriction, including without limitation the rights
// * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// * copies of the Software, and to permit persons to whom the Software is
// * furnished to do so, subject to the following conditions:
// * 
// * The above copyright notice and this permission notice shall be included in all
// * copies or substantial portions of the Software.
// * 
// * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// * SOFTWARE.
// */
//'use strict';
//angular.module('mblowfish-core')
//
//
///**
// * @ngdoc controller
// * @name AmdConfigsCtrl
// * @description Controller of configs
// * 
// */
//.controller('AmdConfigsCtrl', function($scope, $settings) {
//
//	var COLORS = [ '#ffebee', '#ffcdd2', '#ef9a9a', '#e57373',
//		'#ef5350', '#f44336', '#e53935', '#d32f2f', '#c62828',
//		'#b71c1c', '#ff8a80', '#ff5252', '#ff1744', '#d50000',
//		'#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63',
//		'#d81b60', '#c2185b', '#ad1457', '#880e4f', '#ff80ab',
//		'#ff4081', '#f50057', '#c51162', '#e1bee7', '#ce93d8',
//		'#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2',
//		'#4a148c', '#ea80fc', '#e040fb', '#d500f9', '#aa00ff',
//		'#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2',
//		'#673ab7', '#5e35b1', '#4527a0', '#311b92', '#b388ff',
//		'#7c4dff', '#651fff', '#6200ea', '#c5cae9', '#9fa8da',
//		'#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f',
//		'#283593', '#1a237e', '#8c9eff', '#536dfe', '#3d5afe',
//		'#304ffe', '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6',
//		'#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0',
//		'#0d47a1', '#82b1ff', '#448aff', '#2979ff', '#2962ff',
//		'#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4',
//		'#039be5', '#0288d1', '#0277bd', '#01579b', '#80d8ff',
//		'#40c4ff', '#00b0ff', '#0091ea', '#e0f7fa', '#b2ebf2',
//		'#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1',
//		'#0097a7', '#00838f', '#006064', '#84ffff', '#18ffff',
//		'#00e5ff', '#00b8d4', '#e0f2f1', '#b2dfdb', '#80cbc4',
//		'#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b',
//		'#00695c', '#a7ffeb', '#64ffda', '#1de9b6', '#00bfa5',
//		'#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a',
//		'#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20',
//		'#b9f6ca', '#69f0ae', '#00e676', '#00c853', '#f1f8e9',
//		'#dcedc8', '#c5e1a5', '#aed581', '#9ccc65', '#8bc34a',
//		'#7cb342', '#689f38', '#558b2f', '#33691e', '#ccff90',
//		'#b2ff59', '#76ff03', '#64dd17', '#f9fbe7', '#f0f4c3',
//		'#e6ee9c', '#dce775', '#d4e157', '#cddc39', '#c0ca33',
//		'#afb42b', '#9e9d24', '#827717', '#f4ff81', '#eeff41',
//		'#c6ff00', '#aeea00', '#fffde7', '#fff9c4', '#fff59d',
//		'#fff176', '#ffee58', '#ffeb3b', '#fdd835', '#fbc02d',
//		'#f9a825', '#f57f17', '#ffff8d', '#ffff00', '#ffea00',
//		'#ffd600', '#fff8e1', '#ffecb3', '#ffe082', '#ffd54f',
//		'#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00',
//		'#ff6f00', '#ffe57f', '#ffd740', '#ffc400', '#ffab00',
//		'#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726',
//		'#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100',
//		'#ffd180', '#ffab40', '#ff9100', '#ff6d00', '#fbe9e7',
//		'#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722',
//		'#f4511e', '#e64a19', '#d84315', '#bf360c', '#ff9e80',
//		'#ff6e40', '#ff3d00', '#dd2c00', '#d7ccc8', '#bcaaa4',
//		'#795548', '#d7ccc8', '#bcaaa4', '#8d6e63', '#eceff1',
//		'#cfd8dc', '#b0bec5', '#90a4ae', '#78909c', '#607d8b',
//		'#546e7a', '#cfd8dc', '#b0bec5', '#78909c' ];
//
//	function randomColor() {
//		return COLORS[Math.floor(Math.random() * COLORS.length)];
//	}
//
//	function randomSpan() {
//		var r = Math.random();
//		if (r < 0.8) {
//			return 1;
//		} else if (r < 0.9) {
//			return 2;
//		} else {
//			return 3;
//		}
//	}
//
//	function openSetting(tile) {
//		$settings.openConfig(tile.page);
//	}
//
//	// Load settings
//	$settings.configs()//
//	.then(function(settings) {
//		$scope.settingsTiles = [];
//		for (var i = 0; i < settings.items.length; i++) {
//			$scope.settingsTiles.push({
//				color : randomColor(),
//				colspan : randomSpan(),
//				rowspan : randomSpan(),
//				page : settings.items[i]
//			});
//		}
//	});
//
//	$scope.openSetting = openSetting;
//});

'use strict';

angular.module('mblowfish-core')

/**
 * @ngdoc controller
 * @name AmdDashboardCtrl
 * @description Dashboard
 * 
 */
.controller('AmdDashboardCtrl', function($scope, $navigator, $app) {
    function toogleEditable(){
    	$scope.editable = !$scope.editable;
    }
    
    $navigator.scopePath($scope)//
	.add({
		title: 'Dashboard',
		link: '#!/dashboard'
	});
    
    $app.scopeMenu($scope) //
	.add({ // edit menu
		priority : 15,
		icon : 'edit',
		label : 'Edit content',
		tooltip : 'Toggle edit mode of the current contetn',
		visible : function(){
			return $scope.app.user.owner;
		},
		action : toogleEditable
	});//
    
});

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
 * @ngdoc controller
 * @name AmdGroupsResourceCtrl
 * @description Dashboard
 * 
 */
.controller('AmdGroupsResourceCtrl', function($scope, $usr, PaginatorParameter/*, $navigator*/ ) {

	var paginatorParameter = new PaginatorParameter();
	paginatorParameter.setOrder('id', 'a');
	var requests = null;
	var ctrl = {
			state: 'relax',
			items: []
	};

	/**
	 * جستجوی درخواست‌ها
	 * 
	 * @param paginatorParameter
	 * @returns promiss
	 */
	function find(query) {
		paginatorParameter.setQuery(query);
		reload();
	}

	/**
	 * لود کردن داده‌های صفحه بعد
	 * 
	 * @returns promiss
	 */
	function nextPage() {
		if (ctrl.status === 'working') {
			return;
		}
		if (requests && !requests.hasMore()) {
			return;
		}
		if (requests) {
			paginatorParameter.setPage(requests.next());
		}
		// start state (device list)
		ctrl.status = 'working';
		return $usr.groups(paginatorParameter)//
		.then(function(items) {
			requests = items;
			ctrl.items = ctrl.items.concat(requests.items);
			ctrl.status = 'relax';
		}, function() {
			ctrl.status = 'fail';
		});
	}

	/**
	 * تمام حالت‌های کنترل ررا بدوباره مقدار دهی می‌کند.
	 * 
	 * @returns promiss
	 */
	function reload(){
		requests = null;
		ctrl.items = [];
		return nextPage();
	}

	function selectGroupId(group){
		$scope.$parent.setValue(group.id);
	}
	
	/*
	 * تمام امکاناتی که در لایه نمایش ارائه می‌شود در اینجا نام گذاری شده است.
	 */
	$scope.items = [];
	$scope.search = find;
	$scope.nextPage = nextPage;
	$scope.ctrl = ctrl;
	$scope.selectGroupId = selectGroupId;

	// Pagination toolbar
	$scope.paginatorParameter = paginatorParameter;
	$scope.reload = reload;
	$scope.sortKeys= [
		'id', 
		'name',
		'description'
		];
//	$scope.moreActions=[{
//		title: 'New group',
//		icon: 'group_add',
//		action: addGroup
//	}];

});

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
 * @ngdoc controller
 * @name AmdHelpCtrl
 * @description Help page controller
 * 
 */
.controller('AmdHelpCtrl', function($scope, $rootScope, $route, $http, $translate) {
	$rootScope.showHelp = false;



	function _loadHelpContent() {
		if (!$rootScope.showHelp) {
			return;
		}
		// TODO: maso, 2018: check if route is changed.
		var currentState = $route.current;
		var lang = $translate.use() === 'fa' ? 'fa' : 'en';
		if (currentState && currentState.config) {
			var myId = currentState.config.helpId;
			if (angular.isFunction(myId)) {
				myId = myId(currentState);
			}
			if (!angular.isDefined(myId)) {
				myId = 'not-found';
			}
			// load content
			$http.get('resources/helps/' + myId + '-' + lang + '.json') //
			.then(function(res) {
				$scope.helpContent = res.data;
			});
		} else {
			$http.get('resources/helps/not-found-' + lang + '.json') //
			.then(function(res) {
				$scope.helpContent = res.val;
			});
		}
	}
	
	$scope.closeHelp = function(){
		$rootScope.showHelp = false;
	}
	
	$scope.$watch('showHelp', _loadHelpContent);

	$scope.$watch(function(){
		return $route.current;
	}, _loadHelpContent);
});
'use strict';
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
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
angular.module('mblowfish-core')


/**
 * @ngdoc controller
 * @name MessagesCtrl
 * @description Dashboard
 * 
 */
.controller('MessagesCtrl', function($scope, $usr, $monitor, PaginatorParameter) {

	var paginatorParameter = new PaginatorParameter();
	paginatorParameter.setOrder('id', 'd');
	var requests = null;
	var ctrl = {
			state: 'relax',
			items: []
	};


	/**
	 * جستجوی درخواست‌ها
	 * 
	 * @param paginatorParameter
	 * @returns promiss
	 */
	function find(query) {
		paginatorParameter.setQuery(query);
		return reload();
	}

	/**
	 * لود کردن داده‌های صفحه بعد
	 * 
	 * @returns promiss
	 */
	function nextPage() {
		if (ctrl.status === 'working') {
			return;
		}
		if (requests && !requests.hasMore()) {
			return;
		}
		if (requests) {
			paginatorParameter.setPage(requests.next());
		}
		// start state (device list)
		ctrl.status = 'working';
		return $usr.messages(paginatorParameter)//
		.then(function(items) {
			requests = items;
			ctrl.items = ctrl.items.concat(requests.items);
			ctrl.status = 'relax';
		}, function() {
			ctrl.status = 'fail';
		});
	}


	/**
	 * درخواست مورد نظر را از سیستم حذف می‌کند.
	 * 
	 * @param request
	 * @returns promiss
	 */
	function remove(pobject) {
		return pobject.delete()//
		.then(function(){
			var index = ctrl.items.indexOf(pobject);
			if (index > -1) {
				ctrl.items .splice(index, 1);
			}
			if(ctrl.items.length === 0){
				reload();
			}
		});
	}

	/**
	 * تمام حالت‌های کنترل ررا بدوباره مقدار دهی می‌کند.
	 * 
	 * @returns promiss
	 */
	function reload(){
		requests = null;
		ctrl.items = [];
//		ctrl.status = 'relax';
		return nextPage();
	}

	/*
	 * تمام امکاناتی که در لایه نمایش ارائه می‌شود در اینجا نام گذاری
	 * شده است.
	 */

	$scope.items = [];
	$scope.reload = reload;
	$scope.search = find;
	$scope.nextMessages = nextPage;
	$scope.remove = remove;
	$scope.ctrl = ctrl;
	$scope.pp = paginatorParameter;

	// watch messages
	var handler;
	$monitor.monitor('message', 'count')//
	.then(function(monitor){
		handler = monitor.watch(function(){
			reload();
		});
	});
	$scope.$on('$destroy', handler);
	/*
	 * مقداردهی اولیه
	 */
	reload();
});

'use strict';
angular.module('mblowfish-core')

/**
 * @ngdoc controller
 * @name AmdNavigatorDialogCtrl
 * @description # AccountCtrl Controller of the mblowfish-core
 */
.controller('AmdNavigatorDialogCtrl', function($scope, $mdDialog, config) {
	$scope.config = config;
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.answer = function(a) {
		$mdDialog.hide(a);
	};
});

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
 * @ngdoc controller
 * @name AvaNavigatorCtrl
 * @description Navigator controller
 * 
 */
.controller('AmdNavigatorCtrl', function($scope, $navigator, $route) {


	// Get items from navigator
	function loadItems() {

		var _items = [];

		/* 
		 * Push navigation states
		 */
		angular.forEach($route.routes, function(config, route) {
			if (config.navigate) {
				// init conifg
				config.type = 'link';
				config.link = config.originalPath;
				config.title = config.title || config.name || 'no-name';
				config.priority = config.priority || 100;
				_items.push(config)
			}
		});
		
		angular.forEach($navigator.items(), function(item) {
			_items.push(item);
		});

		
		$scope.menuItems = {
				hiden : false,
				sections : []
		};
		// Sections
		var sections = [];
		angular.forEach(_items, function(item) {
			if (item.groups) {
				angular.forEach(item.groups, function(group) {
					var g = $navigator.group(group);
					if (!(g.id in sections)) {
						sections[g.id] = angular.extend({
							type : 'toggle',
							sections : []
						}, g);
						$scope.menuItems.sections.push(sections[g.id]);
					}
					sections[g.id].sections.push(item);
				});
			} else {
				$scope.menuItems.sections.push(item);
			}
		});
	}


	loadItems();

});
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
 * @ngdoc controller
 * @name AmhPreferencesCtrl
 * @description Manages preferences page
 * 
 * In the preferences page, all configs of the system are displayed and
 * users are able to change them. These preferences pages are related to
 * the current SPA usually.
 * 
 */
.controller('MbPreferencesCtrl',function($scope, $preferences) {

	/**
	 * Open tile
	 */
	function openSetting(tile) {
		$preferences.openPage(tile.page);
	}

	// Load settings
	$preferences.pages()//
	.then(function(settings) {
		$scope.settingsTiles = [];
		for (var i = 0; i < settings.items.length; i++) {
			$scope.settingsTiles.push({
				colspan : 2,
				rowspan : 2,
				page : settings.items[i]
			});
		}
	});

	$scope.openSetting = openSetting;
});

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
 * @ngdoc controller
 * @name AmdRolesResourceCtrl
 * @description Role resource
 */
.controller('AmdRolesResourceCtrl', function($scope, $usr, PaginatorParameter ) {

	var paginatorParameter = new PaginatorParameter();
	paginatorParameter.setOrder('id', 'a');
	var requests = null;
	var ctrl = {
			state: 'relax',
			items: []
	};

	/**
	 * جستجوی درخواست‌ها
	 * 
	 * @param paginatorParameter
	 * @returns promiss
	 */
	function find(query) {
		paginatorParameter.setQuery(query);
		return reload();
	}

	/**
	 * لود کردن داده‌های صفحه بعد
	 * 
	 * @returns promiss
	 */
	function nextPage() {
		if (ctrl.status === 'working') {
			return;
		}
		if (requests && !requests.hasMore()) {
			return;
		}
		if (requests) {
			paginatorParameter.setPage(requests.next());
		}
		// start state (device list)
		ctrl.status = 'working';
		return $usr.roles(paginatorParameter)//
		.then(function(items) {
			requests = items;
			ctrl.items = ctrl.items.concat(requests.items);
			ctrl.status = 'relax';
		}, function() {
			ctrl.status = 'fail';
		});
	}

	/**
	 * تمام حالت‌های کنترل ررا بدوباره مقدار دهی می‌کند.
	 * 
	 * @returns promiss
	 */
	function reload(){
		requests = null;
		ctrl.items = [];
		return nextPage();
	}

	function selectRoleId(role){
		$scope.$parent.setValue(role.id);
	}
	
	/*
	 * تمام امکاناتی که در لایه نمایش ارائه می‌شود در اینجا نام گذاری
	 * شده است.
	 */
	$scope.items = [];
	$scope.reload = reload;
	$scope.search = find;
	$scope.nextPage = nextPage;
	$scope.ctrl = ctrl;
	$scope.selectRoleId = selectRoleId;
	
	$scope.paginatorParameter = paginatorParameter;
	$scope.sortKeys = [
		'id', 
		'name'
		];
//	$scope.moreActions = [{
//	title: 'New role',
//	icon: 'add',
//	action: function(){
//	alert('well done');
//	}
//	}];

	/*
	 * مقداردهی اولیه
	 */
//	reload();
});

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
 * @ngdoc controller
 * @name settingsBrandCtrl
 * @description Dashboard
 * 
 */
.controller('settingsBrandCtrl', function($scope, $navigator) {
	// Integerate with dashboard
    $navigator.scopePath($scope)//
	.add({
		title: 'Settings',
		active: function(){
			$navigator.openPage('/settings');
		}
	})//
	.add({
		title: 'Branding',
		active: function(){
			$navigator.openPage('/settings/brand');
		}
	});
    
});

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
 * @ngdoc controller
 * @name settingsGoogleAnalyticCtrl
 * @description Dashboard
 * 
 */
.controller('settingsGoogleAnalyticCtrl', function($scope, $navigator) {
	// Integerate with dashboard
    $navigator.scopePath($scope)//
	.add({
		title: 'Settings',
		active: function(){
			$navigator.openPage('/settings');
		}
	})//
	.add({
		title: 'Google analytic',
		active: function(){
			$navigator.openPage('/settings/google-analytic');
		}
	});
});

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
 * @ngdoc controller
 * @name settingsLocalCtrl
 * @description Dashboard
 * 
 */
.controller('settingsLocalCtrl', function($scope, $navigator) {
	// Integerate with dashboard
    $navigator.scopePath($scope)//
	.add({
		title: 'Settings',
		active: function(){
			$navigator.openPage('/settings');
		}
	})//
	.add({
		title: 'Localization',
		active: function(){
			$navigator.openPage('/settings/local');
		}
	});
});

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
 * @ngdoc controller
 * @name AmdThemesCtrl
 * @description Dashboard
 * 
 */
.controller('AmdThemesCtrl', function($scope, $mdTheming) {
	$scope.themes =[];
	angular.forEach($mdTheming.THEMES, function(value, key){
		$scope.themes.push({
			'id': key,
			'label': value.name
		});
	});
});

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
 * @ngdoc controller
 * @name AmdToolbarCtrl
 * @description Toolbar
 * 
 */
.controller('MbToolbarDashboardCtrl', function($scope, $app) {
	$scope.toolbarMenu = $app.getToolbarMenu();
});
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
 * @ngdoc controller
 * @name AmdUsersResourceCtrl
 * @description Dashboard
 * 
 */
.controller('AmdUsersResourceCtrl', function($scope, $usr, PaginatorParameter) {

	var paginatorParameter = new PaginatorParameter();
	paginatorParameter.setOrder('id', 'd');
	var requests = null;
	var ctrl = {
			state: 'relax',
			items: []
	};

	/**
	 * لود کردن داده‌های صفحه بعد
	 * 
	 * @returns promiss
	 */
	function nextPage() {
		if (ctrl.status === 'working') {
			return;
		}
		if (requests && !requests.hasMore()) {
			return;
		}
		if (requests) {
			paginatorParameter.setPage(requests.next());
		}
		// start state (device list)
		ctrl.status = 'working';
		return $usr.users(paginatorParameter)//
		.then(function(items) {
			requests = items;
			ctrl.items = ctrl.items.concat(requests.items);
			ctrl.status = 'relax';
		}, function() {
			ctrl.status = 'fail';
		});
	}

	/**
	 * تمام حالت‌های کنترل ررا بدوباره مقدار دهی می‌کند.
	 * 
	 * @returns promiss
	 */
	function reload(){
		requests = null;
		ctrl.items = [];
		return nextPage();
	}
	
	function selectUserId(user){
		$scope.$parent.setValue(user.id);
	}

	/*
	 * تمام امکاناتی که در لایه نمایش ارائه می‌شود در اینجا نام گذاری
	 * شده است.
	 */
	$scope.items = [];
	$scope.nextPage = nextPage;
	$scope.ctrl = ctrl;
	$scope.selectUserId = selectUserId;

	// Pagination
	$scope.paginatorParameter = paginatorParameter;
	$scope.reload = reload;
	$scope.sortKeys= [
		'id', 
		'login',
		'first_name',
		'last_name',
		'last_login',
		'date_joined',
		];
//	$scope.moreActions=[{
//	title: 'New user',
//	icon: 'add',
//	action: addUser
//	}];

});

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
 * @ngdoc directive
 * @name amd-infinate-scroll
 * @description Infinet scroll 
 * 
 * 
 * Manage scroll of list 
 */
.directive('amdInfinateScroll', function($parse) {
    // FIXME: maso, 2017: tipo in diractive name (infinite)
    function postLink(scope, elem, attrs) {
	// adding infinite scroll class
	elem.addClass('amd-infinate-scroll');
	elem.on('scroll', function(evt) {
	    var raw = elem[0];
	    if (raw.scrollTop + raw.offsetHeight  + 5 >= raw.scrollHeight) {
		$parse(attrs.amdInfinateScroll)(scope);
	    }
	});
	// Call the callback for the first time:
	$parse(attrs.amdInfinateScroll)(scope);
    }

    return {
	restrict : 'A',
	link : postLink
    };
});

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
 * @ngdoc directive
 * @name amd-pagination-bar
 * @property {Object}    amd-model           -Data model
 * @property {function}  amd-reload          -Reload function
 * @property {Array}     amd-sort-keys       -Array
 * @property {Array}     amd-more-actions    -Array
 * @property {string}    amd-title           -String
 * @property {string}    amd-icon            -String
 * @description Pagination bar
 * 
 * Pagination parameters are a complex data structure and it is hard to manage
 * it. This is a toolbar to manage the pagination options.
 */
.directive('amdPaginationBar', function() {

	function postLink(scope, element, attr) {

		var query = {
			sortDesc: true,
			sortBy: typeof scope.amdSortKeys === 'undefined' ? 'id' : scope.amdSortKeys[0],
			searchTerm: null
		};
		/*
		 * مرتب سازی مجدد داده‌ها بر اساس حالت فعلی 
		 */
		function reload(){
			if(!angular.isFunction(scope.amdReload)){
				return;
			}
			scope.amdReload(scope.amdModel);
		}
		/**
		 * ذخیره اطلاعات آیتم‌ها بر اساس مدل صفحه بندی
		 */
		function exportData(){
			if(!angular.isFunction(scope.amdExport)){
				return;
			}
			scope.amdExport(scope.amdModel);
		}

		function searchQuery(searchText){
			scope.amdModel.setQuery(searchText);
			scope.amdReload();
		}

		function init(){
			// Checks sort key
			if(scope.amdModel){
				// clear previous sorters
				// TODO: replace it with scope.amdModel.clearSorters() 
				scope.amdModel.sortMap = {};
				scope.amdModel.filterMap = {};
				scope.amdModel.setOrder(query.sortBy, query.sortDesc ? 'd' : 'a');
				scope.amdModel.setQuery(query.searchTerm);
			}
		}

		// configure scope:
		scope.search = searchQuery;
		scope.query=query;
		if(angular.isFunction(scope.amdReload)){
			scope.reload = reload;
		}
		if(angular.isFunction(scope.amdExport)){
			scope.exportData = exportData;
		}
		if(typeof scope.amdEnableSearch === 'undefined'){
			scope.amdEnableSearch = true;
		}
		
		scope.$watch('amdModel', function(){
			init();
		});

		scope.$watch('query', function(){
			// Reloads search
			init();
			reload();
		}, true);

	}

	return {
		restrict : 'E',
		templateUrl: 'views/directives/amd-pagination-bar.html',
		scope : {
			/*
			 * مدل صفحه بندی را تعیین می‌کند که ما اینجا دستکاری می‌کنیم. 
			 */
			amdModel : '=',
			/*
			 * تابعی را تعیین می‌کند که بعد از تغییرات باید برای مرتب سازی
			 * فراخوانی شود. معمولا بعد تغییر مدل داده‌ای این تابع فراخوانی می‌شود.
			 */
			amdReload : '=',
			/*
			 * تابعی را تعیین می‌کند که بعد از تغییرات باید برای ذخیره آیتم‌های موجود در لیست
			 * فراخوانی شود. این تابع معمولا باید بر اساس تنظیمات تعیین شده در مدل داده‌ای کلیه آیتم‌های فهرست را ذخیره کند.
			 */
			amdExport : '=',
			/*
			 * یک آرایه هست که تعیین می‌که چه کلید‌هایی برای مرتب سازی باید استفاده
			 * بشن.
			 */
			amdSortKeys: '=',
			/*
			 * فهرستی از عمل‌هایی که می‌خواهیم به این نوار ابزار اضافه کنیم
			 */
			amdMoreActions: '=',

			amdTitle: '@?',
			amdIcon: '@?',

			amdEnableSearch: '=?'
		},
		link : postLink
	};
});

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
 * @ngdoc directive
 * @name amd-preloading
 * @description Show preloading of the module
 * 
 */
.directive('amdPreloading', function($animate) {
	var PRELOAD_CLASS = 'amd-preload';
	var PRELOAD_CLASS_BOX = 'amd-preload-box';
	var PRELOAD_IN_PROGRESS_CLASS = 'amd-preload-animate';

	/*
	 * Init element for preloading 
	 */
	function initPreloading(scope, element, attr) {
		element.addClass(PRELOAD_IN_PROGRESS_CLASS);
	}

	/*
	 * Remove preloading
	 */
	function removePreloading(scope, element, attr) {
		element.removeClass(PRELOAD_CLASS_BOX);
		element.removeClass(PRELOAD_CLASS);
	}

	/*
	 * Adding preloading
	 */
	function addPreloading(scope, element, attr) {
		element.addClass(PRELOAD_CLASS_BOX);
		element.addClass(PRELOAD_CLASS);
	}

	/*
	 * Post linking
	 */
	function postLink(scope, element, attr) {
		initPreloading(scope, element, attr);
		scope.$watch(attr.amdPreloading, function(value) {
			if(!value){
				removePreloading(scope, element, attr);
			} else {
				addPreloading(scope, element, attr);
			}
		});
	}

	return {
		restrict : 'A',
		link: postLink
	};
});

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
 * @ngdoc directive
 * @name amd-style-color
 * @descritpion Manages color of an element 
 * 
 * 
 */
.directive('amdStyleColor', function ($mdTheming, $rootScope) {
	/*
	 * Apply colors
	 */
	function _apply_color($element, styleColor) {
		angular.forEach(styleColor, function(value, key){
//			var themeColors = ssSideNavSections.theme.colors;
			
			var split = (value || '').split('.')
			if (split.length < 2) {
				split.unshift('primary');
			}
			
			var hueR = split[1] || 'hue-1'; // 'hue-1'
			var colorR = split[0] || 'primary'; // 'warn'
			
			// Absolute color: 'orange'
			var theme = $mdTheming.THEMES[$rootScope.app.setting.theme];
			if(typeof theme === 'undefined'){
				// if theme is not valid we choose default theme
				theme = $mdTheming.THEMES['default'];
			}
			var colorA = theme.colors[colorR] ?  theme.colors[colorR].name : colorR;
			
			// Absolute Hue: '500'
			var hueA =  theme.colors[colorR] ? (theme.colors[colorR].hues[hueR] || hueR) : hueR;
			
			var colorValue = $mdTheming.PALETTES[colorA][hueA] ? $mdTheming.PALETTES[colorA][hueA].value : $mdTheming.PALETTES[colorA]['500'].value;
			
			$element.css(key, 'rgb(' + colorValue.join(',') + ')');
			
			// Add color to md-sidenav
			if($element.parent().attr('md-component-id')){
				$element.parent().css(key, 'rgb(' + colorValue.join(',') + ')');
			}
		});
	}
	
	/*
	 * Link function
	 */
	function linkFunction($scope, $element, $attrs) {
		// TODO: maso, 2017: check if it is possible to remvoe code in release condetion.
		if (!$mdTheming.THEMES || !$mdTheming.PALETTES) {
			return console.warn('amd-style-color: you probably want to $mdTheming');
		}
		// XXX: maso, 2017: lesson on property changes.
//		$scope.$watch($attrs.amdStyleColor, function (newVal) {
//			if (newVal) {
//				_apply_color($element, newVal);
//			}
//		});
		$rootScope.$watch('app.setting.theme', function(newVal){
			_apply_color($element, $scope.$eval($attrs.amdStyleColor));
		});
		_apply_color($element, $scope.$eval($attrs.amdStyleColor));
	}

	return {
		restrict: 'A',
//		scope: {
//		ssStyleColor: '='
//		},
		link: linkFunction
	};
});
/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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
 * @ngdoc directive
 * @name amd-titled-block
 * @descritpion Title block
 * 
 * 
 */
.directive('amdTitledBlock', function() {
	return {
		replace:true,
		restrict: 'E',
		transclude: true,
		scope: {
			amdTitle: '@?',
			amdIcon: '@?',
			amdProgress: '<?'
	    },
		templateUrl: 'views/directives/amd-titled-block.html'
	};
});
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
 * @ngdoc directive
 * @name amd-tree-heading
 * @description Tree heading
 * 
 * Display tree heading
 * 
 */
.directive('amdTreeHeading', function($animate) {
	return {
        restrict: 'E',
        replace: true,
        scope: {
            amdSection: '='
        },
		templateUrl: 'views/directives/amd-tree-heading.html',
		link: function(scope, element, attr) {
			// TODO: maso, 2017:
		},
		controller : function($scope) {
			// TODO: maso, 2017:
		}
	};
});

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
 * @ngdoc directive
 * @name amd-tree-link
 * @description Tree link
 * 
 * Display and link section item
 * 
 */
.directive('amdTreeLink', function($animate) {
	return {
		restrict : 'E',
//		replace: true,
		scope: {
			amdSection: '='
		},
		templateUrl: 'views/directives/amd-tree-link.html',
		link: function(scope, element, attr) {
			// TODO: maso, 2017:
		},
		controller : function($scope, $navigator) {
			/**
			 * Check if page is selected.
			 * 
			 * Selection is implemented in the Tree, so if the item is not placed in
			 * a tree the result is false.
			 * 
			 * @return the selection state of the page
			 * @param page address for example /user/profile
			 */
			$scope.isSelected = function(section) {
				return section && $navigator.isPageSelected(section.link);
			};

			/**
			 * Run action of section
			 */
			$scope.focusSection = function(section) {
//				$mdSidenav('left').close();
//				ssSideNavSharedService.broadcast('_SIDENAV_CLICK_ITEM', item);
				// XXX: maso, 2017: check action call
				return $navigator.openPage(section.link);
			};

//			$scope.$state = $state;
		}
	};
});

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
 * @ngdoc directive
 * @name amd-tree-toggle
 * @description Tree toggle
 * 
 * Display tree toggle
 * 
 */
.directive('amdTreeToggle', function($timeout, $animateCss, $mdSidenav, $mdMedia, $rootScope) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			amdSection: '='
		},
		templateUrl: 'views/directives/amd-tree-toggle.html',
		link: function($scope, $element, $attr, $ctrl) {
			var _el_ul = $element.find('ul');

			var getTargetHeight = function() {
				var _targetHeight;

				_el_ul.addClass('no-transition');
				_el_ul.css('height', '');

				_targetHeight = _el_ul.prop('clientHeight');

				_el_ul.css('height', 0);
				_el_ul.removeClass('no-transition');

				return _targetHeight;
			};

			if (!_el_ul) {
				return console.warn('amd-tree: `menuToggle` cannot find ul element');
			}

			
			
			function toggleMenu(open) {
//				if (!$mdMedia('gt-sm') && !$mdSidenav('left').isOpen() && open) {
//				return;
//				}
				$animateCss(_el_ul, {
					from: {
						height: open ? 0 : (getTargetHeight() + 'px')
					},
					to: {
						height: open ? (getTargetHeight() + 'px') : 0
					},
					duration: 0.3
				}).start();
			}

			$scope.$watch(function() {
				return $ctrl.isOpen($scope.amdSection);
			}, function(open) {
				$timeout(function(){
					toggleMenu(open);
				}, 0, false);
			});
		},
		controller : function($scope) {
			// Current section
			var openedSection = null;
			
			/**
			 * Check if the opened section is the section.
			 */
			function isOpen(section) {
				return openedSection === section;
			}

			/**
			 * Toggle opened section
			 * 
			 * We just put the section in the tree openedSection and update all
			 * UI.
			 */
			function toggle(section) {
                openedSection = (openedSection === section) ? null : section;
			}

			/**
			 * Checks if the section is visible
			 */
			function isVisible(section){
				if(section.hidden){
					return !$rootScope.$eval(section.hidden);
				}
				return true;
			}

			/*
			 * Init scope
			 */
			if(angular.isFunction($scope.$parent.isOpen)){
				$scope.isOpen = $scope.$parent.isOpen;
				$scope.toggle = $scope.$parent.toggle;
			} else {
				$scope.isOpen = isOpen;
				$scope.toggle = toggle;
			}
			
			this.isOpen = $scope.isOpen;
			
			$scope.isVisible = isVisible;

//			$scope.$on('SS_SIDENAV_FORCE_SELECTED_ITEM', function (event, args) {
//			if ($scope.section && $scope.section.pages) {
//			for (var i = $scope.section.pages.length - 1; i >= 0; i--) {
//			var _e = $scope.section.pages[i];
			//
//			if (args === _e.id) {
//			$scope.toggle($scope.section);
//			$state.go(_e.state);
//			}
//			};
//			}
//			});
		}
	};
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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
 * @ngdoc directives
 * @name amh-captcha
 * @description Adding captcha value
 * 
 * In some case, user must send captcha to the server fro auth. This a directive
 * to enablie captcha
 * 
 */
.directive("amhCaptcha", function() {

	/**
	 * Adding preloader.
	 * 
	 * @param scope
	 * @param element
	 * @param attr
	 * @returns
	 */
	function postLink(scope, element, attrs, ctrls) {
		var form=ctrls[0];
		var ngModel=ctrls[1];

		function validate(){
			if(form){
				form.$setValidity('captcha', scope.required === false ? null : Boolean(scope.response));
			}
		}

		function destroy() {
			if (form) {
				// reset the validity of the form if we were removed
				form.$setValidity('captcha', null);
			}
		}
		

		if(form && angular.isDefined(attrs.required)){
			scope.$watch('required', validate);
		}
		scope._response = null;
		scope.$watch('_response', function(){
			scope.response = scope._response;
		});
		scope.$watch('response', function(){
			scope._response = scope.response;
		});


	}

	return {
		restrict : 'E',
		require: ['?^^form'],
		templateUrl: 'views/directives/amh-captcha.html',
		scope: {
			response: '=?ngModel',
		},
		link: postLink
	};
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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
 * @ngdoc directives
 * @name compare-to
 * @description Compare two attrs.
 */
.directive('compareTo', function(){
	return {
		require: 'ngModel',
		scope: {
			otherModelValue: '=compareTo'
		},
		link: function(scope, element, attributes, ngModel){
			ngModel.$validators.compareTo = function(modelValue) {
				return modelValue === scope.otherModelValue;
			};

			scope.$watch('otherModelValue', function() {
				ngModel.$validate();
			});
		}
	};
});
/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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
 * @ngdoc directives
 * @name amdConfigPage
 * @description Configuaration page 
 * 
 * Configuration page
 * 
 */
.directive('amdConfigPage', function($compile, $controller, $settings, $widget, $rootScope) {


	var bodyElementSelector = 'div#amd-config-body';
	var placeholderElementSelector = 'div#amd-config-placeholder';
	/**
	 * 
	 */
	function loadPreference($scope, page, anchor) {
		// 1- create scope
		var childScope = $scope.$new(false, $scope);
		childScope.app = $rootScope.app;
		//		childScope.wbModel = model;

		// 2- create element
		$widget.getTemplateFor(page)
		.then(function(template) {
			var element = angular.element(
					'<div md-theme="{{app.setting.theme || \'default\'}}" md-theme-watch >' + template + '</div>');

			// 3- bind controller
			var link = $compile(element);
			if (angular.isDefined(page.controller)) {
				var locals = {
						$scope : childScope,
						$element : element,
						// TODO: maso, 2018: 
				};
				var controller = $controller(page.controller, locals);
				if (page.controllerAs) {
					childScope[page.controllerAs] = controller;
				}
				element.data('$ngControllerController', controller);
			}
			;

			// Load preferences
			anchor.empty();
			anchor.append(link(childScope));
		});
	}

	/**
	 * Adding preloader.
	 * 
	 * @param scope
	 * @param element
	 * @param attr
	 * @returns
	 */
	function postLink(scope, element, attr) {
		// Get Anchor
		var _anchor = element //
		.children(bodyElementSelector) //
		.children(placeholderElementSelector);
		// TODO: maso, 2018: check auncher exist
		scope.$watch('amdConfigId', function(id) {
			if (!!id) {
				$settings.config(id)
				.then(function(page) {
					loadPreference(scope, page, _anchor);
				}, function() {
					// TODO: maso, 2017: handle errors
				});
			}
		});
	}

	return {
		restrict : 'E',
		templateUrl : 'views/directives/amd-config-page.html',
		replace : true,
		scope : {
			amdConfigId : '='
		},
		link : postLink
	};
});
/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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
	 * @ngdoc directive
	 * @name amd-datepicker
	 * @descritpion Date picker
	 * 
	 * Select a date based on local.
	 * 
	 */
	.directive('amdDatepicker', function($mdUtil, $rootScope) {

		// **********************************************************
		// Private Methods
		// **********************************************************
		function postLink(scope, element, attr, ctrls) {
			scope.app = $rootScope.app;
			var ngModelCtrl = ctrls[0] || $mdUtil.fakeNgModel();

			function render() {
				var date = moment //
					.utc(ngModelCtrl.$modelValue) //
					.local();
				if (date.isValid()) {
					scope.date = date;
					return;
				}
			// TODO: maso, 2018: handle invalid date
			}

			function setValue() {
				var date = moment(scope.date) //
					.utc() //
					.format('YYYY-MM-DD HH:mm');
				ngModelCtrl.$setViewValue(date);
			}

			ngModelCtrl.$render = render;
			scope.$watch('date', setValue);
		}


		return {
			replace : false,
			templateUrl : 'views/directives/mb-datepicker.html',
			restrict : 'E',
			scope : {
				minDate : '=mdMinDate',
				maxDate : '=mdMaxDate',
			//		        placeholder: '@mdPlaceholder',
			//		        currentView: '@mdCurrentView',
			//		        dateFilter: '=mdDateFilter',
			//		        isOpen: '=?mdIsOpen',
			//		        debounceInterval: '=mdDebounceInterval',
			//		        dateLocale: '=mdDateLocale'
			},
			require : [ 'ngModel' ],
			priority : 210, // Run before ngAria
			link : postLink
		};
	});
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
 * @ngdoc directive
 * @name mb-dynamic-tabs
 * @description Display tabs dynamically
 * 
 * In some case, a dynamic tabs are required. This module add them dynamically.
 * 
 */
.directive('mbDynamicTabs', function($wbUtil, $settings, $q, $rootScope, $compile, $controller) {
	var CHILDREN_AUNCHOR = 'mb-dynamic-tabs-select-resource-children';


	/**
	 * encapsulate template srce with panel widget template.
	 * 
	 * @param page
	 *            setting page config
	 * @param tempateSrc
	 *            setting page html template
	 * @returns encapsulate html template
	 */
	function _encapsulatePanel(page, template) {
		// TODO: maso, 2017: pass all paramter to the setting
		// panel.
		return template;
	}


	function link($scope, $element, $attr) {
		// Load pages in scope
		var pages = $settings.settings();
		$scope.pages = pages;

		function loadPage(index){
			var widget = null;
			var jobs = [];
			var pages2 = [];


			// 1- Find element
			var target = $element.find('#' + CHILDREN_AUNCHOR);

			// 2- Clear childrens
			target.empty();

			// 3- load pages
			var page = pages[index];
			var template = $wbUtil.getTemplateFor(page);
			if (angular.isDefined(template)) {
				jobs.push(template.then(function(templateSrc) {
					templateSrc = _encapsulatePanel(page, templateSrc);
					var element = angular.element(templateSrc);
					var scope = $rootScope.$new(false, $scope);
					scope.page = page;
					scope.value = $scope.value;
					if (angular .isDefined(page.controller)) {
						$controller(page.controller, {
							$scope : scope,
							$element : element,
						});
					}
					$compile(element)(scope);
					pages2.push(element);
				}));
			}

			$q.all(jobs).then(function() {
				angular.forEach(pages2, function(element) {
					target.append(element);
				});
			});
		}

		$scope.$watch('pageIndex', function(value){
			if(value >= 0){
				loadPage(value);
			}
		});
	}



	return {
		restrict: 'E',
		replace: true,
		scope: {
			amdSection: '='
		},
		templateUrl: 'views/directives/mb-dynamic-tabs.html',
		link: link,
		controller : function($scope) {
			// TODO: maso, 2017:
		}
	};
});

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
 * @ngdoc directive
 * @name amd-panel
 * @restrict E
 * @scope true
 * 
 * @description A full dashboard panel
 * 
 * Dashboard needs an area to show modules, navigator, message and the other visual parts
 * of the system. This is a general dashboard panel which must be placed to the index.html
 * directly.
 * 
 * @usage
 * To load the dashboard add this directive to the index.html. All internal elements will be removed after the
 * module loaded.
 * <hljs lang="html">
 * 	<body>
 * 		<amd-panel>
 * 			<div class="amd-preloader">
 * 				Loading....
 * 			</div>
 * 		</amd-panel>
 * 	....
 * 	</body>
 * </hljs>
 * 
 */
.directive('mbPanel', function($navigator, $usr, $route, $window, $rootScope,
		$app, $translate, $http, $mdSidenav, $mdBottomSheet, $q, $widget, $controller, $compile) {


	var bodyElementSelector = 'div#mb-panel-root-ready';
	var placeholderElementSelector = 'div#mb-panel-root-ready-anchor';


	// $view service
//	function toggleRightSidebar() {
//	toggleSidebar('right');
//	}

//	function toggleSidebar(id) {
//	return $mdSidenav(id).toggle();
//	}

//	function toggleItemsList() {
//	var pending = $mdBottomSheet.hide() || $q.when(true);
//	pending.then(function() {
//	toggleSidebar('left');
//	});
//	}

	/*
	 * Load page and create an element
	 */
	function _loadPage($scope, page, prefix, postfix) {
		// 1- create scope
		var childScope = $scope.$new(false, $scope);
		childScope = Object.assign(childScope, {
			app : $rootScope.app,
			_page : page,
			_visible : function() {
				if (angular.isFunction(this._page.visible)) {
					return this._page.visible(this);
				}
				return true;
			}
		});

		// 2- create element
		return $widget.getTemplateFor(page)
		.then(function(template) {
			var element = angular.element(prefix + template + postfix);

			// 3- bind controller
			var link = $compile(element);
			if (angular.isDefined(page.controller)) {
				var locals = {
						$scope : childScope,
						$element : element,
				};
				var controller = $controller(page.controller, locals);
				if (page.controllerAs) {
					childScope[page.controllerAs] = controller;
				}
				element.data('$ngControllerController', controller);
			}
			;
			return {
				element : link(childScope),
				page : page
			};
		});
	}

	function postLink($scope, $element, $attr) {
		var _sidenaves = [];
		var _toolbars = [];

		/*
		 * Remove all sidenaves
		 */
		function _removeElements(pages, elements) {
			var cache = [];
			for(var i = 0; i < elements.length; i++){
				var flag = false;
				for(var j = 0; j < pages.length; j++){
					if(pages[j].id === elements[i].page.id) {
						flag = true;
						break;
					}
				}
				if(flag){
					elements[i].element.detach();
					elements[i].cached = true;
					cache.push(elements[i]);
				} else {
					elements[i].element.remove();
				}
			}
			return cache;
		}

		function _getSidenavElement(page){
			for(var i = 0; i < _sidenaves.length; i++){
				if(_sidenaves[i].page.id == page.id){
					return $q.when(_sidenaves[i]);
				}
			}
			return _loadPage($scope, page,
					'<md-sidenav layout="column" md-theme="{{app.setting.theme || \'default\'}}" md-theme-watch ng-show="_visible()" md-component-id="{{_page.id}}" md-is-locked-open="_page.locked && $mdMedia(\'gt-sm\')" md-whiteframe="2" ng-class="{\'md-sidenav-left\': app.dir==\'rtl\',  \'md-sidenav-right\': app.dir!=\'rtl\'}" layout="column">',
			'</md-sidenav>')
			.then(function(pageElement) {
				_sidenaves.push(pageElement);
			});
		}
		
		function _getToolbarElement(page){
			for(var i = 0; i < _toolbars.length; i++){
				if(_toolbars[i].page.id == page.id){
					return $q.when(_toolbars[i]);
				}
			}
			return _loadPage($scope, page, 
					'<md-toolbar md-theme="{{app.setting.theme || \'default\'}}" md-theme-watch layout="column" layout-gt-xs="row" layout-align="space-between stretch">', 
			'</md-toolbar>')
			.then(function(pageElement) {
				_toolbars.push(pageElement);
			});
		}

		/*
		 * reload sidenav
		 */
		function _reloadSidenavs(sidenavs) {
			_sidenaves = _removeElements(sidenavs, _sidenaves);
			var jobs = [];
			for (var i = 0; i < sidenavs.length; i++) {
				jobs.push(_getSidenavElement(sidenavs[i]));
			}
			$q.all(jobs) //
			.then(function() {
				// Get Anchor
				var _anchor = $element //
				.children(bodyElementSelector) //
				.children(placeholderElementSelector);
				for (var i = 0; i < _sidenaves.length; i++) {
					var ep = _sidenaves[i];
					if(ep.chached){
						continue;
					}
					if (ep.page.position === 'start') {
						_anchor.prepend(ep.element);
					} else {
						_anchor.append(ep.element);
					}
				}
			});
		}

		/*
		 * Reload toolbars
		 */
		function _reloadToolbars(toolbars) {
			_toolbars = _removeElements(toolbars, _toolbars);
			var jobs = [];
			for (var i = 0; i < toolbars.length; i++) {
				jobs.push(_getToolbarElement(toolbars[i]));
			}
			$q.all(jobs) //
			.then(function() {
				// Get Anchor
				var _anchor = $element //
				.children(bodyElementSelector);
				for (var i = 0; i < _toolbars.length; i++) {
					var ep = _toolbars[i];
					if(ep.chached){
						continue;
					}
					_anchor.prepend(ep.element);
				}
			});
		}

		/*
		 * Reload UI
		 * 
		 * - sidenav
		 * - toolbar
		 */
		function _reloadUi(){
			if(!$route.current){
				return;
			}
			// Sidenavs
			var sdid = $route.current.sidenavs || ['navigator'];
			sdid.push('settings');
			sdid.push('help');
			if(angular.isArray(sdid)){
				var sd =[];
				var jobs = [];
				angular.forEach(sdid, function(item){
					jobs.push($app.sidenav(item)
							.then(function(sidenav){
								sd.push(sidenav);
							}));
				});
				$q.all(jobs)
				.then(function(){
					_reloadSidenavs(sd);
				});
			}
			// Toolbars
			var tids = $route.current.toolbars || ['dashboard'];
			if(angular.isArray(tids)){
				var ts = [];
				var jobs = [];
				angular.forEach(tids, function(item){
					jobs.push($app.toolbar(item)
							.then(function(toolbar){
								ts.push(toolbar);
							}));
				});
				$q.all(jobs)
				.then(function(){
					_reloadToolbars(ts);
				});
			}
		}

//		_reloadUi();
		$scope.$watch(function(){
			return $route.current;
		}, _reloadUi);
	}


	return {
		restrict : 'E',
		replace : true,
		templateUrl : 'views/directives/mb-panel.html',
		link : postLink
	};
});
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
 * @ngdoc directive
 * @name amd-tree
 * @description Tree
 * 
 * Display tree menu
 * 
 */
.directive('mbTree', function($animate, $rootScope) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			mbSection: '='
		},
		templateUrl: 'views/directives/mb-tree.html',
		link: function(scope, element, attr) {
			// TODO: maso, 2017:
		},
		controller : function($scope) {
			// Current section
			var openedSection = null;

			/**
			 * Checks if the section is visible
			 */
			function isVisible(section){
				if(section.hidden){
					return !$rootScope.$eval(section.hidden);
				}
				return true;
			}

			/**
			 * Check if the opened section is the section.
			 */
			function isOpen(section) {
				return openedSection === section;
			}

			/**
			 * Toggle opened section
			 * 
			 * We just put the section in the tree openedSection and update all
			 * UI.
			 */
			function toggle(section) {
				openedSection = (openedSection === section) ? null : section;
			}

			$scope.isOpen = isOpen;
			$scope.toggle = toggle;
			$scope.isVisible = isVisible;
		}
	};
});

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
 * @ngdoc directive
 * @name mb-navigation-path
 * @description Display current navigation path of system
 * 
 * Navigation path is a menu which is updated by the $navigation service. This menu
 * show a chain of menu items to show the current path of the system. It is very
 * usefull to show current path to the users.
 * 
 * 
 */
.directive('mbNavigationBar' , function($menu) {

	return {
		restrict : 'E',
		replace: false,
		templateUrl: 'views/directives/mb-navigation-bar.html',
		link: postLink
	};

	/**
	 * Init the bar
	 */
	function postLink(scope, element, attr) {
		/*
		 * maso, 2017: Get navigation path menu. See $navigator.scpoePath for more info
		 */
		scope.pathMenu = $menu.menu('navigationPathMenu');
	}
});

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
 * @ngdoc directive
 * @name mb-user-menu
 * @restrict E
 * @description Display global user menu
 * 
 * Load current user action into the scope. It is used to show user menu
 * in several parts of the system.
 */
.directive('mbUserMenu', function($menu, $app, $mdSidenav) {
	/**
	 * Post link 
	 */
	function postLink($scope, $element, $attr) {
		// maso, 2017: Get user menu
		$scope.menu = $menu.menu('mb.user');
		$scope.logout = $app.logout;
		$scope.settings = function(){
			return $mdSidenav('settings').toggle();
		}
	}
	
	return {
		restrict: 'E',
		replace: true,
		scope: true,
		templateUrl: 'views/directives/mb-user-menu.html',
		link: postLink,
		controller : 'MbAccountCtrl'
	};
});

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
 * @ngdoc directive
 * @name mb-user-toolbar
 * @description User toolbar
 * 
 * Display tree menu
 * 
 */
.directive('mbUserToolbar', function($animate) {
	return {
		restrict: 'E',
		replace: true,
//		scope: {
//			amdActions: '='
//		},
		templateUrl: 'views/directives/mb-user-toolbar.html',
		link: function($scope, $element, $attr, $ctrl) {
			// TODO: maso, 2017:
		},
		controller : 'MbAccountCtrl'
	};
});

/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
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
	 * @ngdoc filter
	 * @name amddate
	 * @description # Format date
	 */
	.filter('amddate', function($rootScope) {
		return function(inputDate, format) {
			try {
				var mf = format || $rootScope.app.setting.dateFormat || $rootScope.app.config.dateFormat;
				if($rootScope.app.calendar !== 'Jalaali'){
					mf = mf.replace('j', '');
				}
				var date = moment //
					.utc(inputDate) //
					.local();
				return date.format(mf);
			} catch (ex) {
				return '-' + ex.message;
			}
		};
	});
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
 * دریچه‌های محاوره‌ای
 */
.run(function($navigator, $mdToast) {
	// TODO:

	/**
	 * The alert() method displays an alert box with a specified message and an
	 * OK button.
	 * 
	 * An alert box is often used if you want to make sure information comes
	 * through to the user.
	 * 
	 * Note: The alert box takes the focus away from the current window, and
	 * forces the browser to read the message. Do not overuse this method, as it
	 * prevents the user from accessing other parts of the page until the box is
	 * closed.
	 * 
	 * @param String
	 *                message Optional. Specifies the text to display in the
	 *                alert box, or an object converted into a string and
	 *                displayed
	 */
	window.alert = function(message) {
		return $navigator.openDialog({
			templateUrl : 'views/dialogs/amd-alert.html',
			config : {
				message : message
			}
		});
	};

	/**
	 * The confirm() method displays a dialog box with a specified message,
	 * along with an OK and a Cancel button.
	 * 
	 * A confirm box is often used if you want the user to verify or accept
	 * something.
	 * 
	 * Note: The confirm box takes the focus away from the current window, and
	 * forces the browser to read the message. Do not overuse this method, as it
	 * prevents the user from accessing other parts of the page until the box is
	 * closed.
	 * 
	 * The confirm() method returns true if the user clicked "OK", and false
	 * otherwise.
	 * 
	 * @param String
	 *                message Optional. Specifies the text to display in the
	 *                confirm box
	 */
	window.confirm = function(message) {
		// XXX: maso, 1395: wait for response (sync method)
		return $navigator.openDialog({
			templateUrl : 'views/dialogs/amd-confirm.html',
			config : {
				message : message
			}
		});
	};

	/**
	 * The prompt() method displays a dialog box that prompts the visitor for
	 * input.
	 * 
	 * A prompt box is often used if you want the user to input a value before
	 * entering a page.
	 * 
	 * Note: When a prompt box pops up, the user will have to click either "OK"
	 * or "Cancel" to proceed after entering an input value. Do not overuse this
	 * method, as it prevent the user from accessing other parts of the page
	 * until the box is closed.
	 * 
	 * The prompt() method returns the input value if the user clicks "OK". If
	 * the user clicks "cancel" the method returns null.
	 * 
	 * @param String
	 *                text Required. The text to display in the dialog box
	 * @param String
	 *                defaultText Optional. The default input text
	 */
	window.prompt = function(text, defaultText) {
		// XXX: maso, 1395: wait for response (sync method)
		return $navigator.openDialog({
			templateUrl : 'views/dialogs/amd-prompt.html',
			config : {
				message : text,
				model : defaultText
			}
		});
	};

	/*
	 * FIXME: maso, 2017: add document
	 */
	window.toast = function (text){
		var toast = text;
		if(angular.isString(text)){
			var toast = $mdToast.simple()
				.textContent(text)
				.position("bottom right")
				.hideDelay(3000);
		}
		return $mdToast.show(toast);
	};
});
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
 * دریچه‌های محاوره‌ای
 */
.run(function($app, $rootScope, $navigator, $route, $mdSidenav) {
	$app.getToolbarMenu()//
	.item({
		priority : 15,
		icon : 'settings',
		label : 'Preferences',
		tooltip : 'Open preferences panel',
		visible : function(){
			return $rootScope.app.user.owner;
		},
		active : function(){
			return $navigator.openPage('/preferences');
		}
	})
	.item({ // help
		priority : 15,
		icon : 'help',
		label : 'Help',
		tooltip : 'Display help in sidenav',
		visible : function(){
			return !!$route.current.helpId;
		},
		active : function(){
//			return $mdSidenav('help');
			$rootScope.showHelp = !$rootScope.showHelp;
			if($rootScope.showHelp){
				return $mdSidenav('help').toggle();
			}
		}
	});
	
	$app.newToolbar({
		id : 'dashboard',
		title : 'Dashboard toolbar',
		description : 'Main dashboard toolbar',
		controller: 'MbToolbarDashboardCtrl',
		templateUrl : 'views/toolbars/mb-dashboard.html',
	});
	
	$app.newSidenav({
		id : 'navigator',
		title : 'Navigator',
		description : 'Navigate all path and routs of the pandel',
		controller: 'AmdNavigatorCtrl',
		templateUrl : 'views/sidenavs/mb-navigator.html',
		locked : true,
		position : 'start',
	});
	$app.newSidenav({
		id : 'help',
		title : 'Help',
		description : 'System online help',
		controller : 'AmdHelpCtrl',
		templateUrl : 'views/sidenavs/mb-help.html',
		locked : true,
		visible : function() {
			return $rootScope.showHelp;
		},
		position : 'end'
	});
	$app.newSidenav({
		id : 'settings',
		title : 'Settings',
		description : 'User settings',
//		controller : 'AvaHelpCtrl',
		templateUrl : 'views/sidenavs/mb-settings.html',
		locked : false,
//		visible : function($scope) {
//			return $scope.showHelp;
//		},
		position : 'end'
	});
});
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
	 * دریچه‌های محاوره‌ای
	 */
	.run(function(appcache, $window) {
		// Check update
		appcache.checkUpdate() //
			.then(function() {
				appcache.swapCache();
				return confirm('app.update.message')
			}) //
			.then(function() {
				$window.location.reload();
			});
	});
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
/*
 * 
 */
.run(function($rootScope, $saas) {
	$rootScope.app.captcha ={};
	$saas.setting('captcha.engine')
	.then(function(setting){
		$rootScope.app.captcha.engine = setting.value;
		if(setting.value === 'recaptcha'){
			$rootScope.app.captcha.recaptcha = {};
			// maso,2018: get publick key form server
			$saas.setting('captcha.engine.recaptcha.key')
			.then(function(pk){
				$rootScope.app.captcha.recaptcha.key = pk.value;
			});
		}
	});
});
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
//
.run(function($window, $rootScope, $location, $app) {
    if ($window.ga) {
	// initialise google analytics
	$rootScope.$watch('app.config.googleAnalytic.property', function(value){
	    if (!value) {
		return;
	    }
	    $window.ga('create', value, 'auto');
	    // track pageview on state change
	    $rootScope.$on('$routeChangeStart', function(/* event */) {
		$window.ga('send', 'pageview', $location.path());
	    });
	});
    }
});
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
 * دریچه‌های محاوره‌ای
 */
.run(function($resource) {
	$resource.newPage({
		label: 'User id',
		type: 'userid',
		templateUrl: 'views/resources/amd-user.html',
//		controller: 'AmWbSeenSelectContentsCtrl',
		tags: ['userId']
	});
	$resource.newPage({
		label: 'User id list',
		type:'useridlist',
		templateUrl: 'views/resources/amd-users-list.html',
		controller: 'AmdUsersResourceCtrl',
		tags: ['userId']
	});
	$resource.newPage({
		label: 'Group id',
		type:'groupid',
		templateUrl: 'views/resources/amd-group.html',
//		controller: 'AmdGroupsResourceCtrl',
		tags: ['groupId']
	});
	$resource.newPage({
		label: 'Group id list',
		type:'groupidlist',
		templateUrl: 'views/resources/amd-groups-list.html',
		controller: 'AmdGroupsResourceCtrl',
		tags: ['groupId']
	});
	$resource.newPage({
		label: 'Role id',
		type:'roleid',
		templateUrl: 'views/resources/amd-role.html',
//		controller: 'AmdRolesResourceCtrl',
		tags: ['roleId']
	});
	$resource.newPage({
		label: 'Role id list',
		type:'roleidlist',
		templateUrl: 'views/resources/amd-roles-list.html',
		controller: 'AmdRolesResourceCtrl',
		tags: ['roleId']
	});
});
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
 * دریچه‌های محاوره‌ای
 */
.run(function($settings) {
	// Pages
	$settings
	.newConfig({
		id : 'local',
		title : 'local',
		description : 'manage dashboard locality and language.',
		templateUrl : 'views/preferences/md-local.html',
		controller : 'settingsLocalCtrl',
		icon : 'language',
		tags : [ 'local', 'language' ],
	})//
	.newConfig({
		id : 'brand',
		title : 'Branding',
		description : 'Manage application branding such as title, logo and descritpions.',
		templateUrl : 'views/preferences/md-brand.html',
		controller : 'settingsBrandCtrl',
		icon : 'copyright',
		tags : [ 'brand' ],
	})//
	.newConfig({
		id : 'google-analytic',
		title : 'Google Analytic',
		templateUrl : 'views/preferences/mb-google-analytic.html',
		description : 'Enable google analytic for your application.',
		icon : 'timeline',
		tags : [ 'analysis' ],
	});
	
	// Settings
	$settings.newSetting({
		title: 'Local',
		templateUrl: 'views/settings/mb-local.html',
		tags: ['local']
	});
	$settings.newSetting({
		title: 'Theme',
		templateUrl: 'views/settings/mb-theme.html',
		tags: ['theme']
	});
});
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
 * حالت امنیتی را بررسی می‌کند
 * 
 * در صورتی که یک حالت حالتی امن باشد، و کاربر وارد سیستم نشده باشد، حالت ماشین
 * را به حالت لاگین می‌برد.
 */
.run(function($rootScope, $localStorage) {
	$rootScope.app.setting = $localStorage.$default({
		dashboardModel : {}
	});
});
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
angular.module('mblowfish-core') //

/**
 * @ngdoc service
 * @name $app
 * @description Application manager
 * 
 * You can access app in view.
 * 
 * ## settings
 * 
 * Settings are stored in the local storage and each user can edit it directly.
 * 
 * ## configurations
 * 
 * Configuration is stored on server an owners are allowed to update. Do not store
 * secure properties on configuration.
 * 
 * @property {object}  app  - Application repository.
 * @property {string}  app.dir  - Application direction which is updated automatically baed on configuaration and setting.
 * @property {object}  app.setting  - Application setting.
 * @property {object}  app.config  - Application setting.
 * 
 */
.service('$app', function($rootScope, $usr, $monitor, $menu, $q, $cms, $translate, $mdDateLocale) {

	var APP_PREFIX = 'angular-material-blowfish-';
	var APP_CNF_MIMETYPE = 'application/amd-cnf';
	var app = {
			state : {
				// loading, fail, ready, error
				status : 'loading',
				stage : 'starting',
				message : null
			},
			logs : [],
			user : {
				current : {},
				anonymous : true,
				administrator : false,
				owner : false,
				member : false,
				authorized : false
			},
			config : {},
			jobs : [],
			setting:{}
	};

	/*
	 * متغیرهای مدیریت تنظیم‌ها
	 * 
	 * زمانی که عملی روی تنظیم‌ها در جریان است قفل فعال می‌شود تا از انجام
	 * کارهای تکراری جلوگیری کنیم.
	 * 
	 * در صورتی که یک پردازش متغیری را تغییر دهد پرچم داده‌های کثیف فعال می‌شود
	 * تا پردازشی که در حال ذخیره سازی است ذخیره کردن داده‌های جدید را هم انجام
	 * دهد.
	 */
	var appConfigLock = false;
	var appConfigDirty = false;

	/*
	 * شنود تغییرهای تنظیمات
	 */
	$rootScope.$watch('app.config', function() {
		if (!app.user.owner) {
			return;
		}
		appConfigDirty = true;
		if (appConfigLock) {
			return;
		}
		return storeApplicationConfig();
	}, true);

	/*
	 * watch direction and update app.dir
	 */
	$rootScope.$watch(function() {
		return app.setting.dir || app.config.dir;
	}, function(value) {
		app.dir = (app.setting.dir || app.config.dir);
	});
	
	/*
	 * watch local
	 */
	$rootScope.$watch(function(){
		return app.setting.local || app.config.local || 'en';
	}, function(key){
		// 0- set app local
		app.local = key;
		
		// 1- change language
		$translate.use(key);
		// 2- chnage date format
	    // Change moment's locale so the 'L'-format is adjusted.
	    // For example the 'L'-format is DD-MM-YYYY for Dutch
		moment.loadPersian();
	    moment.locale(key);

	    // Set month and week names for the general $mdDateLocale service
	    var localeDate = moment.localeData();
	    $mdDateLocale.months      = localeDate._months;
	    $mdDateLocale.shortMonths = localeDate._monthsShort;
	    $mdDateLocale.days        = localeDate._weekdays;
	    $mdDateLocale.shortDays   = localeDate._weekdaysMin;
	    // Optionaly let the week start on the day as defined by moment's locale data
	    $mdDateLocale.firstDayOfWeek = localeDate._week.dow;
	});
	
	/*
	 * watch calendar
	 * 
	 */
	$rootScope.$watch(function(){
		return app.setting.calendar || app.config.calendar || 'Gregorian';
	}, function(key){
		// 0- set app local
		app.calendar = key;
	});
	
	
	/**
	 * خصوصیت را از تنظیم‌ها تعیین می‌کند
	 * 
	 * خصوصیت تعیین شده را از تنظیم‌های سیستم برمی‌گرداند در صورتی که مقدار
	 * تعیین شده وجود نداشته باشد، مقدار پیش فرض را به عنوان نتیجه برمی‌گرداند
	 * 
	 * @param key
	 * @param defaultValue
	 * @returns promiss
	 */
	function getApplicationConfig(key, defaultValue) {
		return $q.when(app.config[key] || defaultValue);
	}

	function setConfig(key, value){
		return $timeout(function() {
			return app.config[key] = value;
		}, 1);
	}
	
	/**
	 * تنظیم‌های نرم افزار را لود می‌کند.
	 * 
	 * @returns promiss
	 */
	function loadApplicationConfig() {
		_loadingLog('loading configuration', 'fetch configuration document');
		return $cms.content(APP_PREFIX + app.key) //
		.then(function(content) {
			app._acc = content;
			app.initial = false;
			_loadingLog('loading configuration', 'fetch configuration content');
			return app._acc.value();
		}, function(error) {
			if(error.status && error.status == '404'){
				app.initial = true;
			}
			return {};
		}) //
		.then(function(appConfig) {
			app.config = appConfig;
			_loadingLog('loading configuration', 'application configuration loaded successfully');
		}) //
		.catch(function(error) {
			_loadingLog('loading configuration', 'warning: ' + error.message);
		});
	}

	/**
	 * تنظیم‌های نرم افزار را ذخیره می‌کند.
	 * 
	 * @returns promiss
	 */
	function storeApplicationConfig() {
		if (!app.user.owner || appConfigLock) {
			var message = 'fail';
			var deferred = $q.defer();
			deferred.reject({
				data : {
					message : message
				}
			});
			return deferred.promise;
		}
		appConfigLock = true;
		var prommise;
		if (app._acc) { // content loaded
			appConfigDirty = false;
			prommise = app._acc.setValue(app.config);
		} else { // create content
			prommise = $cms.newContent({
				name : APP_PREFIX + app.key,
				mimetype : APP_CNF_MIMETYPE
			}) //
			.then(function(content) {
				appConfigDirty = false;
				app._acc = content;
				return app._acc.setValue(app.config);
			});
		} //
		return prommise //
		.finally(function() {
			appConfigLock = false;
			if (appConfigDirty) {
				storeApplicationConfig();
			}
		});
	}
	/**
	 * مقدار تنظیم‌ها را بازیابی می‌کند.
	 * 
	 * @param key
	 * @param defaultValue
	 * @returns promiss
	 */
	function setting(key, defaultValue) {
		var deferred = $q.defer();
		if (key in $rootScope.app.setting) {
			deferred.resolve($rootScope.app.setting[key]);
		} else {
			deferred.resolve(defaultValue);
		}
		return deferred.promise;
	}

	/**
	 * مقدار جدید را تعیین می‌کند.
	 * 
	 * @param key
	 * @param value
	 * @returns promiss
	 */
	function setSetting(key, value) {
		var deferred = $q.defer();
		$rootScope.app.setting[key] = value;
		deferred.resolve(value);
		return deferred.promise;
	}

	/**
	 * اطلاعات کاربر جاری را تعیین می‌کند.
	 * 
	 * @returns promiss
	 */
	function currentUser() {
		return $usr.session();
	}

	/**
	 * بی هویت بودن کاربر جاری را تعیین می‌کند
	 * 
	 * @returns promiss
	 */
	function isAnonymous() {
		var deferred = $q.defer();
		deferred.resolve(app.user.anonymous);
		return deferred.promise;
	}

	/**
	 * مالک بودن کاربر جاری را تعیین می‌کند
	 * 
	 * @returns promiss
	 */
	function isOwner() {
		var deferred = $q.defer();
		deferred.resolve(app.user.owner);
		return deferred.promise;
	}

	/**
	 * عضو بودن کاربر جاری را تعیین می‌کند
	 * 
	 * @returns promiss
	 */
	function isMember() {
		var deferred = $q.defer();
		deferred.resolve(app.user.member);
		return deferred.promise;
	}

	/**
	 * مجاز بودن کاربر جاری را تعیین می‌کند
	 * 
	 * @returns promiss
	 */
	function isAuthorized() {
		var deferred = $q.defer();
		deferred.resolve(authorized);
		return deferred.promise;
	}

	/**
	 * ورود به سیستم
	 * 
	 * <pre><code>
	 * $app.login({
	 *     login : 'user name',
	 *     password : 'password'
	 * }).then(function(user) {
	 *     //Success
	 *     }, function(ex) {
	 * 	//Fail
	 *     });
	 * </code></pre>
	 * 
	 * @memberof $app
	 * @param {object}
	 *                credential پارارمترهای مورد انتظار در احراز اصالت
	 * @return {promise(PUser)} اطلاعات کاربر جاری
	 */
	function login(credential) {
		return $usr.login(credential) //
		.then(loadUserProperty)//
		.then(_updateApplicationState);
	}

	/**
	 * عمل خروج کاربر
	 * 
	 * کاربر را از سیستم خارج کرده و اصلاعات آن را در سیستم به روز می‌کند.
	 * 
	 * @memberof $app
	 * @returns {Promise<PUser>} کاربر جاری
	 */
	function logout() {
		return $usr.logout() //
		.then(loadUserProperty)//
		.then(_updateApplicationState);
	}

	/*
	 * اطلاعات کاربر جاری را لود می‌کند
	 * 
	 * اطلاعات کاربر جاری از سرور دریافت شده و بر اساس اطلاعات مورد نیاز در سطح
	 * نرم افزار پر می‌شود.
	 * 
	 */
	function loadUserProperty() {
		_loadingLog('loading user info', 'fetch user information');
		return $usr.session() //
		.then(function(user) {
			// app user date
			app.user.current = user;
			app.user.administrator = user.isAdministrator();
			app.user.anonymous = user.isAnonymous();
			_loadingLog('loading user info', 'user information loaded successfully');

			_loadingLog('loading user info', 'check user permissions');
			return $monitor //
			.monitor('user', 'owner') //
			.then(function(monitor) {
				return monitor.refresh();
			}) //
			.then(function(monitor) {
				app.user.owner = monitor.value;
			});
		}, function(error) {
			_loadingLog('loading user info', 'warning: ' + error.message);
		});
	}

	/*
	 * Attaches loading logs
	 */
	function _loadingLog(stage, message) {
		app.state.stage = stage;
		app.state.message = message;
		if (message) {
			app.logs.push(message);
		}
	}
	
	/*
	 * Attache error logs
	 */
	function _loadingError(error) {
		app.state.status = 'fail';
		_loadingLog(error.message);
	}

	/*
	 * Check system values and update application state
	 * 
	 * Possible states:
	 * - loading
	 * - ready
	 * - anonymous
	 * - fail
	 * 
	 */
	function _updateApplicationState(){
		if(app.state.status === 'fail'){
			return;
		}
		if(app.user.anonymous){
			app.state.status = 'anonymous';
			return;
		}
		app.state.status = 'ready';
	}
	
	/**
	 * Starts the application 
	 * 
	 * قبل از اینکه هرکاری توی سیستم انجام بدید باید نرم افزار رو اجرا کنید در
	 * غیر این صورت هیچ یک از خصوصیت‌هایی که برای نرم افزار تعیین کرده‌اید
	 * بارگذاری نخواهد شد. هر نرم افزار باید یک کلید منحصر به فرد داشده باشد تا
	 * بتوان تنظیم‌های آن را به صورت یکتا ذخیره و بازیابی کنیم.
	 * 
	 * @note بهتر است برای هر نسخه یک کلید منحصر به فرد داشته باشید.
	 * 
	 * @memberof $app
	 * @param key application key
	 * @returns promiss
	 */
	function start(key) {
		app.state.status = 'loading';
		_loadingLog('starting application', 'loading application');
		app.key = key;
		// application jobs
		var jobs = [];
		jobs.push(loadUserProperty());
		jobs.push(loadApplicationConfig());
		return $q.all(jobs) //
		// FIXME: maso, 2018: run user defined jobs after all application jobs
//		.then(function(){
//			return $q.all(userJobs);
//		})
		.then(_updateApplicationState)
		.catch(function() {
			// TODO: hadi 1396-12-10: check network connection error.
		}) //
		.finally(function() {
			if (app.state.status !== 'fail') {
				_loadingLog('starting application', 'application is started successfully');
			}
		});
	}

	/**
	 * Isolated menu of the scope
	 * 
	 * به صورت پیش فرض برای هر اسکوپ یک منو در نظر گرفته می‌شه که توی منوی
	 * کاربری نمایش داده می‌شه.
	 * 
	 * این فراخوانی منوی معادل با اسکپ رو تعیین می‌کند.
	 * 
	 * در صورتی که اسکپ از بین بره، منوی معادل با اون هم خالی می‌شه.
	 * 
	 * @memberof $app
	 * @param scope
	 * @returns promiss
	 */
	function scopeMenu(scope) {
		scope.$on('$destroy', function() {
			$menu.menu('scopeMenu') //
			.clear();
		});
		function tempMenu() {
			this.add = function(menu) {
				$menu.addItem('scopeMenu', menu);
				return this;
			}
		}
		return new tempMenu();
	}

	/**
	 * Returns scope menu.
	 * 
	 * @returns promiss
	 */
	function getScopeMenu() {
		return $menu.menu('scopeMenu');
	}

	/**
	 * Return menu related to the current user
	 * 
	 * @memberof $app
	 * @return {Menu} of the user
	 */
	function userMenu(){
		return $menu.menu('userMenu');
	}
	
	/**
	 * Get public menu
	 * 
	 * @memberof $app
	 * @return {Menu} a menu of public usage
	 */
	function publicMenu(){
		return $menu.menu('publicMenu');
	}
	
	/**
	 * Get location menu
	 * 
	 * @memberof $app
	 * @return {Menu} a menu of locations
	 */
	function locationMenu(){
		return $menu.menu('locationMenu');
	}
	
	/**
	 * Returns toolbar menu.
	 * 
	 * @returns promiss
	 */
	function getToolbarMenu() {
		return $menu.menu('amd.toolbars.main.menu');
	}
	
	var _toolbars = [];

	/**
	 * Get list of all toolbars
	 * 
	 * @memberof $app
	 * @return promiss
	 */
	function toolbars(){
		return $q.when({
			items: _toolbars
		});
	}
	
	/**
	 * Add new toolbar
	 * 
	 * @memberof $app
	 * @return promiss
	 */
	function newToolbar(toolbar){
		_toolbars.push(toolbar);
	}
	
	/**
	 * Get a toolbar by id
	 * 
	 * @memberof $app
	 * @return promiss
	 */
	function toolbar(id){
		for(var i = 0; i < _toolbars.length; i++){
			if(_toolbars[i].id === id){
				return $q.when(_toolbars[i]);
			}
		}
		return $q.reject('Toolbar not found');
	}
	
	var _sidenavs = [];
	
	/**
	 * Get list of all sidenavs
	 * 
	 * @memberof $app
	 * @return promiss
	 */
	function sidenavs(){
		return $q.when({
			items: _sidenavs
		});
	}
	
	/**
	 * Add new sidenav
	 * 
	 * @memberof $app
	 * @return promiss
	 */
	function newSidenav(sidenav){
		_sidenavs.push(sidenav);
	}
	
	/**
	 * Get a sidnav by id
	 * 
	 * @memberof $app
	 * @return promiss
	 */
	function sidenav(id){
		for(var i = 0; i < _sidenavs.length; i++){
			if(_sidenavs[i].id === id){
				return $q.when(_sidenavs[i]);
			}
		}
		return $q.reject('Sidenav not found');
	}
	
	$rootScope.app = app;

	var apps = {};
	// Init
	apps.start = start;
	
	// user management
	apps.login = login;
	apps.logout = logout;
	apps.currentUser = currentUser;
	apps.isAnonymous = isAnonymous;
	apps.isOwner = isOwner;
	apps.isMember = isMember;
	apps.isAuthorized = isAuthorized;

	// Configuaration
	apps.config = getApplicationConfig;
	apps.setConfig = setConfig;
	apps.loadConfig = loadApplicationConfig; // deprecated
	apps.storeConfig = storeApplicationConfig; // deprecated
	apps.setting = setting;
	apps.setSetting = setSetting;
	
	// toolbars
	apps.toolbars = toolbars;
	apps.newToolbar = newToolbar;
	apps.toolbar = toolbar;
	
	// sidenav
	apps.sidenavs = sidenavs;
	apps.newSidenav = newSidenav;
	apps.sidenav = sidenav;

	apps.getToolbarMenu = getToolbarMenu;
	apps.getScopeMenu = getScopeMenu;
	apps.scopeMenu = scopeMenu;
	
	apps.publicMenu = publicMenu;
	apps.userMenu = userMenu;
	apps.locationMenu = locationMenu;
	
	return apps;
});
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
 * 
 * @description A default system navigator
 * 
 * 
 * 
 */
.service('$amdExport', function(FileSaver, $q, PaginatorParameter) {

	/**
	 * 
	 * @param findMethod
	 * @param paginationParams
	 * @param type
	 * @param name
	 * @returns
	 */
	function exportList(objectRef, findMethod, paginatorParameter, type, name) {
		var params = new PaginatorParameter();
		// TODO: maso, 2017: adding funnction to clone params
		//
		// Example: params = new PaginatorParameter(old);
		params.put('_px_q ', paginatorParameter.get('_px_q'));
		params.put('_px_sk ', paginatorParameter.get('_px_sk'));
		params.put('_px_so ', paginatorParameter.get('_px_so'));
		params.put('_px_fk ', paginatorParameter.get('_px_fk'));
		params.put('_px_fv ', paginatorParameter.get('_px_fv'));
		params.setPage(0);

		var dataString = '';
		var attrs;

		function toString(response) {
			var str = '';
			angular.forEach(response.items, function(item) {
				var line = '';
				angular.forEach(attrs, function(key) {
					line = line + (item[key] || ' ') + ',';
				});
				str = str + line.slice(0, -1) + '\n';
			});
			return str;
		}

		/*
		 * Load page
		 */
		function storeData(response) {
			// save  result
			dataString = dataString + toString(response);
			if (!response.hasMore()) {
				var data = new Blob([ dataString ], {
					type : 'text/plain;charset=utf-8'
				});
				return FileSaver.saveAs(data, name + '.' + type);
			}
			params.setPage(response.next());
			return findMethod.apply(objectRef, [ params ]) //
			.then(storeData);
		}

		return findMethod.apply(objectRef, [ params ])
		.then(function(response) {
			// initial list of fields to save
			if (!attrs) {
				var keys = Object.keys(response.items[0]);
				attrs = [];
				angular.forEach(keys, function(key) {
					if (!(angular.isFunction(response.items[0][key]) || angular.isObject(response.items[0][key]))) {
						attrs.push(key);
					}
				});
			}
			// first line of result file (titles of columns)
			var keysStr = '';
			angular.forEach(attrs, function(key) {
				keysStr = keysStr + key + ',';
			});

			dataString = keysStr.slice(0, -1) + '\n';
			return storeData(response);
		});
	}

	return {
		'list' : exportList
	};
});
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
 * @name $help
 * @description A simple help module
 * 
 * Manage application help.
 * 
 */
.service('$help', function($q, $navigator) {

	var _tips = [];

	/**
	 * Adds new tip
	 * 
	 * New tip is added into the tips list.
	 * 
	 * @memberof $help
	 * @param {object} tipData - Data of a tipe
	 * @return {$help} for chaine mode
	 */
	function tip(tipData){
		_tips.push(tipData);
		return this;
	}
	
	/**
	 * List of tips
	 * 
	 * @memberof $help
	 * @return {promise<Array>} of tips
	 */
	function tips(){
		return $q.resolve({
			items: _tips
		});
	}
	
	/*
	 * Service struct
	 */
	return {
		tip: tip,
		tips: tips,
	};
});

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
.service('$navigator', function($q, $route, $mdDialog, $location, $window, $menu) {

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
	 * config is bind into the template automaticly.
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
			fullscreen: true
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
	function openPage(page){
		//TODO: support page parameters
		if(page && page.toLowerCase().startsWith("http")){
			$window.open(page);
		}
		$location.path(page);
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
	
	/**
	 * Set navigation path
	 * 
	 * A navigation path is a list of path item (link and title) to show in
	 * navigation bar. Controllers are free to set navigation path. The path
	 * will be drup by the controller distraction.
	 * 
	 * @return Menu to add path items
	 */
	function scopePath(scope){
		scope.$on('$destroy', function() {
			$menu //
			.menu('navigationPathMenu')//
			.clear();
		});
		function tempMenu() {
			this.add = function(menu) {
				$menu.addItem('navigationPathMenu', menu);
				return this;
			}
			this.clear = function(){
				$menu//
				.menu('navigationPathMenu')//
				.clear();
				return this;
			}
		}
		return new tempMenu();
	}

	return {
		loadAllItems : loadAllItems,
		openDialog : openDialog,
		openPage: openPage,
		isPageSelected: isPageSelected,
		scopePath: scopePath,
		// Itmes
		items : items,
		newItem: newItem,
		// Group
		groups: groups,
		newGroup: newGroup,
		group: group
	};
});

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
 * @name $notification
 * @description A default system navigator
 * 
 * 
 * 
 */
.service('$notification', function($navigator, $mdToast) {

	/**
	 * The alert() method displays an alert box with a specified message and an
	 * OK button.
	 * 
	 * An alert box is often used if you want to make sure information comes
	 * through to the user.
	 * 
	 * Note: The alert box takes the focus away from the current window, and
	 * forces the browser to read the message. Do not overuse this method, as it
	 * prevents the user from accessing other parts of the page until the box is
	 * closed.
	 * 
	 * @param String
	 *                message Optional. Specifies the text to display in the
	 *                alert box, or an object converted into a string and
	 *                displayed
	 */
	function alert(message) {
		return $navigator.openDialog({
			templateUrl : 'views/dialogs/amh-alert.html',
			config : {
				message : message
			}
		});
	};

	/**
	 * The confirm() method displays a dialog box with a specified message,
	 * along with an OK and a Cancel button.
	 * 
	 * A confirm box is often used if you want the user to verify or accept
	 * something.
	 * 
	 * Note: The confirm box takes the focus away from the current window, and
	 * forces the browser to read the message. Do not overuse this method, as it
	 * prevents the user from accessing other parts of the page until the box is
	 * closed.
	 * 
	 * The confirm() method returns true if the user clicked "OK", and false
	 * otherwise.
	 * 
	 * @param String
	 *                message Optional. Specifies the text to display in the
	 *                confirm box
	 */
	function confirm(message) {
		// XXX: maso, 1395: wait for response (sync method)
		return $navigator.openDialog({
			templateUrl : 'views/dialogs/amh-confirm.html',
			config : {
				message : message
			}
		});
	};

	/**
	 * The prompt() method displays a dialog box that prompts the visitor for
	 * input.
	 * 
	 * A prompt box is often used if you want the user to input a value before
	 * entering a page.
	 * 
	 * Note: When a prompt box pops up, the user will have to click either "OK"
	 * or "Cancel" to proceed after entering an input value. Do not overuse this
	 * method, as it prevent the user from accessing other parts of the page
	 * until the box is closed.
	 * 
	 * The prompt() method returns the input value if the user clicks "OK". If
	 * the user clicks "cancel" the method returns null.
	 * 
	 * @param String
	 *                text Required. The text to display in the dialog box
	 * @param String
	 *                defaultText Optional. The default input text
	 */
	function prompt(text, defaultText) {
		// XXX: maso, 1395: wait for response (sync method)
		return $navigator.openDialog({
			templateUrl : 'views/dialogs/amh-prompt.html',
			config : {
				message : text,
				model : defaultText
			}
		});
	};

	/**
	 * TODO: maso, 2017: document
	 * @param text
	 * @returns
	 */
	function toast(text) {
		return $mdToast.show(
				$mdToast.simple()
				.textContent(text)
				.hideDelay(3000)
		);
	};


	return {
		toast: toast,
		alert: alert,
		prompt: prompt,
		confirm: confirm
	};
});

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
 * @name $preferences
 * @description System setting manager
 * 
 */
.service('$preferences', function($q, $navigator) {
	var preferences = [ ];

	/**
	 * Lists all created pages.
	 * 
	 * @returns
	 */
	function pages() {
		// SORT:
		preferences.sort(_pageComparator);
		// Return list
		return $q.when({
			'items' : preferences
		});
	}

	function _pageComparator(page1, page2){
		if(page1.priority === page2.priority){
			return 0;
		}
		if(page1.priority === 'first' || page2.priority === 'last'){
			return -1;
		}
		if(page1.priority === 'last' || page2.priority === 'first'){
			return +1;
		}
		if(typeof page1.priority === 'undefined'){
			return +1;
		}
		if(typeof page2.priority === 'undefined'){
			return -1;
		}
		return page1.priority - page2.priority;
	}
	
	/**
	 * Gets a prefernece page
	 * 
	 * @memberof $
	 * @param id {string} Pereference page id
	 */
	function page(id){
		// get preferences
		for (var i = 0, len = preferences.length; i < len; i++) {
			if(preferences[i].id === id){
				return $q.when(preferences[i])
			}
		}
		// not found
		return $q.reject({
			message: 'Not found'
		});
	}


	/**
	 * Opens a setting page
	 * 
	 * @param page
	 * @returns
	 */
	function open(page){
		return $navigator.openPage('/preferences/'+page.id);
	}

	/**
	 * Creates a new setting page.
	 * 
	 * @param page
	 * @returns
	 */
	function createPage(page){
		preferences.push(page);
		return this;
	}

	return  {
		'pages' : pages,
		'page': page,
		'open' : open,
		'openPage' : open,
		'createPage': createPage,
	};
});

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
 * @name $settings
 * @description System setting manager
 * 
 * Setting is user configurations
 */
.service('$settings', function($q, $navigator) {
	var _pages = [ ];
	var _settings = [];

	/**
	 * List all pages
	 */
	function pages() {
		return $q.when({
			'items' : _pages
		});
	}
	
	/**
	 * Gets a config page
	 * 
	 * @name config
	 * @param {string} configId - Id of the config
	 * @return {promiss<config>} return config
	 */
	function getPage(pageId){
		var page = null;
		for(var i = 0; i < _pages.length; i++){
			if(_pages[i].id == pageId){
				return $q.when(_pages[i]);
			}
		}
		return $q.reject({
			// TODO: maso, 2018: add reason
		});
	}

	/**
	 * Open config/setting page
	 */
	function openPage(page){
		return $navigator.openPage('/configs/'+page.id);
	}

	/**
	 * Creates configuration/setting page.
	 */
	function createPage(page){
		_pages.push(page);
		return app;
	}

	/**
	 * List all settings
	 */
	function settings(){
		return  _settings;
	}
	
	/**
	 * Adding new setting page
	 */
	function newSetting(setting){
		_settings.push(setting);
		return this;
	}
	
	/**
	 * get a setting 
	 */
	function setting(){
		// TODO: maso, 2017: support add and remove
	}
	
	var app = {
			configs : pages,
			config: getPage,
			openConfig : openPage,
			newPage: createPage,
			newConfig: createPage,
			// Settings
			settings: settings,
			setting: setting,
			newSetting: newSetting
	};
	return app;
});

angular.module('mblowfish-core').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/dialogs/mb-alert.html',
    "<md-dialog ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <wb-icon>error</wb-icon> <h2 translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=cancel()> <wb-icon aria-label=\"Close dialog\">close</wb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=row layout-align=\"center center\" flex> <p translate>{{config.message}}</p> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mb-confirm.html',
    "<md-dialog ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <wb-icon>warning</wb-icon> <h2 translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=answer(true)> <wb-icon aria-label=\"Close dialog\">done</wb-icon> </md-button> <md-button class=md-icon-button ng-click=cancel()> <wb-icon aria-label=\"Close dialog\">close</wb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=row layout-align=\"center center\" flex> <p translate>{{config.message}}</p> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mb-prompt.html',
    "<md-dialog ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <wb-icon>input</wb-icon> <h2 translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=answer(config.model)> <wb-icon aria-label=\"Close dialog\">done</wb-icon> </md-button> <md-button class=md-icon-button ng-click=cancel()> <wb-icon aria-label=\"Close dialog\">close</wb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=column layout-align=\"center stretch\" layout-padding flex> <p translate>{{config.message}}</p> <md-input-container class=md-block> <label translate>Input value</label> <input ng-model=config.model> </md-input-container> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/directives/mb-datepicker.html',
    "<div> <md-persian-datepicker ng-model=date ng-show=\"app.calendar === 'Jalaali'\"> </md-persian-datepicker> <md-datepicker ng-model=date md-placeholder=\"Enter date\" ng-show=\"app.calendar === 'Gregorian'\"> </md-datepicker> </div>"
  );


  $templateCache.put('views/directives/mb-dynamic-tabs.html',
    "<div layout=column flex layout-fill> <md-tabs md-selected=pageIndex> <md-tab ng-repeat=\"page in pages\"> <span translate>{{page.title}}</span> </md-tab> </md-tabs> <md-content id=mb-dynamic-tabs-select-resource-children> </md-content> </div>"
  );


  $templateCache.put('views/directives/mb-navigation-bar.html',
    "<div class=amd-navigation-path-bar md-colors=\"{'background-color': 'primary'}\" layout=row> <wb-icon style=\"margin: 1px\" ng-if=pathMenu.items.length>navigation</wb-icon> <md-button data-ng-repeat=\"menu in pathMenu.items | orderBy:['-priority']\" ng-click=menu.active() class=amd-navigation-path-bar-item> <md-tooltip ng-if=menu.tooltip>{{menu.tooltip}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> {{menu.title | translate}} <span ng-show=\"$index &lt; pathMenu.items.length - 1\">&gt;</span> </md-button> </div>"
  );


  $templateCache.put('views/directives/mb-pagination-bar.html',
    "<div>  <md-toolbar ng-show=!(showSearch||showSort||showState)> <div class=md-toolbar-tools> <md-button ng-if=amdIcon md-no-ink class=md-icon-button aria-label={{amdIcon}}> <wb-icon>{{amdIcon}}</wb-icon> </md-button> <h2 flex md-truncate ng-show=amdTitle>{{amdTitle}}</h2> <md-button ng-if=reload class=md-icon-button aria-label=Reload ng-click=reload()> <wb-icon>repeat</wb-icon> </md-button> <md-button ng-show=amdSortKeys class=md-icon-button aria-label=Sort ng-click=\"showSort = !showSort\"> <wb-icon>sort</wb-icon> </md-button> <md-button ng-show=amdEnableSearch class=md-icon-button aria-label=Search ng-click=\"showSearch = !showSearch\"> <wb-icon>search</wb-icon> </md-button> <md-button ng-if=exportData class=md-icon-button aria-label=Export ng-click=exportData()> <wb-icon>save</wb-icon> </md-button> <md-menu ng-show=amdMoreActions.length> <md-button aria-label=\"Open phone interactions menu\" class=md-icon-button ng-click=$mdOpenMenu($event)> <wb-icon>more_vert</wb-icon> </md-button> <md-menu-content width=4> <md-menu-item ng-repeat=\"item in amdMoreActions\"> <md-button ng-click=item.action()> <wb-icon ng-show=item.icon>{{item.icon}}</wb-icon> <span translate>{{ item.title }}</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </div> </md-toolbar>  <md-toolbar class=md-hue-1 ng-show=\"showSearch && amdEnableSearch\"> <div class=md-toolbar-tools> <md-button ng-click=\"showSearch = !showSearch\" aria-label=Back> <wb-icon>arrow_back</wb-icon> </md-button> <h3 flex=10 translate>Back</h3> <md-input-container md-theme=input flex> <label>&nbsp;</label> <input ng-model=temp.query ng-keyup=\"$event.keyCode == 13 ? query.searchTerm=temp.query : null\"> </md-input-container> <md-button aria-label=Search ng-click=\"showSearch = !showSearch\"> <wb-icon>search</wb-icon> </md-button> </div> </md-toolbar>  <md-toolbar class=md-hue-1 ng-show=showSort> <div class=md-toolbar-tools> <md-button ng-click=\"showSort = !showSort\"> <wb-icon>arrow_back</wb-icon> </md-button> <md-switch ng-model=query.sortDesc aria-label=DESC> DESC sort order </md-switch> <span flex=10></span> <div layout=row layout-align=\"space-between center\"> <span translate>Sort by : </span> <md-select ng-model=query.sortBy> <md-option ng-repeat=\"key in amdSortKeys\" value={{key}} translate>{{key}}</md-option> </md-select> </div> </div> </md-toolbar> </div>"
  );


  $templateCache.put('views/directives/mb-panel.html',
    "<div id=mb-panel-root md-theme=\"{{app.setting.theme || 'default'}}\" md-theme-watch layout=column layout-fill> <div id=mb-panel-root-ready ng-show=\"app.state.status === 'ready'\" ng-class=\"{'mb-rtl-direction': app.dir=='rtl', 'mb-ltr-direction': app.dir!='rtl'}\" dir={{app.dir}} layout=column layout-fill>       <div id=mb-panel-root-ready-anchor layout=row flex> <md-whiteframe layout=row id=main class=\"md-whiteframe-24dp main mb-page-content\" ng-view flex> </md-whiteframe> </div> </div> <div ng-if=\"app.state.status === 'loading'\" md-theme=\"{{app.setting.theme || 'default'}}\" md-theme-watch ng-class=\"{'mb-rtl-direction': app.dir=='rtl', 'mb-ltr-direction': app.dir!='rtl'}\" dir={{app.dir}} layout=column layout-align=\"center center\" layout-fill> <h4 translate>{{app.state.stage}}</h4> <p translate>{{app.state.message}}</p> <md-progress-linear style=\"width: 50%\" md-mode=indeterminate> </md-progress-linear> <md-button ng-if=\"app.state.status === 'fail'\" class=\"md-raised md-primary\" ng-click=restart() aria-label=Retry> <wb-icon>replay</wb-icon> retry </md-button> </div> <div ng-if=\"app.state.status === 'anonymous'\" md-theme-watch ng-class=\"{'mb-rtl-direction': app.dir=='rtl', 'mb-ltr-direction': app.dir!='rtl'}\" layout=row layout-aligne=none layout-align-gt-sm=\"center center\" ng-controller=AmdAccountCtrl flex> <div md-whiteframe=3 flex=100 flex-gt-sm=50 layout=column mb-preloading=\"ctrl.state ==='working'\">  <md-toolbar layout=row layout-padding>  <img width=160 height=160 ng-show=app.config.logo ng-src=\"{{app.config.logo}}\"> <p> <strong>{{app.config.title}}</strong><br> <em>{{app.config.description}}</em> </p> </md-toolbar>  <div ng-show=errorMessage> {{errorMessage}} </div> <form name=loginForm ng-submit=login(credit) layout=column layout-padding> <md-input-container> <label translate>User name</label> <input name=login ng-model=credit.login required> <div ng-messages=loginForm.login.$error> <div ng-message=required translate>This is required!</div> </div> </md-input-container> <md-input-container> <label translate>Password</label> <input name=password ng-model=credit.password type=password required> <div ng-messages=loginForm.password.$error> <div ng-message=required translate>This is required!</div> </div> </md-input-container> <div layout=column layout-align=none layout-gt-sm=row layout-align-gt-sm=\"space-between center\" layout-padding> <div layout=column flex-order=1 flex-order-gt-sm=-1>  </div>  <div vc-recaptcha key=\"'6LeuFzkUAAAAALniqtqd60Ca4iG8Kqx8rpMmUjEF'\" ng-model=\"credit['g-recaptcha-response']\" ng-if=\"captcha.type=='recaptcha'\"> </div> <input hide type=\"submit\"> <md-button flex-order=0 class=\"md-primary md-raised\" ng-click=login(credit) translate>login</md-button> </div> </form> </div> </div> </div>"
  );


  $templateCache.put('views/directives/mb-preference-page.html',
    "<div> <div id=amd-config-body> <div id=amd-config-placeholder> </div> </div> </div>"
  );


  $templateCache.put('views/directives/mb-titled-block.html',
    "<div style=\"border-radius: 5px; margin: 5px 5px 10px 10px; padding: 0px\" md-whiteframe=4> <md-toolbar style=\"border-top-left-radius: 5px;border-top-right-radius: 5px; margin: 0px; padding: 0px\"> <div layout=row layout-align=\"start center\" class=md-toolbar-tools> <wb-icon ng-if=amdIcon>{{amdIcon}}</wb-icon> <h3>{{amdTitle}}</h3> </div> </md-toolbar> <md-progress-linear ng-if=amdProgress style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-warn md-color> </md-progress-linear> <div style=\"margin: 8px\" ng-transclude></div> </div>"
  );


  $templateCache.put('views/directives/mb-tree-heading.html',
    "<h2 amd-style-color=\"{'color': 'primary.A100'}\" class=\"amd-tree-heading md-subhead\"> <wb-icon ng-if=amdSection.icon>{{amdSection.icon}}</wb-icon> {{amdSection.title}} </h2>"
  );


  $templateCache.put('views/directives/mb-tree-link.html',
    "<md-button amd-style-color=\"{'background-color': (isSelected(amdSection.state) || $state.includes(amdSection.state)) ? 'primary.800': 'primary.default'}\" class=\"md-raised md-primary md-hue-1\" ng-click=focusSection(amdSection)> <wb-icon ng-if=amdSection.icon>{{amdSection.icon}}</wb-icon> <span translate>{{amdSection.title}}</span> <span class=md-visually-hidden ng-if=isSelected(amdSection)> current page </span> </md-button>"
  );


  $templateCache.put('views/directives/mb-tree-toggle.html',
    "<div> <md-button class=\"md-raised md-primary md-hue-1 md-button-toggle\" ng-click=toggle(amdSection) aria-controls=docs-menu-{{section.name}} aria-expanded={{isOpen(amdSection)}}> <div flex layout=row> <wb-icon ng-if=amdSection.icon>{{amdSection.icon}}</wb-icon> <span class=amd-toggle-title translate>{{amdSection.title}}</span> <span flex></span> <span aria-hidden=true class=md-toggle-icon ng-class=\"{toggled : isOpen(amdSection)}\"> <wb-icon>keyboard_arrow_up</wb-icon> </span> </div> <span class=md-visually-hidden> Toggle {{isOpen(amdSection)? expanded : collapsed}} </span> </md-button> <ul id=docs-menu-{{amdSection.title}} class=amd-tree-toggle-list> <li ng-repeat=\"section in amdSection.sections\" ng-if=isVisible(section)> <amd-tree-link amd-section=section ng-if=\"section.type === 'link'\"> </amd-tree-link> </li> </ul> </div>"
  );


  $templateCache.put('views/directives/mb-tree.html',
    "<ul class=mb-tree> <li mb-style-color=\"{'border-bottom-color': 'background.600'}\" ng-repeat=\"section in mbSection.sections | orderBy : 'priority'\" ng-if=isVisible(section)> <mb-tree-heading mb-section=section ng-if=\"$parent.section.type === 'heading'\"> </mb-tree-heading> <mb-tree-link mb-section=section ng-if=\"$parent.section.type === 'link'\"> </mb-tree-link> <mb-tree-toggle mb-section=section ng-if=\"section.type === 'toggle'\"> </mb-tree-toggle>                </li> </ul>"
  );


  $templateCache.put('views/directives/mb-user-menu.html',
    "<div md-colors=\"{'background-color': 'primary-400'}\" class=amd-user-menu> <md-menu md-offset=\"0 20\"> <md-button class=amd-user-menu-button ng-click=$mdOpenMenu() aria-label=\"Open menu\"> <img height=32px class=img-circle ng-src={{app.user.current.avatar}}> <span>{{app.user.current.first_name}} {{app.user.current.last_name}}</span> <wb-icon class=material-icons>keyboard_arrow_down</wb-icon> </md-button> <md-menu-content width=3>  <md-menu-item ng-if=menu.items.length ng-repeat=\"item in menu.items | orderBy:['-priority']\"> <md-button ng-click=item.active() translate> <wb-icon ng-if=item.icon>{{item.icon}}</wb-icon> <span ng-if=item.title translate>{{item.title}}</span> </md-button> </md-menu-item> <md-menu-divider ng-if=menu.items.length></md-menu-divider> <md-menu-item> <md-button ng-click=settings() translate>Settings</md-button> </md-menu-item> <md-menu-item> <md-button ng-click=logout() translate>Log out</md-button> </md-menu-item> </md-menu-content> </md-menu> </div>"
  );


  $templateCache.put('views/directives/mb-user-toolbar.html',
    "<md-toolbar layout=row layout-align=\"center center\"> <img width=80px class=img-circle ng-src={{app.user.current.avatar}}> <md-menu md-offset=\"0 20\"> <md-button class=capitalize ng-click=$mdOpenMenu() aria-label=\"Open menu\"> <span>{{app.user.current.first_name}} {{app.user.current.last_name}}</span> <wb-icon class=material-icons>keyboard_arrow_down</wb-icon> </md-button> <md-menu-content width=3>  <md-menu-item ng-if=menu.items.length ng-repeat=\"item in menu.items | orderBy:['-priority']\"> <md-button ng-click=item.active() translate> <wb-icon ng-if=item.icon>{{item.icon}}</wb-icon> <span ng-if=item.title translate>{{item.title}}</span> </md-button> </md-menu-item> <md-menu-divider></md-menu-divider> <md-menu-item> <md-button ng-click=toggleRightSidebar();logout(); translate>Log out</md-button> </md-menu-item> </md-menu-content> </md-menu> </md-toolbar>"
  );


  $templateCache.put('views/mb-passowrd-recover.html',
    " <md-toolbar layout-padding>  <h3>Forget Your PassWord ?</h3> </md-toolbar>  <div layout=column layout-padding> <md-input-container> <label>Username or Email</label> <input ng-model=credit.login required> </md-input-container> </div> <div layout=column layout-align=none layout-gt-sm=row layout-align-gt-sm=\"space-between center\" layout-padding> <a ui-sref=login flex-order=1 flex-order-gt-sm=-1>Back To Login Page</a> <md-button flex-order=0 class=\"md-primary md-raised\" ng-click=login(credit)>Send</md-button> </div>"
  );


  $templateCache.put('views/mb-preference.html',
    "<md-content ng-cloak flex> <table> <tr> <td> <wb-icon wb-icon-name={{config.icon}} size=128> </wb-icon> </td> <td><h1 translate>{{config.title}}</h1> <p translate>{{config.description}}</p></td> </tr> </table> <amd-config-page amd-config-id=config.id> </amd-config-page> </md-content>"
  );


  $templateCache.put('views/mb-preferences.html',
    "<md-content ng-cloak layout-padding flex> <md-grid-list md-cols-gt-md=4 md-cols=2 md-cols-md=3 md-row-height=4:3 md-gutter-gt-md=16px md-gutter-md=8px md-gutter=4px> <md-grid-tile ng-repeat=\"tile in settingsTiles\" ng-style=\"{'background': tile.color}\" ng-click=openSetting(tile)> <md-grid-tile-header> <h3 style=\"text-align: center;font-weight: bold\">{{tile.page.title}}</h3> </md-grid-tile-header> <div> <h3><wb-icon>{{tile.page.icon}}</wb-icon></h3> <p>{{tile.page.description}}</p> </div> </md-grid-tile> </md-grid-list> </md-content>"
  );


  $templateCache.put('views/preferences/mb-brand.html',
    "<div layout=column ng-cloak flex> <md-input-container class=md-block> <label translate>Title</label> <input required md-no-asterisk name=title ng-model=\"app.config.title\"> </md-input-container> <md-input-container class=md-block> <label translate>Description</label> <input md-no-asterisk name=description ng-model=\"app.config.description\"> </md-input-container> <wb-ui-setting-image title=Logo value=app.config.logo> </wb-ui-setting-image> </div>"
  );


  $templateCache.put('views/preferences/mb-google-analytic.html',
    "<div layout=column ng-cloak flex> <md-input-container class=md-block> <label>Google analytic property</label> <input required md-no-asterisk name=property ng-model=\"app.config.googleAnalytic.property\"> </md-input-container> </div>"
  );


  $templateCache.put('views/preferences/mb-local.html',
    "<div layout=column ng-cloak flex> <md-input-container class=md-block> <label translate>Language</label> <md-select ng-model=app.config.local> <md-option value=fa translate>Persian</md-option> <md-option value=en translate>English</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Direction</label> <md-select ng-model=app.config.dir placeholder=Direction> <md-option value=rtl translate>Right to left</md-option> <md-option value=ltr translate>Left to right</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Calendar</label> <md-select ng-model=app.config.calendar placeholder=\"\"> <md-option value=Gregorian translate>Gregorian</md-option> <md-option value=Jalaali translate>Jalaali</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Date format</label> <md-select ng-model=app.config.dateFormat placeholder=\"\"> <md-option value=jMM-jDD-jYYYY translate> {{'2018-01-01' | amddate:'jMM-jDD-jYYYY'}} </md-option> <md-option value=jYYYY-jMM-jDD translate> {{'2018-01-01' | amddate:'jYYYY-jMM-jDD'}} </md-option> <md-option value=\"jYYYY jMMMM jDD\" translate> {{'2018-01-01' | amddate:'jYYYY jMMMM jDD'}} </md-option> </md-select> </md-input-container> </div>"
  );


  $templateCache.put('views/resources/mb-sidenav.html',
    ""
  );


  $templateCache.put('views/settings/mb-local.html',
    "<section class=\"demo-container md-whiteframe-z1 show-source\" layout=column layout-padding> <h3 translate>Theme</h3> <md-divider></md-divider> <md-input-container ng-controller=AmdThemesCtrl class=md-block> <label translate>Theme</label> <md-select ng-model=app.setting.theme> <md-option ng-repeat=\"theme in themes\" value={{theme.id}} translate>{{theme.label}}</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <md-switch class=md-primary name=special ng-model=app.setting.navigationPath> <sapn flex translate>Navigation path</sapn> </md-switch> </md-input-container> </section> <section class=\"demo-container md-whiteframe-z1 show-source\" layout-padding> <h3 translate>Local</h3> <md-divider></md-divider> <md-input-container class=md-block> <label translate>Language&Local</label> <md-select ng-model=app.setting.local> <md-option value=fa translate>Persian</md-option> <md-option value=en translate>English</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Direction</label> <md-select ng-model=app.setting.dir placeholder=Direction> <md-option value=rtl translate>Right to left</md-option> <md-option value=ltr translate>Left to right</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Calendar</label> <md-select ng-model=app.setting.calendar placeholder=\"\"> <md-option value=Gregorian translate>Gregorian</md-option> <md-option value=Jalaali translate>Jalaali</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Date format</label> <md-select ng-model=app.setting.dateFormat placeholder=\"\"> <md-option value=jMM-jDD-jYYYY translate> {{'2018-01-01' | amddate:'jMM-jDD-jYYYY'}} </md-option> <md-option value=jYYYY-jMM-jDD translate> {{'2018-01-01' | amddate:'jYYYY-jMM-jDD'}} </md-option> <md-option value=\"jYYYY jMMMM jDD\" translate> {{'2018-01-01' | amddate:'jYYYY jMMMM jDD'}} </md-option> </md-select> </md-input-container> </section>"
  );


  $templateCache.put('views/settings/mb-theme.html',
    "<section class=\"demo-container md-whiteframe-z1 show-source\" layout=column layout-padding> <h3 translate>Theme</h3> <md-divider></md-divider> <md-input-container ng-controller=AmdThemesCtrl class=md-block> <label translate>Theme</label> <md-select ng-model=app.setting.theme> <md-option ng-repeat=\"theme in themes\" value={{theme.id}} translate>{{theme.label}}</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <md-switch class=md-primary name=special ng-model=app.setting.navigationPath> <sapn flex translate>Navigation path</sapn> </md-switch> </md-input-container> </section> <section class=\"demo-container md-whiteframe-z1 show-source\" layout-padding> <h3 translate>Local</h3> <md-divider></md-divider> <md-input-container class=md-block> <label translate>Language&Local</label> <md-select ng-model=app.setting.local> <md-option value=fa translate>Persian</md-option> <md-option value=en translate>English</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Direction</label> <md-select ng-model=app.setting.dir placeholder=Direction> <md-option value=rtl translate>Right to left</md-option> <md-option value=ltr translate>Left to right</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Calendar</label> <md-select ng-model=app.setting.calendar placeholder=\"\"> <md-option value=Gregorian translate>Gregorian</md-option> <md-option value=Jalaali translate>Jalaali</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Date format</label> <md-select ng-model=app.setting.dateFormat placeholder=\"\"> <md-option value=jMM-jDD-jYYYY translate> {{'2018-01-01' | amddate:'jMM-jDD-jYYYY'}} </md-option> <md-option value=jYYYY-jMM-jDD translate> {{'2018-01-01' | amddate:'jYYYY-jMM-jDD'}} </md-option> <md-option value=\"jYYYY jMMMM jDD\" translate> {{'2018-01-01' | amddate:'jYYYY jMMMM jDD'}} </md-option> </md-select> </md-input-container> </section>"
  );


  $templateCache.put('views/sidenavs/mb-help.html',
    "<md-toolbar class=md-hue-1 layout=column layout-align=center> <div layout=row layout-align=\"start center\"> <md-button class=md-icon-button aria-label=Close ng-click=closeHelp()> <wb-icon>close</wb-icon> </md-button> <span flex></span> <h4 translate>Help</h4> </div> </md-toolbar> <md-content flex> <wb-content wb-model=helpContent></wb-content> </md-content>"
  );


  $templateCache.put('views/sidenavs/mb-navigator.html',
    "<md-toolbar class=md-whiteframe-z2 layout=column layout-align=\"start center\"> <img width=128px height=128px ng-show=app.config.logo ng-src=\"{{app.config.logo}}\"> <strong>{{app.config.title}}</strong> <p style=\"text-align: center\">{{app.config.description}}</p> </md-toolbar> <md-content> <mb-tree mb-section=menuItems>  </mb-tree></md-content>"
  );


  $templateCache.put('views/sidenavs/mb-settings.html',
    " <amd-user-toolbar amd-actions=userActions> </amd-user-toolbar>  <amd-dynamic-tabs amd-tabs=settingTabs> </amd-dynamic-tabs>"
  );


  $templateCache.put('views/toolbars/mb-dashboard.html',
    "<div layout=row layout-align=\"start center\"> <md-button class=md-icon-button hide-gt-sm ng-click=toggleItemsList() aria-label=Menu> <wb-icon>menu</wb-icon> </md-button> <img hide-gt-sm height=32px ng-if=app.config.logo ng-src=\"{{app.config.logo}}\"> <strong hide-gt-sm style=\"padding: 0px 8px 0px 8px\"> {{app.config.title}} </strong> <mb-navigation-bar hide show-gt-sm ng-show=app.setting.navigationPath> </mb-navigation-bar> </div> <div layout=row layout-align=\"end center\">  <md-button ng-repeat=\"menu in scopeMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-click=menu.active() class=md-icon-button> <md-tooltip ng-if=menu.tooltip>{{menu.tooltip}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> </md-button> <md-divider ng-if=scopeMenu.items.length></md-divider> <md-button ng-repeat=\"menu in toolbarMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-click=menu.active() class=md-icon-button> <md-tooltip ng-if=menu.tooltip>{{menu.tooltip}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> </md-button>             <mb-user-menu></mb-user-menu> <md-button ng-repeat=\"menu in userMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-click=menu.active() class=md-icon-button> <md-tooltip ng-if=menu.tooltip>{{menu.tooltip}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> </md-button> </div>"
  );

}]);
