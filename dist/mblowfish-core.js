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
	'ngRoute', //
//	Seen
	'seen-core',
	'seen-tenant',
	'seen-cms',
//	AM-WB
	'am-wb-core', 
	'am-wb-seen-core',
//	Others
	'lfNgMdFileInput', // https://github.com/shuyu/angular-material-fileinput
	'ngStorage', // https://github.com/gsklee/ngStorage
	'vcRecaptcha', //https://github.com/VividCortex/angular-recaptcha
	'ng-appcache',//
	'ngFileSaver',//
	'mdSteppers',//
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
	.config(function ($httpProvider) {
	    // An interceptor to handle errors of server response
	    // All that the interceptor does is in 'httpRequestInterceptor' factory.
	    $httpProvider.interceptors.push('httpRequestInterceptor');
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

    // Preferences
    /**
     * @ngdoc ngRoute
     * @name /initialization
     * @description Initial page
     */
    .when('/initialization', {
        templateUrl : 'views/mb-initial.html',
        controller : 'MbInitialCtrl',
        controllerAs: 'ctrl',
        /*
         * @ngInject
         */
        protect : function($rootScope) {
            // TODO: maso, 2018: replace with roles core_owner, Pluf_owner
            return !$rootScope.app.user.owner;
        },
        sidenavs: [],
        toolbars: []
    })
    /**
     * @ngdoc ngRoute
     * @name /preferences
     * @description preferences pages
     */
    .when('/preferences', {
        templateUrl : 'views/mb-preferences.html',
        controller : 'MbPreferencesCtrl',
        controllerAs: 'ctrl',
        helpId : 'preferences',
        /*
         * @ngInject
         */
        protect : function($rootScope) {
            return !$rootScope.app.user.owner;
        }
    }) //
    /**
     * @ngdoc ngRoute
     * @name /preferences/:page
     * @description Preferences page
     * 
     * Display a preferences page to manage a part of settings. Here is list of
     * default pages: - google-analytic - brand - update - pageNotFound
     */
    .when('/preferences/:preferenceId', {
        templateUrl : 'views/mb-preference.html',
        controller : 'MbPreferenceCtrl',
        /*
         * @ngInject
         */
        helpId : function($routeParams) {
            return 'preferences-' + $routeParams.preferenceId;
        },
        /*
         * @ngInject
         */
        protect : function($rootScope) {
            return !$rootScope.app.user.owner;
        }
    })

    // Users
    // Login
    .when('/users/login', {
        templateUrl : 'views/users/mb-login.html',
        controller : 'MbAccountCtrl',
        sidenavs: [],
        toolbars: []
    })
    /**
     * @ngdoc ngRoute
     * @name /users/account
     * @description Details of the current account
     */
    .when('/users/account', {
        templateUrl : 'views/users/mb-account.html',
        controller : 'MbAccountCtrl',
        controllerAs: 'ctrl',
        protect: true,
        helpId: 'mb-account'
    })
    /**
     * @ngdoc ngRoute
     * @name /users/profile
     * @description Profile of the current account
     */
    .when('/users/profile', {
        templateUrl : 'views/users/mb-profile.html',
        controller : 'MbProfileCtrl',
        controllerAs: 'ctrl',
        protect: true,
        helpId: 'mb-profile'
    })
    /**
     * @ngdoc ngRoute
     * @name /users/password
     * @description Manage current password of the account
     * 
     * Change the password of the current account.
     */
    .when('/users/password', {
        templateUrl : 'views/users/mb-password.html',
        controller : 'MbAccountCtrl',
        controllerAs: 'ctrl',
        protect: true,
        helpId: 'mb-profile'
    })

    // Reset forgotten password
    .when('/users/reset-password', {
        templateUrl : 'views/users/mb-forgot-password.html',
        controller : 'MbAccountCtrl',
        controllerAs: 'ctrl',
        sidenavs: [],
        toolbars: []
    })//
    .when('/users/reset-password/token', {
        templateUrl : 'views/users/mb-recover-password.html',
        controller : 'MbAccountCtrl',
        controllerAs: 'ctrl',
        sidenavs: [],
        toolbars: []
    })//
    .when('/users/reset-password/token/:token', {
        templateUrl : 'views/users/mb-recover-password.html',
        controller : 'MbAccountCtrl',
        controllerAs: 'ctrl',
        sidenavs: [],
        toolbars: []
    })//
    ; //

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
        .config(function ($mdThemingProvider) {

            // AMD default palette
            $mdThemingProvider.definePalette('amdPrimaryPalette', {
                '50': '#FFFFFF',
                '100': 'rgb(255, 198, 197)',
                '200': '#E75753',
                '300': '#E75753',
                '400': '#E75753',
                '500': '#E75753',
                '600': '#E75753',
                '700': '#E75753',
                '800': '#E75753',
                '900': '#E75753',
                'A100': '#E75753',
                'A200': '#E75753',
                'A400': '#E75753',
                'A700': '#E75753'
            });

            // Dark theme
            $mdThemingProvider
                    .theme('dark')//
                    .primaryPalette('grey', {
                        'default': '900',
                        'hue-1': '700',
                        'hue-2': '600',
                        'hue-3': '500'
                    })//
                    .accentPalette('grey', {
                        'default': '700'
                    })//
                    .warnPalette('red')
                    .backgroundPalette('grey')

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
 * @ngdoc Controllers
 * @name MbAccountCtrl
 * @description Manages account of users.
 * 
 * Manages current user action:
 *  - login - logout - change password - recover password
 */
.controller('MbAccountCtrl', function($scope, $rootScope, $app, $translate, $window, $usr, $errorHandler) {

    this.loginProcess = false;
    this.loginState= null;
    this.logoutProcess= false;
    this.logoutState= null;
    this.changingPassword= false;
    this.changePassState= null;
    this.updatingAvatar= false;
    this.loadingUser= false;
    this.savingUser= false;
    
    /**
     * Call login process for current user
     * 
     * @memberof AmhUserAccountCtrl
     * @name login
     * @param {object}
     *            cridet username and password
     * @param {string}
     *            cridet.login username
     * @param {stirng}
     *            cridig.password Password
     * @returns {promiss} to do the login
     */
    this.login = function(cridet, form) {
        if(ctrl.loginProcess){
            return false;
        }
        ctrl.loginProcess= true;
        return $app.login(cridet)//
        .then(function(){
            ctrl.loginState = 'success';
            $scope.loginMessage = null;
        }, function(error){
            ctrl.loginState = 'fail';
            $scope.loginMessage = $errorHandler.handleError(error, form);
        })
        .finally(function(){
            ctrl.loginProcess = false;
        });
    }

    this.logout = function() {
        if(ctrl.logoutProcess){
            return false;
        }
        ctrl.logoutProcess= true;
        return $app.logout()//
        .then(function(){
            ctrl.logoutState = 'success';
        }, function(){
            ctrl.logoutState = 'fail';
        })
        .finally(function(){
            ctrl.logoutProcess = false;
        });
    }

    /**
     * Change password of the current user
     * 
     * @name load
     * @memberof MbAccountCtrl
     * @returns {promiss} to change password
     */
    this.changePassword = function(data, form) {
        if(ctrl.changingPassword){
            return;
        }
        ctrl.changingPassword = true;
        var param = {
                'old' : data.oldPass,
                'new' : data.newPass,
                'password': data.newPass
        };
// return $usr.resetPassword(param)//
        $usr.putCredential(param)
        .then(function(){
            $app.logout();
            ctrl.changePassState = 'success';
            $scope.changePassMessage = null;
            toast($translate.instant('Password is changed successfully. Login with new password.'));
        }, function(error){
            ctrl.changePassState = 'fail';
            $scope.changePassMessage = $errorHandler.handleError(error, form);
            alert($translate.instant('Failed to change the password.'));
        })//
        .finally(function(){
            ctrl.changingPassword = false;
        });
    }


    /**
     * Update avatar of the current user
     * 
     * @name load
     * @memberof MbAccountCtrl
     * @returns {promiss} to update avatar
     */
    this.updateAvatar = function(avatarFiles){
        // XXX: maso, 1395: reset avatar
        if(ctrl.updatingAvatar){
            return;
        }
        ctrl.updatingAvatar = true;
        return ctrl.user.uploadAvatar(avatarFiles[0].lfFile)//
        .then(function(){
            // TODO: hadi 1397-03-02: only reload avatar image by clear and set
            // (again) avatar address in view
            // clear address before upload and set it again after upload.
            $window.location.reload();
            toast($translate.instant('Your avatar updated successfully.'));
        }, function(){
            alert($translate.instant('Failed to update avatar'));
        })//
        .finally(function(){
            ctrl.updatingAvatar = false;
        });
    }

    this.back = function () {
        $window.history.back();
    }


    /**
     * Loads user data
     * 
     * @name load
     * @memberof MbAccountCtrl
     * @returns {promiss} to load user data
     */
    this.loadUser = function(){
        if(ctrl.loadingUser){
            return;
        }
        ctrl.loadingUser = true;
        return $usr.getAccount('current')//
        .then(function(user){
            ctrl.user = user;
        }, function(error){
            ctrl.error = error;
        })//
        .finally(function(){
            ctrl .loadingUser = false;
        });
    }


    /**
     * Save current user
     * 
     * @name load
     * @memberof MbAccountCtrl
     * @returns {promiss} to save
     */
    this.saveUser = function(form){
        if(ctrl.savingUser){
            return;
        }
        ctrl.savingUser = true;
        return ctrl.user.update()//
        .then(function(user){
            ctrl.user = user;
            $scope.saveUserMessage = null; 
            toast($translate.instant('Your information updated successfully.'));
        }, function(error){
            $scope.saveUserMessage = $errorHandler.handleError(error, form);
            alert($translate.instant('Failed to update.'));
        })//
        .finally(function(){
            ctrl.savingUser = false;
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

    $scope.$watch(function(){
        return $rootScope.app.user;
    }, function(usrStruct){
        $scope.appUser = usrStruct;
    }, true);

    // support old systems
    var ctrl = this;
    $scope.login = function(cridet, form){
        ctrl.login(cridet, form);
    };
    $scope.logout = function(){
        ctrl.logout();
    };
    $scope.changePassword = function(){
        ctrl.changePassword();
    };
    $scope.updateAvatar = function(){
        ctrl.updateAvatar();
    };
    $scope.load = function(){
        ctrl.loadUser();
    };
    $scope.reload = function(){
        ctrl.loadUser();
    };
    $scope.saveUser = function(){
        ctrl.saveUser();
    };

    $scope.back = function(){
        ctrl.back();
    };
    $scope.cancel = function(){
        ctrl.back();
    };

    this.loadUser();
});



'use strict';

angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
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
        link: 'dashboard'
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
 * @ngdoc Controllers
 * @name MbHelpCtrl
 * @description Help page controller
 * 
 * Watches total system and update help data.
 * 
 */
.controller('MbHelpCtrl', function($scope, $rootScope, $route, $http, $translate, $help) {
	$rootScope.showHelp = false;
	var lastLoaded;

        
	/**
	 * load help content for the item
	 * 
	 * @name loadHelpContent
	 * @memberof MbHelpCtrl
	 * @params item {object} an item to display help for
	 */
	function _loadHelpContent(item) {
		if($scope.helpLoading){
			// maso, 2018: cancle old loading
			return $scope.helpLoading;
		}
		var path = $help.getHelpPath(item);
		// load content
		if(path && path !== lastLoaded){
			$scope.helpLoading = $http.get(path) //
			.then(function(res) {
				$scope.helpContent = res.data;
				lastLoaded = path;
			})//
			.finally(function(){
				$scope.helpLoading = false;
			});
		}
		return $scope.helpLoading;
	}

	$scope.closeHelp = function(){
		$rootScope.showHelp = false;
	};

	/*
	 * If user want to display help, content will be loaded.
	 */
	$scope.$watch('showHelp', function(value){
		if(value) {
			return _loadHelpContent();
		}
	});

	/*
	 * Watch for current item in help service
	 */
	$scope.$watch(function(){
		return $help.currentItem();
	}, function() {
            if ($rootScope.showHelp) {
                _loadHelpContent();
            }
        });
});
//TODO: should be moved to mblowfish-core

/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
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
 * @ngdoc Controllers
 * @name MbInitialCtrl
 * @description Initializes the application
 * 
 * Manages and initializes the application.
 * 
 * This controller is used first time when the application is run.
 * 
 * The controller puts list of configuration pages in `settings` and current
 * setting in `currentSetting`.
 * 
 * Settings is ordered list and the index of the item is unique.
 * 
 * Here is list of all data managed with controller
 * 
 * <ul>
 * <li>steps: list of all settings</li>
 * <li>currentStep: object (with id) points to the current setting page</li>
 * </ul>
 * 
 * NOTE: the controller works with an stepper and $mdStepper (id:
 * setting-stepper)
 */
.controller('MbInitialCtrl', function($scope, $rootScope, $preferences, $mdStepper, $window, $wbUtil, $routeParams) {

    /*
     * ID of the stepper
     */
    var _stepper_id = 'setting-stepper';

    /**
     * Loads settings with the index
     * 
     * @memberof MbInitialCtrl
     * @param {integer}
     *            index of the setting
     */
    function goToStep(index){
        $mdStepper(_stepper_id)//
        .goto(index);
    }

    /**
     * Loads the next setting page
     * 
     * @memberof MbInitialCtrl
     */
    function nextStep(){
        $mdStepper(_stepper_id)//
        .next();
    }

    /**
     * Loads the previous setting page
     * 
     * @memberof MbInitialCtrl
     */
    function prevStep(){			
        $mdStepper(_stepper_id)//
        .back();
    }

    /*
     * Set application is initialized
     */
    function _setInitialized(/*flag*/){
        $rootScope.app.config.is_initialized = true;
    }

    /*
     * Checks if it is initialized
     * 
     * NOTE: maso, 2018: check runs/initial.js for changes
     */
    function _isInitialized(){
        return !$routeParams.force && $rootScope.app.config.is_initialized;
    }

    /*
     * Go to the main page
     */
    function _redirectToMain(){
        $window.location =  $window.location.href.replace(/initialization$/mg, '');
    }

    /*
     * Loads internal pages and settings
     */
    function _initialization(){
        // Configure language page. It will be added as first page of setting
        // stepper
        var langPage = {
                id: 'initial-language',
                title: 'Language',
                templateUrl : 'views/preferences/mb-language.html',
                controller : 'MbLanguageCtrl',
                description: 'Select default language of web application.',
                icon: 'language',
                priority: 'first',
                required: true
        };
        // Configure welcome page. It will be added as one of the first pages of
        // setting stepper
        var inlineTemplate = '<wb-group ng-model=\'model\' flex style=\'overflow: auto;\' layout-fill></wb-group>';
        var welcomePage = {
                id: 'welcome',
                title: 'Welcome',
                template : inlineTemplate,
                /*
                 * @ngInject
                 */
                controller : function($scope, $http, $translate) {
                    // TODO: hadi: Use $language to get current Language
                    $http.get('resources/welcome/'+$translate.use()+'.json')//
                    .then(function(res){
                        //TODO: Maso, 2018: $wbUtil must delete in next version. Here it comes for compatibility to previous versions.
                        //$scope.model = $wbUtil.clean(res.data || {});
                        $scope.model = $wbUtil.clean(res.data) || {};
                    });
                },
                description: 'Welcome. Please login to continue.',
                icon: 'accessibility',
                priority: 'first',
                required: true
        };
        var congratulatePage = {
                id: 'congratulate',
                title: ':)',
                description: 'Congratulation. Your site is ready.',
                template : inlineTemplate,
                /*
                 * @ngInject
                 */
                controller : function($scope, $http, $translate) {
                    // TODO: hadi: Use $language to get current Language
                    $http.get('resources/congratulate/'+$translate.use()+'.json')//
                    .then(function(res){
                        //TODO: Maso, 2018: $wbUtil must delete in next version. Here it comes for compatibility to previous versions.
                        $scope.model = $wbUtil.clean(res.data) || {};
                    });
                    _setInitialized(true);
                },
                icon: 'favorite',
                priority: 'last',
                required: true
        };
        $preferences.newPage(langPage);
        $preferences.newPage(welcomePage);
        $preferences.newPage(congratulatePage);
        // Load settings
        $preferences.pages()//
        .then(function(settingItems) {
            var steps = [];
            settingItems.items.forEach(function(settingItem){
                if(settingItem.required){
                    steps.push(settingItem);
                }
            });
            $scope.steps = steps;
        });

        // add watch on setting stepper current step.
        $scope.$watch(function(){
            var current = $mdStepper(_stepper_id);
            if(current){
                return current.currentStep;
            }
            return -1;
        }, function(index){
            if(index >= 0 && $scope.steps && $scope.steps.length){
                $scope.currentStep = $scope.steps[index];
            }
        });
    }

    /*
     * Watch application state
     */
    var removeApplicationStateWatch = $scope.$watch('app.state.status', function(status){
        switch (status) {
        case 'loading':
        case 'fail':
        case 'error':
            // Wait it for ready
            break;
        case 'ready':
            // remove watch
            removeApplicationStateWatch();
            if(_isInitialized()){
                _redirectToMain();
            } else {
                _initialization();
            }
            break;
        default:
            break;
        }
    });
    


    this.goToStep = goToStep;
    this.nextStep = nextStep;
    this.nextStep = nextStep;
    this.prevStep = prevStep;
});

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
//
//
///**
// * @ngdoc Controllers
// * @name AmdItemsCtrl
// * @description Generic controller of items collection
// * 
// * This controller is used manages a collection of a virtual items. it is the
// * base of all other collection controllers such as accounts, groups, etc.
// * 
// * There are two types of function in the controller: view and data related. All
// * data functions are considered to be overried by extensions.
// * 
// * ## Add new item
// * 
// * To create and add new mode item, add a function and return created model
// * as promisse or an object.
// * 
// * For example;
// * 
// * <code><pre>
// *  this.createModel = function(){};
// * </pre></code>
// * 
// * ## Delete item
// * 
// * To delete and remove item from view, sub class must overrid the following function:
// * 
// * <code><pre>
// *  this.deleteModel = function(item){ ... }
// * </pre></code>
// * 
// * @ngInject
// */
//function MbItemsCtrl(/*$scope, $usr,*/ $q, $notification, QueryParameter, Action) {
//    var STATE_INIT = 'init';
//    var STATE_BUSY = 'busy';
//    var STATE_IDEAL = 'ideal';
//    this.state = STATE_IDEAL;
//
//
//    /**
//     * List of all loaded items
//     * 
//     * All loaded items will be stored into this variable for later usage. This
//     * is related to view.
//     * 
//     * @type array
//     * @memberof AmdItemsCtrl
//     */
//    this.items = [];
//
//    /**
//     * State of the controller
//     * 
//     * Controller may be in several state in the lifecycle. The state of the
//     * controller will be stored in this variable.
//     * 
//     * <ul>
//     * <li>init: the controller is not ready</li>
//     * <li>busy: controller is busy to do something (e. loading list of data)</li>
//     * <li>ideal: controller is ideal and wait for user </li>
//     * </ul>
//     * 
//     * @type string
//     * @memberof AmdItemsCtrl
//     */
//    this.state = STATE_INIT;
//
//    /**
//     * Store last paginated response
//     * 
//     * This is a collection controller and suppose the result of query to be a
//     * valid paginated collection. The last response from data layer will be
//     * stored in this variable.
//     * 
//     * @type PaginatedCollection
//     * @memberof AmdItemsCtrl
//     */
//    this.lastResponse = null;
//
//    /**
//     * Query parameter
//     * 
//     * This is the query parameter which is used to query items from the data
//     * layer.
//     * 
//     * @type QueryParameter
//     * @memberof AmdItemsCtrl
//     */
//    this.queryParameter = new QueryParameter();
//    this.queryParameter.setOrder('id', 'd');
//
//
//    /**
//     * Reload the controller
//     * 
//     * Remove all old items and reload the controller state. If the controller
//     * is in progress, then cancel the old promiss and start the new job.
//     * 
//     * @memberof AmdItemsCtrl
//     * @returns promiss to reload
//     */
//    this.reload = function(){
//        // relaod data
//        delete this.lastResponse;
//        this.items = [];
//        this.queryParameter.setPage(1);
//        return this.loadNextPage();
//    };
//
//    /**
//     * Loads and init the controller
//     * 
//     * All childs must call this function at the end of the cycle
//     */
//    this.init = function(){
//        var ctrl = this;
//        this.state=STATE_IDEAL;
//    };
//
//    /**
//     * Loads next page
//     * 
//     * Load next page and add to the current items.
//     * 
//     * @memberof AmdItemsCtrl
//     * @returns promiss to load next page
//     */
//    this.loadNextPage = function() {
//        // Check functions
//        if(!angular.isFunction(this.getItems)){
//            throw 'The controller does not implement getItems function';
//        }
//
//        if (this.state === STATE_INIT) {
//            throw 'this.init() function is not called in the controller';
//        }
//
//        // check state
//        if (this.state !== STATE_IDEAL) {
//            if(this.lastQuery){
//                return this.lastQuery;
//            }
//            throw 'Items controller is not in ideal state';
//        }
//
//        // set next page
//        if (this.lastResponse) {
//            if(!this.lastResponse.hasMore()){
//                return $q.resolve();
//            }
//            this.queryParameter.setPage(this.lastResponse.getNextPageIndex());
//        }
//
//        // Get new items
//        this.state = STATE_BUSY;
//        var ctrl = this;
//        this.lastQuery = this.getItems(this.queryParameter)//
//        .then(function(response) {
//            ctrl.lastResponse = response;
//            ctrl.items = ctrl.items.concat(response.items);
//            ctrl.error = null;
//        }, function(error){
//            ctrl.error = error;
//        })//
//        .finally(function(){
//            ctrl.state = STATE_IDEAL;
//            delete ctrl.lastQuery;
//        });
//        return this.lastQuery;
//    };
//
//
//    /**
//     * Set a GraphQl format of data
//     * 
//     * By setting this the controller is not sync and you have to reload the
//     * controller. It is better to set the data query at the start time.
//     * 
//     * @memberof AmdItemsCtrl
//     * @param graphql
//     */
//    this.setDataQuery = function(grqphql){
//        this.grqphql = grqphql;
//    };
//
//    /**
//     * Get properties to sort
//     * 
//     * @return array of getProperties to use in search, sort and filter
//     */
//    this.getProperties = function(){
//        if(!angular.isFunction(this.getSchema)){
//            return [];
//        }
//        if(angular.isDefined(this._schema)){
//            // TODO: maso, 2018: 
//            return this._schema;
//        }
//        var ctrl = this;
//        $q.when(this.getSchema())
//        .then(function(schema){
//            ctrl._schema = schema;
//        });
//        // view must check later
//        return [];
//    };
//
//    /**
//     * Load controller actions
//     * 
//     * @return list of actions
//     */
//    this.getActions = function(){
//        var actions = this._actions;
//        // TODO: maso, 2018: add flag to cache 
//        // add item action
//        var ctrl = this;
//        if(angular.isFunction(this.createModel)){
//            // maso, 2018: crate action from add item
//            actions.push(new Action({
//                action: function(){
//                    var model = ctrl.createModel();
//                    $q.when(model)
//                    .then(function(item){
//                        ctrl.items.push(item);
//                    });
//                }
//            }));
//        }
//        // reload items action
//        {
//            // TODO: maso, 2018: crate action from reload
//        }
//        return actions;
//    };
//
//    /**
//     * Adds new action into the controller
//     * 
//     * @param action to add to list
//     */
//    this.addAction = function(action) {
//        if(!angular.isDefined(this._actions)){
//            this._actions = [];
//        }
//        // TODO: maso, 2018: assert the action is MbAction
//        if(!(action instanceof Action)){
//            action = new Action(action);
//        }
//        this._actions = this._actions.push(action);
//    };
//
//
//    /**
//     * Deletes item
//     * 
//     * @memberof AmdItemsCtrl
//     * @param item
//     * @return promiss to delete item
//     */
//    this.deleteItem = function(item){
//        // TODO: maso, 2018: update state of the controller to busy
//        var ctrl = this;
//        var index;
//        $notification.confirm('Delete item?')
//        .then(function(){
//            index = ctrl.items.indexOf(item);
//            return ctrl.deleteModel(item);
//        })
//        .then(function(){
//            ctrl.items.splice(index, 1);
//        });
//    };
//
//    /**
//     * Gets object schema
//     * 
//     * @memberof AmdItemsCtrl
//     * @return promise to get schema
//     */
//    this.getSchema = function(){
//        // Controllers are supposed to override the function
//        return $q.resolve({
//            name: 'Item',
//            properties:[{
//                id: 'int',
//                title: 'string'
//            }]
//        });
//    };
//
//    /**
//     * Query and get items
//     * 
//     * @param queryParameter to apply search
//     * @return promiss to get items
//     */
//    this.getItems = function(/*queryParameter*/){
//
//    };
//
//    /**
//     * Get item with id
//     * 
//     * @param id of the item
//     * @return promiss to get item
//     */
//    this.getItem = function(id){
//        return {
//            id: id
//        };
//    };
//
//    /**
//     * Adds new item
//     * 
//     * This is default implementation of the data access function. Controllers
//     * are supposed to override the function
//     * 
//     * @memberof AmdItemsCtrl
//     * @return promiss to add and return an item
//     */
//    this.addItem = function(){
//        // Controllers are supposed to override the function
//        var item = {
//                id: Math.random(),
//                title: 'test item'
//        };
//        return $q.accept(item);
//    };
//    
//
//}
//
///*
// * Add to angular
// */
//angular.module('mblowfish-core').controller('MbItemsCtrl', MbItemsCtrl);

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
 * @ngdoc Controllers
 * @name MbThemesCtrl
 * @description Dashboard
 * 
 */
.controller('MbLanguageCtrl', function($scope, $app, $rootScope, $http, $language) {

	function init(){	
		$http.get('resources/languages.json')//
		.then(function(res){
			var data = res ? res.data : {};
			$scope.languages = data.languages;
//			$rootScope.app.config.languages = $scope.languages;
		})
//		$app.config('languages')//
//		.then(function(langs){
//			$scope.languages = langs;
//			return langs;
//		})//
//		.then(function(){
//			if(!$scope.languages){
//				$http.get('resources/languages.json')//
//				.then(function(res){
//					var data = res ? res.data : {};
//					$scope.languages = data.languages;
//					$rootScope.app.config.languages = $scope.languages;
//				});
//			}
//		})//
		.finally(function(){	
			var langKey =  $language.use();
			if($scope.languages){				
				for(var i=0 ; i<$scope.languages.length ; i++){				
					if($scope.languages[i].key === langKey){
						setLanguage($scope.languages[i]);
						return;
					}
				}
			}
		});
	}

	function setLanguage(lang){
		$scope.myLanguage = lang;
		// Load langauge
		$rootScope.app.config.languages = [];
		$rootScope.app.config.languages.push($scope.myLanguage);
		// Use langauge		
		$language.use($scope.myLanguage.key);
		// Set local
		$rootScope.app.config.local = $rootScope.app.config.local || {};
		if(!angular.isObject($rootScope.app.config.local)){
			$rootScope.app.config.local = {};
		}
		$rootScope.app.config.local.language = $scope.myLanguage.key;
		if($scope.myLanguage.dir){
			$rootScope.app.config.local.dir = $scope.myLanguage.dir;
		}
	}

	$scope.setLanguage = setLanguage;

	init();
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
 * @ngdoc Controllers
 * @name MbLocalCtrl
 * @description Controller to manage local settings
 * 
 */
.controller('MbLocalCtrl', function($scope, $language, $navigator) {

	function init(){		
		$language.languages()//
		.then(function(langs){
			$scope.languages = langs.items;
			return $scope.languages;
		});
	}

	$scope.goToManage = function(){
		// XXX: hadi, Following path exist in angular-material-home-language.
		// I think it should be moved to mblowfish or move multilanguage functionality to that module.
		$navigator.openPage('preferences/languages/manager');
	};
	
	$scope.languages = [];
	
	init();
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
 * @ngdoc Controllers
 * @name MessagesCtrl
 * @description Dashboard
 * 
 */
.controller('MessagesCtrl', function($scope,/*$monitor*/ QueryParameter, $rootScope) {

	var queryParameter = new QueryParameter();
	queryParameter.setOrder('id', 'd');
	var requests = null;
	var ctrl = {
			state: 'relax',
			items: []
	};


	/**
	 * جستجوی درخواست‌ها
	 * 
	 * @param queryParameter
	 * @returns promiss
	 */
	function find(query) {
		queryParameter.setQuery(query);
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
			queryParameter.setPage(requests.next());
		}
		// start state (device list)
		ctrl.status = 'working';
                var currentUser = $rootScope.app.user.current;
		return currentUser.getMessages(queryParameter)//
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
	$scope.qp = queryParameter;

	// watch messages
        // TODO: Masood, 2018: $monitor should be updated based on version 2.
//	var handler;
//	$monitor.monitor('message', 'count')//
//	.then(function(monitor){
//		handler = monitor.watch(function(){
//			reload();
//		});
//	});
//	$scope.$on('$destroy', handler);
	/*
	 * مقداردهی اولیه
	 */
	reload();
});

'use strict';
angular.module('mblowfish-core')

/**
 * @ngdoc Controllers
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
 * @ngdoc Controllers
 * @name AmdNavigatorCtrl
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
		angular.forEach($route.routes, function(config/*, route*/) {
			if (config.navigate) {
				// init conifg
				config.type = 'link';
				config.link = config.originalPath;
				config.title = config.title || config.name || 'no-name';
				config.priority = config.priority || 100;
				_items.push(config);
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
 * @ngdoc Controllers
 * @name MbSettingsCtrl
 * @description Manages settings page
 * 
 * Manages settings pages.
 * 
 */
.controller('MbOptionsCtrl',function($scope, $options) {
	// Load settings.
	$options.pages()
	.then(function(pages){
		$scope.tabs = pages.items;
	});
});

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
//
//angular.module('mblowfish-core')
//
///**
// * @ngdoc Controllers
// * @name MbPasswordCtrl
// * @description Store user password
// * 
// * This controller is used to update password and email of the current account.
// * 
// */
//.controller('MbPasswordCtrl', function($scope, $usr, $location, $navigator, $routeParams, $window, $errorHandler) {
//
//    this.sendingToken = false;
//    this.sendTokenState = null;
//    this.changingPass = false;
//    this.changingPassState = null;
//
//    $scope.data = {};
//    $scope.data.token = $routeParams.token;
//
//    /**
//     * Send request to the server to recover new version
//     * 
//     */
//    this.sendToken = function(data, form) {
//        if(ctrl.sendingToken){
//            return false;
//        }
//        ctrl.sendingToken = true;
//        data.callback = $location.absUrl() + '/token/{{token}}';
//        return $usr.resetPassword(data)//
//        .then(function() {
//            ctrl.sendTokenState = 'success';
//            $scope.sendingTokenMessage = null;
//        }, function(error){
//            ctrl.sendTokenState = 'fail';
//            $scope.sendingTokenMessage = $errorHandler.handleError(error, form);
//        })//
//        .finally(function(){
//            ctrl.sendingToken = false;
//        });
//    }
//
//    /**
//     * Change password of the current user.
//     * 
//     */
//    this.changePassword = function(param, form) {
//        if(ctrl.changingPass){
//            return false;
//        }
//        ctrl.changingPass = true;
//        var data = {
//                'oldPass' : param.old,
//                'newPass' : param.newPass,
//                'token' : param.token,
//                'new' : param.password
//        };
//        return $usr.resetPassword(data)//
//        .then(function() {
//            ctrl.changePassState = 'success';
//            $scope.changePassMessage = null;
//            $navigator.openView('users/login');
//        }, function(error){
//            ctrl.changePassState = 'fail';
//            $scope.changePassMessage = $errorHandler.handleError(error, form);
//        })//
//        .finally(function(){
//            ctrl.changingPass = false;
//        });
//    }
//
//    this.back = function() {
//        $window.history.back();
//    }
//
//    /*
//     * Support old system
//     */
//    var ctrl = this;
//    $scope.sendToken = function(){
//        ctrl.sendToken();
//    };
//    $scope.changePassword = function(){
//        ctrl.changePassword();
//    };
//    $scope.cancel = function(){
//        ctrl.back();
//    };
//
//});
//

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
 * @ngdoc Controllers
 * @name MbPreferenceCtrl
 * @description Show a preference page
 * 
 * Display preference view and load its controller.
 * 
 */
.controller('MbPreferenceCtrl', function($scope, $routeParams, $navigator, $preferences) {

	$preferences.page($routeParams.preferenceId)
	.then(function(preference) {
		$scope.preference = preference;
	}, function() {
		$navigator.openPage('preferences');
	});
	
	$scope.preferenceId = $routeParams.preferenceId;
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
 * @ngdoc Controllers
 * @name MbPreferencesCtrl
 * @description Manages preferences page
 * 
 * In the preferences page, all configs of the system are displayed and
 * users are able to change them. These preferences pages are related to
 * the current SPA usually.
 * 
 */
.controller('MbPreferencesCtrl',function($scope, $preferences) {

	/**
	 * Open a preference page
	 * 
	 * @memberof MbPreferencesCtrl
	 */
	function openPreference(page) {
		$preferences.openPage(page);
	}

	// Load settings
	$preferences.pages()//
	.then(function(list) {
		$scope.preferenceTiles = [];
		$scope.pages = [];
		for (var i = 0; i < list.items.length; i++) {
			var page = list.items[i];
			if(!page.hidden){ // Filter hidden items
				$scope.preferenceTiles.push({
					colspan : 1,
					rowspan : 1,
					page : page
				});
				$scope.pages.push(page);
			}
		}
	});
	
	$scope.openPreference = openPreference;
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
 * @ngdoc Controllers
 * @name MbProfileCtrl
 * @description Manages profile of a user
 * 
 */
.controller('MbProfileCtrl', function ($scope, $rootScope, $translate, $window, UserProfile) {
    
    // set initial data
    this.user = null;
    this.profile = null;
    this.loadingProfile = false;
    this.savingProfile = false;

    /*
     * - normal
     * - edit
     */
    this.avatarState = 'normal';

    /**
     * Loads user data
     * 
     * @returns
     */
    this.loadUser = function() {
        this.user = $rootScope.app.user.current;//
        if (!this.user) {
            alert($translate.instant('Fail to load user.'));
            return;
        }
        this.loadProfile();
    }

    this.loadProfile = function() {
        if (this.loadinProfile) {
            return;
        }
        this.loadingProfile = true;
        var ctrl = this;
        return this.user.getProfiles()//
        .then(function (profiles) {
            ctrl.profile = angular.isDefined(profiles.items[0]) ? profiles.items[0] : new UserProfile();
            return ctrl.profile;
        }, function () {
            alert($translate.instant('Fial to load profile.'));
        })//
        .finally(function () {
            ctrl.loadingProfile = false;
        });
    }

    /**
     * Save current user
     * 
     * @returns
     */
    this.save = function() {
        if (this.savingProfile) {
            return;
        }
        this.savingProfile = true;
        var $promise = angular.isDefined(this.profile.id) ? this.profile.update() : this.user.putProfile(this.profile);
        var ctrl = this;
        return $promise//
        .then(function () {
            toast($translate.instant('Save is successfull.'));
        }, function () {
            alert($translate.instant('Fail to save item.'));
        })//
        .finally(function () {
            ctrl.savingProfile = false;
        });
    }

    this.back = function() {
        $window.history.back();
    }
    
    this.deleteAvatar = function(){
        var ctrl = this;
        confirm('Delete the avatar?')
        .then(function(){
            ctrl.avatarState = 'working';
            return ctrl.user.deleteAvatar();
        })
        .finally(function(){
            ctrl.avatarState = 'normal';
        });
    }
    
    this.uploadAvatar = function(files){
        if (!angular.isArray(files) || !files.length) {
        }
        var file = null;
        file = files[0].lfFile;
        this.avatarLoading = true;
        var ctrl = this;
        this.user.uploadAvatar(file)
        .then(function(){
            // TODO: reload the page
        })
        .finally(function(){
            ctrl.avatarLoading = false;
            ctrl.avatarState = 'normal';
        });
    }
    
    this.editAvatar = function(){
        this.avatarState = 'edit';
    }
    
    this.cancelEditAvatar = function(){
        this.avatarState = 'normal';
    }

    /*
     * To support old version of the controller
     */
    var ctrl = this;
    $scope.load = function(){
        ctrl.loadUser();
    };
    $scope.reload = function(){
        ctrl.loadUser();
    };
    $scope.save = function(){
        ctrl.save();
    };
    $scope.back = function(){
        ctrl.back();
    };
    $scope.cancel =  function(){
        ctrl.back();
    };
    
    // Load account information
    this.loadUser();
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
 * @ngdoc Controllers
 * @name AmdRolesCtrl
 * @description Manages list of roles
 * 
 * 
 */
.controller('MbRolesCtrl', function($scope, $usr, $q, $controller) {
	angular.extend(this, $controller('MbItemsCtrl', {
		$scope : $scope
	}));

	// Overried the function
	this.getSchema = function() {
		return $q.resolve({
			name : 'role',
			properties : [ {
				name : 'Id',
				type : 'int'
			} ]
		});
	};
	// get accounts
	this.getItems = function(parameterQuery) {
		return $usr.getRoles(parameterQuery);
	};
	// get an account
	this.getItem = function(id) {
		return $usr.getRole(id);
	};
	// // Add item
	// this.addItem = function(){
	// return $usr.newAccount(item);
	// };
	// delete account
	this.deleteItem = function(item) {
		return $usr.deleteRole(item.id);
	};
    
    this.init();
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
/*
 * 
 */
.controller('AmWbSeenCmsContentsCtrl',function ($scope, $cms, $q, $controller, uuid4) {

    /*
     * Extends collection controller
     */
    angular.extend(this, $controller('AmWbSeenAbstractCollectionCtrl',
            {
        $scope : $scope
            }));

    // Override the schema function
    this.getSchema = function () {
        return $cms.contentSchema();
    };

    // get contents
    this.getItems = function (parameterQuery) {
        return $cms.getContents(parameterQuery);
    };

    // get a content
    this.getItem = function (id) {
        return $cms.getContent(id);
    };

    // delete account
    this.deleteItem = function (content) {
        return $cms.deleteContent(content.id);
    };

    /**
     * Uploads a file on the server.
     * 
     * To upload the file there are two actions:
     * 
     * <ul>
     * <li>create a new content</li>
     * <li>upload content value</li>
     * </ul>
     * 
     * This function change the state of the controller into the
     * working.
     */
    this.uploadFile = function (content, file) {
        /*
         * upload file
         */
        function uploadContentValue(newContent) {
            if (file) {
                return newContent.uploadValue(file)//
                .then(function () {
                    return newContent;
                });
            }
            return $q.resolve(newContent);
        }

        // XXX: maso, 2018: check content is not anonymous
        return $cms.putContent(content)//
        .then(uploadContentValue);
    }

    this.init();
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
 * @ngdoc Controllers
 * @name AmdAccountsCtrl
 * @description Manages and display list of accounts
 * 
 * This controller is used in accounts list.
 * 
 */
.controller('MbAccountsCtrl', function ($scope, $usr, $controller) {
    angular.extend(this, $controller('MbItemsCtrl', {
        $scope : $scope
    }));

    // Overried the function
    this.getSchema = function () {
        return $usr.accountSchema();
    };
    // get accounts
    this.getItems = function (parameterQuery) {
        return $usr.getAccounts(parameterQuery);
    };
    // get an account
    this.getItem = function (id) {
        return $usr.getAccount(id);
    };
    // delete account
    this.deleteItem = function (item) {
        return $usr.deleteAccount(item.id);
    };

    this.init();
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
 * @ngdoc Controllers
 * @name AmdGroupsCtrl
 * @description Manages list of groups
 * 
 */
.controller('MbGroupsCtrl', function ($scope, $usr, $controller) {
    angular.extend(this, $controller('MbItemsCtrl', {
        $scope : $scope
    }));

    // Overried the function
    this.getSchema = function () {
        return $usr.groupSchema();
    };
    // get accounts
    this.getItems = function (parameterQuery) {
        return $usr.getGroups(parameterQuery);
    };
    // get an account
    this.getItem = function (id) {
        return $usr.getGroup(id);
    };
    // Add item
    this.addItem = function () {
        return $usr.newAccount(item);
    };
    // delete account
    this.deleteItem = function (item) {
        return $usr.deleteRole(item.id);
    };

    this.init();
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
 * @ngdoc Controllers
 * @name AmdAccountsCtrl
 * @description Manages and display list of accounts
 * 
 * This controller is used in accounts list.
 * 
 */
.controller('MbProfilesCtrl', function ($scope, $usr, $controller) {
	angular.extend(this, $controller('MbItemsCtrl', {
		$scope: $scope
	}));

	// Overried the function
	this.getSchema = function(){
		return $usr.profileSchema();
	};
	
	// get accounts
	this.getItems = function(parameterQuery){
		return $usr.getAccounts(parameterQuery);
	};
	// get an account
	this.getItem = function(id){
		return $usr.getAccount(id);
	};
	// delete account
	this.deleteItem = function(item){
		return $usr.deleteAccount(item.id);
	};
    
    this.init();
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
 * @ngdoc Controllers
 * @name MbThemesCtrl
 * @description Dashboard
 * 
 */
.controller('MbThemesCtrl', function($scope, $mdTheming) {
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
 * @ngdoc Controllers
 * @name AmdToolbarCtrl
 * @description Toolbar
 * 
 */
.controller('MbToolbarDashboardCtrl', function($scope, $actions, $mdSidenav/*, $monitor*/) {
	$scope.toolbarMenu = $actions.group('mb.toolbar.menu');
	
	function toggleNavigationSidenav(){
		$mdSidenav('navigator').toggle();
	}
	
	function toggleMessageSidenav(){
		$mdSidenav('messages').toggle();
	}
	
	$scope.toggleNavigationSidenav = toggleNavigationSidenav;
	$scope.toggleMessageSidenav = toggleMessageSidenav;
	
	// watch messages
        // TODO: Masood, 2018: $monitor should be updated based on version 2.
//	var handler;
//	$monitor.monitor('message', 'count')//
//	.then(function(monitor){
//		handler = monitor.watch(function(a, old, n){
//			$scope.messageCount = n;
//		});
//		monitor.refresh();
//	});
//	$scope.$on('$destroy', handler);
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
 * @ngdoc Directives
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
 * @ngdoc Directives
 * @name mb-badge
 * @description Display a badge on items
 * 
 */
.directive('mbBadge', function($mdTheming, $rootScope) {
	
	function __badge_toRGB(color){
		var split = (color || '').split('-');
		if (split.length < 2) {
			split.push('500');
		}
		
		var hueA = split[1] || '800'; // '800'
		var colorR = split[0] || 'primary'; // 'warn'
		
		var theme = $mdTheming.THEMES[$rootScope.app.setting.theme || $rootScope.app.config.theme || 'default'];
		if(typeof theme === 'undefined'){
			theme = $mdTheming.THEMES['default'];
		}
		var colorA = theme.colors[colorR] ?  theme.colors[colorR].name : colorR;
		var colorValue = $mdTheming.PALETTES[colorA][hueA] ? $mdTheming.PALETTES[colorA][hueA].value : $mdTheming.PALETTES[colorA]['500'].value;
		return 'rgb(' + colorValue.join(',') + ')';
	}

	function postLink(scope, element, attributes) {
		$mdTheming(element);
		
		function style(where, color) {
			if (color) {
				element.css(where, __badge_toRGB(color));
			}
		}
//		function getPosition(){
//				return {
//					top: element.prop('offsetTop'),
//					left: element.prop('offsetLeft'),
//					width: element.prop('offsetWidth'),
//					height: element.prop('offsetHeight')
//				};
//		}
		scope.$watch(function() {
			return attributes.mbBadgeColor;
		}, function(value){
			style('color', value);
		});
		scope.$watch(function() {
			return attributes.mbBadgeFill;
		}, function(value){
			style('background-color', value);
		});
	}
	
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		link: postLink,
		template: function(/*element, attributes*/) {
			return '<div class="mb-badge" ng-transclude></div>';
		}
	};
});

angular.module('mblowfish-core')
.directive('mbBadge', function($mdTheming, $mdColors, $timeout, $window, $compile, $rootScope) {

	
	function __badge_toRGB(color){
		var split = (color || '').split('-');
		if (split.length < 2) {
			split.push('500');
		}
		
		var hueA = split[1] || '800'; // '800'
		var colorR = split[0] || 'primary'; // 'warn'
		
		var theme = $mdTheming.THEMES[$rootScope.app.setting.theme || $rootScope.app.config.theme || 'default'];
		if(typeof theme === 'undefined'){
			theme = $mdTheming.THEMES['default'];
		}
		var colorA = theme.colors[colorR] ?  theme.colors[colorR].name : colorR;
		var colorValue = $mdTheming.PALETTES[colorA][hueA] ? $mdTheming.PALETTES[colorA][hueA].value : $mdTheming.PALETTES[colorA]['500'].value;
		return 'rgb(' + colorValue.join(',') + ')';
	}

	function postLink(scope, element, attributes) {
		$mdTheming(element);
		//
		var parent = element.parent();
		var bg = angular.element('<div></div>');
		var link = $compile(bg);
		var badge = link(scope);

		var offset = parseInt(attributes.mdBadgeOffset);
		if (isNaN(offset)) {
			offset = 10;
		}
		
		function style(where, color) {
			if (color) {
				badge.css(where, __badge_toRGB(color));
			}
		}
		function getPosition(){
				return {
					top: element.prop('offsetTop'),
					left: element.prop('offsetLeft'),
					width: element.prop('offsetWidth'),
					height: element.prop('offsetHeight')
				};
		}

		function position(value) {
			var top = element.prop('offsetTop');
			badge.css({
				'display' : attributes.mbBadge && top ? 'initial' : 'none',
				'left' : value.left + value.width - 20 + offset + 'px',
				'top' : value.top + value.height - 20 + offset + 'px'
			});
		}

//		function update () {
//			position(getPosition());
//		}
		
		badge.addClass('mb-badge');
		badge.css('position', 'absolute');
		parent.append(badge);
		scope.$watch(function() {
			return attributes.mbBadgeColor;
		}, function(value){
			style('color', value);
		});
		scope.$watch(function() {
			return attributes.mbBadgeFill;
		}, function(value){
			style('background-color', value);
		});
		scope.$watch(function() {
			return attributes.mbBadge;
		}, function(value){
			badge.text(value);
			badge.css('display', value ? 'initial' : 'none');
		});
		
		scope.$watch(getPosition, function(value) {
			position(value);
		}, true);
		
//		angular.element($window)
//		.bind('resize', function(){
//			update();
//		});
	}
	return {
        priority: 100,
		restrict: 'A',
		link: postLink
	};
});

/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
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
 * @ngdoc Directives
 * @name mb-captcha
 * @description Adding captcha value
 * 
 * In some case, user must send captcha to the server fro auth. This a directive
 * to enablie captcha
 * 
 */
.directive('mbCaptcha', function() {

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
//        var ngModel=ctrls[1];

        function validate(){
            if(form){
                form.$setValidity('captcha', scope.required === false ? null : Boolean(scope.response));
            }
        }

//        function destroy() {
//            if (form) {
//                // reset the validity of the form if we were removed
//                form.$setValidity('captcha', null);
//            }
//        }


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
        templateUrl: 'views/directives/mb-captcha.html',
        scope: {
            response: '=?ngModel'
        },
        link: postLink
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
 * @ngdoc Directives
 * @name mb-datepicker
 * @descritpion Date picker
 * 
 * Select a date based on local.
 * 
 */
.directive('mbDatepicker', function($mdUtil, $rootScope) {

    // **********************************************************
    // Private Methods
    // **********************************************************
    function postLink(scope, element, attr, ctrls) {
        scope.app = $rootScope.app;
        var ngModelCtrl = ctrls[0] || $mdUtil.fakeNgModel();

        function render() {
            if(!ngModelCtrl.$modelValue){
                scope.date = null;
                return;
            }
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
            if(!scope.date) {
                ngModelCtrl.$setViewValue(null);
                return;
            }
            var date = moment(scope.date) //
            .utc() //
            .format('YYYY-MM-DD HH:mm:ss');
            ngModelCtrl.$setViewValue(date);
        }

        ngModelCtrl.$render = render;
        scope.$watch('date', setValue);
    }


    return {
        replace : false,
        template : function(){
            if($rootScope.app.calendar === 'Gregorian'){
                return '<md-datepicker ng-model="date" md-hide-icons="calendar" md-placeholder="{{placeholder || \'Enter date\'}}"></md-datepicker>';
            }
            return '<md-persian-datepicker ng-model="date" md-hide-icons="calendar" md-placeholder="{{placeholder || \'Enter date\'}}"></md-persian-datepicker>';
        },
        restrict : 'E',
        scope : {
            minDate : '=mbMinDate',
            maxDate : '=mbMaxDate',
            placeholder: '@mbPlaceholder',
            hideIcons: '@?mbHideIcons'
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
 * @ngdoc Directives
 * @name mb-dynamic-tabs
 * @description Display tabs dynamically
 * 
 * In some case, a dynamic tabs are required. This module add them dynamically.
 * 
 */
.directive('mbDynamicTabs', function($wbUtil, $q, $rootScope, $compile, $controller) {
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


	function link($scope, $element) {
		// Load pages in scope
		function loadPage(index){
			var jobs = [];
			var pages2 = [];


			// 1- Find element
			var target = $element.find('#' + CHILDREN_AUNCHOR);

			// 2- Clear childrens
			target.empty();

			// 3- load pages
			var page = $scope.mbTabs[index];
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
							$element : element
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
		
		// Index of selected page
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
			mbTabs: '='
		},
		templateUrl: 'views/directives/mb-dynamic-tabs.html',
		link: link
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
 * @ngdoc Directives
 * @name mb-error-messages
 * @description An error message display
 */
.directive('mbErrorMessages', function($compile) {

    /*
     * Link function
     */
    function postLink(scope, element){

        /**
         * Original element which replaced by this directive.
         */
        var origin = null;

        scope.errorMessages = function(err){
            if(!err) {
                return;
            }
            var message = {};
            message[err.status]= err.statusText;
            message[err.data.code]= err.data.message;
            return message;
        };

        scope.$watch(function(){
            return scope.mbErrorMessages;
        }, function(value){	
            if(value){
                var tmplStr = 
                    '<div ng-messages="errorMessages(mbErrorMessages)" role="alert" multiple>'+
                    '	<div ng-messages-include="views/mb-error-messages.html"></div>' +
                    '</div>';
                var el = angular.element(tmplStr);
                var cmplEl = $compile(el);
                var myEl = cmplEl(scope);
                origin = element.replaceWith(myEl);
            } else if(origin){
                element.replaceWith(origin);
                origin = null;
            }
        });
    }

    /*
     * Directive
     */
    return {
        restrict: 'A',
        scope:{
            mbErrorMessages : '='
        },
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
 * @ngdoc Directives
 * @name mb-infinate-scroll
 * @description Infinet scroll
 * 
 * 
 * Manage scroll of list
 */
.directive('mbInfinateScroll', function ($parse, $q, $timeout) {
    // FIXME: maso, 2017: tipo in diractive name (infinite)
    function postLink(scope, elem, attrs) {
        var raw = elem[0];

        /*
         * Load next page
         */
        function loadNextPage() {
            // Call the callback for the first time:
            var value = $parse(attrs.mbInfinateScroll)(scope);
            return $q.when(value)//
            .then(function (value) {
                if (value) {
                    return $timeout(function () {
                        if (raw.scrollHeight <= raw.offsetHeight) {
                            return loadNextPage();
                        }
                    }, 100);
                }
            });
        }

        /*
         * Check scroll state and update list
         */
        function scrollChange() {
            if (raw.scrollTop + raw.offsetHeight + 5 >= raw.scrollHeight) {
                loadNextPage();
            }
        }

        // adding infinite scroll class
        elem.addClass('mb-infinate-scroll');
        elem.on('scroll', scrollChange);
        loadNextPage();
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
 * @ngdoc Directives
 * @name mb-navigation-path
 * @description Display current navigation path of system
 * 
 * Navigation path is a menu which is updated by the $navigation service. This menu
 * show a chain of menu items to show the current path of the system. It is very
 * usefull to show current path to the users.
 * 
 * 
 */
.directive('mbNavigationBar' , function($actions, $navigator) {


	/**
	 * Init the bar
	 */
	function postLink(scope) {
		scope.isVisible = function(menu){
			// default value for visible is true
			if(angular.isUndefined(menu.visible)){
				return true;
			}
			if(angular.isFunction(menu.visible)){
				return menu.visible();
			}
			return menu.visible;
		};
		
		scope.goToHome = function(){
			$navigator.openPage('');
		};
		
		/*
		 * maso, 2017: Get navigation path menu. See $navigator.scpoePath for more info
		 */
		scope.pathMenu = $actions.group('navigationPathMenu');
	}
	
    return {
        restrict : 'E',
        replace: false,
        templateUrl: 'views/directives/mb-navigation-bar.html',
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
 * @ngdoc Directives
 * @name mb-pagination-bar
 * @property {Object}    mb-model           -Data model
 * @property {function}  mb-reload          -Reload function
 * @property {Array}     mb-sort-keys       -Array
 * @property {Array}     mb-more-actions    -Array
 * @property {string}    mb-title           -String
 * @property {string}    mb-icon            -String
 * @description Pagination bar
 *
 * Pagination parameters are a complex data structure and it is hard to manage
 * it. This is a toolbar to manage the pagination options.
 */
.directive('mbPaginationBar',  function($window,$timeout,$mdMenu, $parse) {

	function postLink(scope, element, attrs) {

		var query = {
				sortDesc: true,
				sortBy: typeof scope.mbSortKeys === 'undefined' ? 'id' : scope.mbSortKeys[0],
						searchTerm: null
		};
		/*
		 * مرتب سازی مجدد داده‌ها بر اساس حالت فعلی
		 */
		function __reload(){
			if(!angular.isDefined(attrs.mbReload)){
				return;
			}
			$parse(attrs.mbReload)(scope.$parent);
		}
		/**
		 * ذخیره اطلاعات آیتم‌ها بر اساس مدل صفحه بندی
		 */
		function exportData(){
			if(!angular.isFunction(scope.mbExport)){
				return;
			}
			scope.mbExport(scope.mbModel);
		}

		function searchQuery(searchText){
			scope.mbModel.setQuery(searchText);
			__reload();
		}

		function focusToElementById(id){
			$timeout(function(){
				var searchControl;
				searchControl=$window.document.getElementById(id);
				searchControl.focus();
			}, 50 );
		}

		scope.showBoxOne=false;
		scope.focusToElement=focusToElementById;
		// configure scope:
		scope.search = searchQuery;
		scope.__reload = __reload;
		scope.query=query;
		if(angular.isFunction(scope.mbExport)){
			scope.exportData = exportData;
		}
		if(typeof scope.mbEnableSearch === 'undefined'){
			scope.mbEnableSearch = true;
		}

		scope.$watch('query', function(){
			__reload();
		}, true);

	}

	return {
		restrict : 'E',
		templateUrl: 'views/directives/mb-pagination-bar.html',
		scope : {
			/*
			 * مدل صفحه بندی را تعیین می‌کند که ما اینجا دستکاری می‌کنیم.
			 */
			mbModel : '=',
			/*
			 * تابعی را تعیین می‌کند که بعد از تغییرات باید برای مرتب سازی
			 * فراخوانی شود. معمولا بعد تغییر مدل داده‌ای این تابع فراخوانی می‌شود.
			 */
			mbReload : '@?',
			/*
			 * تابعی را تعیین می‌کند که بعد از تغییرات باید برای ذخیره آیتم‌های موجود در لیست
			 * فراخوانی شود. این تابع معمولا باید بر اساس تنظیمات تعیین شده در مدل داده‌ای کلیه آیتم‌های فهرست را ذخیره کند.
			 */
			mbExport : '=',
			/*
			 * یک آرایه هست که تعیین می‌که چه کلید‌هایی برای مرتب سازی باید استفاده
			 * بشن.
			 */
			mbSortKeys: '=',

			/* titles corresponding to sort keys */
			mbSortKeysTitles: '=?',

			/*
			 * فهرستی از عمل‌هایی که می‌خواهیم به این نوار ابزار اضافه کنیم
			 */
			mbMoreActions: '=',

			mbTitle: '@?',
			mbIcon: '@?',

			mbEnableSearch: '=?'
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
 * @ngdoc Directives
 * @name mb-panel-sidenav-anchor
 * @description Display a sidenave anchor
 * 
 */
.directive('mbPanelSidenavAnchor', function ($route, $sidenav, $rootScope, $mdSidenav, $q,
        $wbUtil, $controller, $compile) {

    /*
     * Bank of sidnav elements.
     */
    var elementBank = angular.element('<div></div>');

    /*
     * Load page and create an element
     */
    function _loadPage($scope, page, prefix, postfix) {
        // 1- create scope
        var childScope = $scope.$new(false, $scope);
        childScope = Object.assign(childScope, {
            app : $rootScope.app,
            _page : page,
            _visible : function () {
                if (angular.isFunction(this._page.visible)) {
                    var v = this._page.visible(this);
                    if (v) {
                        $mdSidenav(this._page.id).open();
                    } else {
                        $mdSidenav(this._page.id).close();
                    }
                    return v;
                }
                return true;
            }
        });

        // 2- create element
        return $wbUtil
        .getTemplateFor(page)
        .then(
                function (template) {
                    var element = angular
                    .element(prefix + template + postfix);
                    elementBank.append(element);

                    // 3- bind controller
                    var link = $compile(element);
                    if (angular.isDefined(page.controller)) {
                        var locals = {
                                $scope : childScope,
                                $element : element
                        };
                        var controller = $controller(
                                page.controller, locals);
                        if (page.controllerAs) {
                            childScope[page.controllerAs] = controller;
                        }
                        element
                        .data(
                                '$ngControllerController',
                                controller);
                    }
                    return {
                        element : link(childScope),
                        page : page
                    };
                });
    }

    function postLink($scope, $element) {
        var _sidenaves = [];

        /*
         * Remove all sidenaves
         */
        function _removeElements(pages, elements) {
            var cache = [];
            for (var i = 0; i < elements.length; i++) {
                var flag = false;
                for (var j = 0; j < pages.length; j++) {
                    if (pages[j].id === elements[i].page.id) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    elements[i].element.detach();
                    elements[i].cached = true;
                    cache.push(elements[i]);
                } else {
                    elements[i].element.remove();
                }
            }
            return cache;
        }

        function _getSidenavElement(page) {
            for (var i = 0; i < _sidenaves.length; i++) {
                if (_sidenaves[i].page.id === page.id) {
                    return $q.when(_sidenaves[i]);
                }
            }
            return _loadPage(
                    $scope,
                    page,
                    '<md-sidenav md-theme="{{app.setting.theme || app.config.theme || \'default\'}}" md-theme-watch md-component-id="{{_page.id}}" md-is-locked-open="_visible() && (_page.locked && $mdMedia(\'gt-sm\'))" md-whiteframe="2" ng-class="{\'md-sidenav-right\': app.dir==\'rtl\',  \'md-sidenav-left\': app.dir!=\'rtl\', \'mb-sidenav-ontop\': !_page.locked}" layout="column">',
            '</md-sidenav>').then(
                    function (pageElement) {
                        _sidenaves.push(pageElement);
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
            $q
            .all(jobs)
            //
            .then(
                    function () {
                        // Get Anchor
                        var _anchor = $element;
                        // maso, 2018: sort
                        _sidenaves
                        .sort(function (a, b) {
                            return (a.page.priority || 10) > (b.page.priority || 10);
                        });
                        for (var i = 0; i < _sidenaves.length; i++) {
                            var ep = _sidenaves[i];
                            if (ep.chached) {
                                continue;
                            }
                            if (ep.page.position === 'start') {
                                _anchor
                                .prepend(ep.element);
                            } else {
                                _anchor
                                .append(ep.element);
                            }
                        }
                    });
        }

        /*
         * Reload UI
         * 
         * Get list of sidenavs for the current state and load
         * them.
         */
        function _reloadUi() {
            if (!angular.isDefined($route.current)) {
                return;
            }
            // Sidenavs
            var sdid = $route.current.sidenavs || $sidenav.defaultSidenavs();
            sdid = sdid.slice(0);
            sdid.push('settings');
            sdid.push('help');
            sdid.push('messages');
            var sidenavs = [];
            var jobs = [];
            angular.forEach(sdid, function (item) {
                jobs.push($sidenav.sidenav(item).then(
                        function (sidenav) {
                            sidenavs.push(sidenav);
                        }));
            });
            $q.all(jobs).then(function () {
                _reloadSidenavs(sidenavs);
            });
        }

        $scope.$watch(function () {
            return $route.current;
        }, _reloadUi);
    }

    return {
        restrict : 'A',
        priority : 601,
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
 * @ngdoc Directives
 * @name mb-panel-toolbar-anchor
 * @description display a toolbar
 * 
 */
.directive('mbPanelToolbarAnchor', function($route, $toolbar, $rootScope, $q, $wbUtil, $controller, $compile) {

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
                    var v = this._page.visible(this);
                    return v;
                }
                return true;
            }
        });

        // 2- create element
        return $wbUtil.getTemplateFor(page)
        .then(function(template) {
            var element = angular.element(prefix + template + postfix);

            // 3- bind controller
            var link = $compile(element);
            if (angular.isDefined(page.controller)) {
                var locals = {
                        $scope : childScope,
                        $element : element
                };
                var controller = $controller(page.controller, locals);
                if (page.controllerAs) {
                    childScope[page.controllerAs] = controller;
                }
                element.data('$ngControllerController', controller);
            }
            return {
                element : link(childScope),
                page : page
            };
        });
    }

    function postLink($scope, $element) {
        var _toolbars = [];

        /*
         * Remove all toolbars
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


        function _getToolbarElement(page){
            for(var i = 0; i < _toolbars.length; i++){
                if(_toolbars[i].page.id === page.id){
                    return $q.when(_toolbars[i]);
                }
            }

            var prefix = page.raw ? '' : '<md-toolbar ng-show="_visible()" md-theme="{{app.setting.theme || app.config.theme || \'default\'}}" md-theme-watch layout="column" layout-gt-xs="row" layout-align="space-between stretch">';
            var postfix = page.raw ? '' : '</md-toolbar>';
            return _loadPage($scope, page, prefix, postfix)
            .then(function(pageElement) {
                _toolbars.push(pageElement);
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
                var _anchor = $element;
                // maso, 2018: sort
                _toolbars.sort(function(a, b){
                    return (a.page.priority || 10) > (b.page.priority || 10);
                });
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
            // Toolbars
            var tids = $route.current.toolbars || $toolbar.defaultToolbars();
            if(angular.isArray(tids)){
                var ts = [];
                var jobs = [];
                angular.forEach(tids, function(item){
                    jobs.push($toolbar.toolbar(item)
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

//        function _isVisible(item){
//            if (angular.isFunction(item.visible)) {
//                var v = item.visible(this);
//                return v;
//            }
//            if(angular.isDefined(item.visible)){
//                // item.visible is defined but is not a function
//                return item.visible;
//            }
//            return true;
//        }

        $scope.$watch(function(){
            return $route.current;
        },_reloadUi);
//      _reloadUi();
    }


    return {
        restrict : 'A',
//      replace : true,
//      templateUrl : 'views/directives/mb-panel.html',
        link : postLink
    };
});
/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
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
 * @ngdoc Directives
 * @name mb-panel
 * @restrict E
 * @scope true
 * @description A dynamic panel with toolbar and sidenav
 * 
 * Applications needs an area to show modules, navigator, message and the
 * other visual parts of the system. This is a general application panel
 * which must be placed to the index.html directly.
 * 
 * @usage To load the application add this directive to the index.html.
 *        All internal elements will be removed after the module loaded.
 *        <hljs lang='html'> <body> <amd-panel> <div
 *        class='amd-preloader'> Loading.... </div> </amd-panel> ....
 *        </body> </hljs>
 * 
 */
.directive('mbPanel', function ($route, $rootScope, $actions, $injector) {
	/*
	 * evaluate protect function
	 */
	function canAccess(route) {
		if (!route.protect) {
			return true;
		}
		if (angular.isFunction(route.protect)) {
			return !$injector.invoke(route.protect, route);
		}
		return route.protect;
	}

	function postLink($scope) {
		// State machin to controlle the view
		var stateMachine = new machina.Fsm({
			/* 
			 * the initialize method is called right after the FSM
			 * instance is constructed, giving you a place for any
			 * setup behavior, etc. It receives the same
			 * arguments (options) as the constructor function.
			 */
			initialize: function (/*options*/) {
				// your setup code goes here...
				$scope.status = this.initialState;
			},
			namespace: 'mb-panel-controller',
			initialState: 'loading',
			states: {
				ready: {
					routeChange: function (route) {
						if (route.protect && !canAccess(route)) {
							this.transition('accessDenied');
							return;
						}
					},
					appStateChange: function (state) {
						// return if state is ready
						if (state.startsWith('ready')) {
							return;
						} else {
							this.transition('loading');
						}
					},
					userStateChange: function (userIsAnonymous) {
						if(!userIsAnonymous){
							return;
						}
						if (this.getRoute().protect && userIsAnonymous) {//user is anonymous
							this.transition('login');
						} else {
							this.transition('readyAnonymous');
						}
					}
				},
				accessDenied: {
					routeChange: function (route) {
						if (!route.protect || canAccess(route)) {
							this.transition('ready');
						}
					},
					appStateChange: function (state) {
						// return if state is ready
						if (state.startsWith('ready')) {
							return;
						} else {
							this.transition('loading');
						}
					},
					userStateChange: function (userIsAnonymous) {
						if (userIsAnonymous) {//user is anonymous
							this.transition('login');
						}
					}
				},
				readyAnonymous: {
					routeChange: function (route) {
						// TODO: maso, change to login page
						if (route.protect) {
							this.transition('login');
						}
					},
					appStateChange: function (state) {
						// return if state is ready
						if (state.startsWith('ready')) {
							return;
						} else {
							this.transition('loading');
						}
					},
					userStateChange: function () {//user is not anonymous
						this.transition('ready');
					}
				},
				loading: {
					// routeChange: function(route){},
					appStateChange: function (state) {
						if (state.startsWith('ready')) {
							var route = this.getRoute();
							if ($rootScope.app.user.anonymous) {
								if (route.protect) {
									this.transition('login');
								} else {
									this.transition('readyAnonymous');
								}
							} else {
								if (!route.protect || canAccess(route)) {
									this.transition('ready');
								} else {
									this.transition('accessDenied');
								}
							}
						}
					}
				},
				login: {
					routeChange: function (route) {
						if (!route.protect) {
							this.transition('readyAnonymous');
						}
					},
					appStateChange: function (state) {
						// return if state is ready
						if (state.startsWith('ready')) {
							return;
						} else {
							this.transition('loading');
						}
					},
					userStateChange: function () {//user is not anonymous
						var route = this.getRoute();
						if (!canAccess(route)) {
							this.transition('accessDenied');
						} else {
							this.transition('ready');
						}
					}
				}
			},
			/*
			 * Handle route change event
			 */
			routeChange: function (route) {
				this.currentRoute = route;
				if (!route) {
					return;
				}
				this.handle('routeChange', route);
			},
			/*
			 * Handle application state change
			 */
			appStateChange: function (state) {
				this.handle('appStateChange', state);
			},
			/*
			 * Handle user state change
			 */
			userStateChange: function (userIsAnonymous) {
				this.userState = userIsAnonymous;
				this.handle('userStateChange', userIsAnonymous);
			},

			/*
			 * Get current route
			 */
			getRoute: function () {
				return this.currentRoute || $route.current;
			},

			/*
			 * Get current status
			 */
			getState: function () {
				return this.appState || $rootScope.app.state.status;
			}
		});

		// I'd like to know when the transition event occurs
		stateMachine.on('transition', function () {
			if (stateMachine.state.startsWith('ready')) {
				$scope.status = 'ready';
				return;
			}
			$scope.status = stateMachine.state;
		});

		$scope.$watch(function () {
			return $route.current;
		}, function (route) {
			$actions.group('navigationPathMenu').clear();
			if (route) {
				stateMachine.routeChange(route.$$route);
				// Run state integeration
				if (route.$$route && angular.isFunction(route.$$route.integerate)) {
					$injector.invoke(route.$$route.integerate, route.$$route);
				}
			} else {
				stateMachine.routeChange(route);
			}
		});

		$rootScope.$watch('app.state.status', function (appState) {
			stateMachine.appStateChange(appState);
		});

		$scope.$watch('app.user.anonymous', function (val) {
			stateMachine.userStateChange(val);
		});

	}

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'views/directives/mb-panel.html',
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

angular
        .module('mblowfish-core')
        /**
         * @ngdoc Directives
         * @name mb-preference-page
         * @description Preference page
         * 
         * Preference page
         * 
         */
        .directive('mbPreferencePage', function ($compile, $controller, $preferences, $wbUtil,
                $rootScope, $mdTheming) {

            var bodyElementSelector = 'div#mb-preference-body';
            var placeholderElementSelector = 'div#mb-preference-placeholder';
            /**
             * 
             */
            function loadPreference($scope, page, anchor) {
                // 1- create scope
                var childScope = $scope.$new(false, $scope);
                childScope.app = $rootScope.app;
                // childScope.wbModel = model;

                // 2- create element
                $wbUtil
                        .getTemplateFor(page)
                        .then(function (template) {
                            var element = angular.element(template);
                            $mdTheming(element);

                            // 3- bind controller
                            var link = $compile(element);
                            if (angular
                                    .isDefined(page.controller)) {
                                var locals = {
                                    $scope: childScope,
                                    $element: element
                                            // TODO: maso, 2018:
                                };
                                var controller = $controller(
                                        page.controller, locals);
                                if (page.controllerAs) {
                                    childScope[page.controllerAs] = controller;
                                }
                                element
                                        .data(
                                                '$ngControllerController',
                                                controller);
                            }

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
            function postLink(scope, element) {
                // Get Anchor
                var _anchor = element; //
//        .children(bodyElementSelector) //
//        .children(placeholderElementSelector);
                // TODO: maso, 2018: check auncher exist
                scope.$watch('mbPreferenceId', function (id) {
                    if (id) {
                        $preferences.page(id)
                                .then(function (page) {
                                    loadPreference(scope, page, _anchor);
                                }, function () {
                                    // TODO: maso, 2017: handle errors
                                });
                    }
                });
            }

            return {
                restrict: 'E',
                templateUrl: 'views/directives/mb-preference-page.html',
                replace: true,
                scope: {
                    mbPreferenceId: '='
                },
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
 * @ngdoc Directives
 * @name mb-preloading
 * @description Show a preloading of a module
 * 
 * The mb-preload-animate is added to element automatically to add user
 * animation.
 * 
 * The class mb-preload is added if the value of the directive is true.
 * 
 * @example To add preload:
 * 
 * <pre><code>
 *  	&lt;div mb-preload=&quot;preloadState&quot;&gt; DIV content &lt;/div&gt;
 * </code></pre>
 * 
 * 
 * User can define a custom class to add at preload time.
 * 
 * @example Custom preload class
 * 
 * <pre><code>
 *  	&lt;div mb-preload=&quot;preloadState&quot; mb-preload-class=&quot;my-class&quot;&gt; DIV content &lt;/div&gt;
 * </code></pre>
 * 
 */
.directive('mbPreloading', function(/*$animate*/) {
	var PRELOAD_CLASS = 'mb-preload';
	var PRELOAD_ANIMATION_CLASS = 'mb-preload-animate';

	/*
	 * Init element for preloading
	 */
	function initPreloading(scope, element/*, attr*/) {
		element.addClass(PRELOAD_ANIMATION_CLASS);
	}

	/*
	 * Remove preloading
	 */
	function removePreloading(scope, element, attr) {
		if (attr.mbPreloadingClass) {
			element.addClass(attr.mbPreloadingClass);
		}
		element.removeClass(PRELOAD_CLASS);
	}

	/*
	 * Adding preloading
	 */
	function addPreloading(scope, element, attr) {
		if (attr.mbPreloadingClass) {
			element.addClass(attr.mbPreloadingClass);
		}
		element.addClass(PRELOAD_CLASS);
	}

	/*
	 * Post linking
	 */
	function postLink(scope, element, attr) {
		initPreloading(scope, element, attr);
		scope.$watch(function(){
			return scope.$eval(attr.mbPreloading);
		}, function(value) {
			if (!value) {
				removePreloading(scope, element, attr);
			} else {
				addPreloading(scope, element, attr);
			}
		});
	}

	return {
		restrict : 'A',
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
	 * @ngdoc Directives
	 * @name mb-titled-block
	 * @descritpion Title block
	 * 
	 * 
	 */
	.directive('mbTitledBlock', function () {
	    return {
		replace: true,
		restrict: 'E',
		transclude: true,
		scope: {
		    mbTitle: '@?',
		    mbIcon: '@?',
		    mbProgress: '<?',
		    mbMoreActions: '='
		},
		/*
		 * فهرستی از عمل‌هایی که می‌خواهیم به این نوار ابزار اضافه کنیم
		 */
		
		templateUrl: 'views/directives/mb-titled-block.html'
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
 * @ngdoc Directives
 * @name mb-tree-heading
 * @description Tree heading
 * 
 * Display tree heading
 * 
 */
.directive('mbTreeHeading', function(/*$animate*/) {
	return {
        restrict: 'E',
        replace: true,
        scope: {
            mbSection: '='
        },
		templateUrl: 'views/directives/mb-tree-heading.html'
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
 * @ngdoc Directives
 * @name mb-tree-link
 * @description Tree link
 * 
 * Display and link section item
 * 
 */
.directive('mbTreeLink', function() {
	return {
		restrict : 'E',
		scope: {
			mbSection: '='
		},
		templateUrl: 'views/directives/mb-tree-link.html',
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
				// XXX: maso, 2017: check action call
				return $navigator.openPage(section.link);
			};
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
 * @ngdoc Directives
 * @name mb-tree-toggle
 * @description Tree toggle
 * 
 * Display tree toggle
 * 
 */
.directive('mbTreeToggle', function($timeout, $animateCss, $mdSidenav, $mdMedia, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            mbSection: '='
        },
        templateUrl: 'views/directives/mb-tree-toggle.html',
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
//              return console.warn('mb-tree: `menuToggle` cannot find ul element');
                return;
            }



            function toggleMenu(open) {
//              if (!$mdMedia('gt-sm') && !$mdSidenav('left').isOpen() && open) {
//              return;
//              }
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
                return $ctrl.isOpen($scope.mbSection);
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
                if(!section){
                    for(var i = 0; i < $scope.mbSection.sections.length; i++){
                        if(!$rootScope.$eval($scope.mbSection.sections[i].hidden)){
                            return true;
                        }
                    }
                    return false;
                }
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

//          $scope.$on('SS_SIDENAV_FORCE_SELECTED_ITEM', function (event, args) {
//          if ($scope.section && $scope.section.pages) {
//          for (var i = $scope.section.pages.length - 1; i >= 0; i--) {
//          var _e = $scope.section.pages[i];
            //
//          if (args === _e.id) {
//          $scope.toggle($scope.section);
//          $state.go(_e.state);
//          }
//          };
//          }
//          });
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
 * @ngdoc Directives
 * @name mb-tree
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
        link: function($scope, $element) {
            // TODO: maso, 2017:
            /**
             * Checks if the section is visible
             */
            function isVisible(section){
                if(!$element.has('li').length){
                    return false;
                }
                if(section.hidden){
                    return !$rootScope.$eval(section.hidden);
                }
                return true;
            }
            $scope.isVisible = isVisible;
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

            $scope.isOpen = isOpen;
            $scope.toggle = toggle;
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
 * @ngdoc Directives
 * @name mb-user-menu
 * @restrict E
 * @description Display global user menu
 * 
 * Load current user action into the scope. It is used to show user menu
 * in several parts of the system.
 */
.directive('mbUserMenu', function($actions, $app, $mdSidenav) {
	/**
	 * Post link 
	 */
	function postLink($scope) {
		// maso, 2017: Get user menu
		$scope.menu = $actions.group('mb.user');
		$scope.logout = $app.logout;
		$scope.settings = function(){
			return $mdSidenav('settings').toggle();
		};
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
 * @ngdoc Directives
 * @name mb-user-toolbar
 * @description User toolbar
 * 
 * Display tree menu
 * 
 */
.directive('mbUserToolbar', function($actions) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'views/directives/mb-user-toolbar.html',
		link: function($scope) {
			$scope.menu = $actions.group('mb.user');
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
           * @ngdoc Factories
           * @name Action
           * @description An action item
           * 
           */
          .factory('Action', function ($injector, $navigator) {

              var action = function (data) {
                  if (!angular.isDefined(data)) {
                      data = {};
                  }
                  angular.extend(this, data, {
                      priority: data.priority || 10
                  });
                  this.visible = this.visible || function () {
                      return true;
                  };
                  return this;
              };

              action.prototype.exec = function ($event) {
                  if (this.action) {
                      $injector.invoke(this.action, this);
                  } else if (this.url){
                      $navigator.openPage(this.url);
                  }
                  if ($event) {
                      $event.stopPropagation();
                      $event.preventDefault();
                  }
              };

              return action;
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
 * @ngdoc Factories
 * @name ActionGroup
 * @description Groups of actions.
 * 
 */
.factory('ActionGroup', function() {
	var actionGroup  = function(data) {
		if(!angular.isDefined(data)){
			data = {};
		}
		angular.extend(this, data, {
			priority: data.priority || 10,
			items: []
		});
	};

	/**
	 * Clear the items list from action group
	 * 
	 * @name clear
	 * @memberof ActionGroup
	 */
	actionGroup.prototype.clear = function(){
		this.items = [];
	};
	
	return actionGroup;
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
	 * @ngdoc Factories
	 * @name httpRequestInterceptor
	 * @description An interceptor to handle the error 401 of http response
	 * @see https://docs.angularjs.org/api/ng/service/$http#interceptors
	 */
	.factory('httpRequestInterceptor', function ($q, $injector) {
	    return {
		'responseError': function (rejection) {
		    var app = $injector.get('$app');
		    // do something on error
		    if (rejection.status === 401) {
			app.logout();
		    }
		    return $q.reject(rejection);
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
/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('mblowfish-core')

.filter('currencyFilter', function (numberFilter, translateFilter) {

    return function (price, unit) {

        if (!price) {
            return translateFilter('free');
        }
        if (unit === 'iran-rial' || unit === 'iran-tooman') {
            return numberFilter(price) + ' '
                    + translateFilter(unit);
        } else if (unit === 'bahrain-dinar') {
            return numberFilter(price) + ' '
                    + translateFilter('bahrain-dinar');
        } else if (unit === 'euro') {
            return numberFilter(price) + ' '
                    + translateFilter('euro');
        } else if (unit === 'dollar') {
            return translateFilter('dollar') + ' '
                    + numberFilter(price);
        } else if (unit === 'pound') {
            return translateFilter('pound') + ' '
                    + numberFilter(price);
        } else if (unit === 'iraq-dinar') {
            return numberFilter(price) + ' '
                    + translateFilter('iraq-dinar');
        } else if (unit === 'kuwait-dinar') {
            return numberFilter(price) + ' '
                    + translateFilter('kuwait-dinar');
        } else if (unit === 'oman-rial') {
            return numberFilter(price) + ' '
                    + translateFilter('oman-rial');
        } else if (unit === 'turkish-lira') {
            return numberFilter(price) + ' '
                    + translateFilter('turkish-lira');
        } else if (unit === 'uae-dirham') {
            return numberFilter(price) + ' '
                    + translateFilter('uae-dirham');
        } else {
            return numberFilter(price) + ' ?';
        }
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
 * @ngdoc Filters
 * @name mbDate
 * @description # Format date
 */
.filter('mbDate', function($rootScope) {
    return function(inputDate, format) {
        if(!inputDate){
            return '';
        }
        try {
            var mf = format || $rootScope.app.setting.dateFormat || $rootScope.app.config.dateFormat || 'jYYYY-jMM-jDD hh:mm:ss';
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
.run(function($notification, $help) {

    /**
     * Display help for an item
     * 
     * @memberof window
     * @name openHelp
     * @params item {object} item which is target of the help system
     */
    window.openHelp = function(item){
        return $help.openHelp(item);
    };

    // Hadi 1396-12-22: کد زیر توی amh بود.
    window.alert = $notification.alert;
    window.confirm = $notification.confirm;
    window.prompt = $notification.prompt;
    window.toast = $notification.toast;

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
.run(function ($toolbar, $sidenav, $rootScope, $navigator, $route, $actions, $help) {
	$actions.newAction({
		id: 'mb.preferences',
		priority: 15,
		icon: 'settings',
		title: 'Preferences',
		description: 'Open preferences panel',
		visible: function () {
			return $rootScope.app.user.owner;
		},
		action: function () {
			return $navigator.openPage('preferences');
		},
		groups: ['mb.toolbar.menu']
	});
	$actions.newAction({// help
		id: 'mb.help',
		priority: 15,
		icon: 'help',
		title: 'Help',
		description: 'Display help in sidenav',
		visible: function () {
			return $help.hasHelp($route.current);
		},
		action: function () {
			$help.openHelp($route.current);
		},
		groups: ['mb.toolbar.menu']
	});
		$actions.newAction({
		icon: 'person_outline',
		title: 'Profile',
		description: 'User profile',
		groups:['mb.user'],
		action: function(){
			return $navigator.openPage("users/profile");
		}
	});
	$actions.newAction({
		icon: 'person',
		title: 'Account',
		description: 'User account',
		groups:['mb.user'],
		action: function(){
			return $navigator.openPage("users/account");
		}
	});

	$toolbar.newToolbar({
		id: 'dashboard',
		title: 'Dashboard toolbar',
		description: 'Main dashboard toolbar',
		controller: 'MbToolbarDashboardCtrl',
		templateUrl: 'views/toolbars/mb-dashboard.html'
	});

	$sidenav.newSidenav({
		id: 'navigator',
		title: 'Navigator',
		description: 'Navigate all path and routs of the pandel',
		controller: 'AmdNavigatorCtrl',
		templateUrl: 'views/sidenavs/mb-navigator.html',
		locked: true,
		position: 'start'
	});
	$sidenav.newSidenav({
		id: 'help',
		title: 'Help',
		description: 'System online help',
		controller: 'MbHelpCtrl',
		templateUrl: 'views/sidenavs/mb-help.html',
		locked: true,
		visible: function () {
			return $rootScope.showHelp;
		},
		position: 'end'
	});
	$sidenav.newSidenav({
		id: 'settings',
		title: 'Options',
		description: 'User options',
		controller: 'MbOptionsCtrl',
		templateUrl: 'views/sidenavs/mb-options.html',
		locked: false,
		position: 'end'
	});
	$sidenav.newSidenav({
		id: 'messages',
		title: 'Messages',
		description: 'User message queue',
		controller: 'MessagesCtrl',
		templateUrl: 'views/sidenavs/mb-messages.html',
		locked: false,
		position: 'start'
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
 * دریچه‌های محاوره‌ای
 */
.run(function(appcache, $window, $rootScope) {

	var oldWatch;

	/*
	 * Reload the page
	 * 
	 * @deprecated use page service
	 */
	function reload() {
		$window.location.reload();
	}

	/*
	 * Reload the application
	 */
	function updateApplication() {
		var setting = $rootScope.app.config.update || {};
		if (setting.showMessage) {
			if(setting.autoReload) {
				alert('Application is update. Page will be reload automatically.')//
				.then(reload);
			} else {
				confirm('Application is update. Reload the page for new version?')//
				.then(reload);
			}
		} else {
			toast('Application is updated.');
		}
	}

	// Check update
	function doUpdate() {
		appcache.swapCache()//
		.then(updateApplication());
	}

	oldWatch = $rootScope.$watch('app.state.status', function(status) {
		if (status.startsWith('ready')) {
			// check for update
			return appcache//
			.checkUpdate()//
			.then(doUpdate);
			// Test
//			updateApplication();
			// Remove the watch
			oldWatch();
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

.run(function($window, $rootScope, $location) {
	if ($window.ga) {
		// initialize google analytics
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
 * حالت امنیتی را بررسی می‌کند
 * 
 * در صورتی که یک حالت حالتی امن باشد، و کاربر وارد سیستم نشده باشد، حالت ماشین
 * را به حالت لاگین می‌برد.
 */
.run(function($rootScope, $page, $location) {

	/**
	 * Rests settings of page (title, description, keywords and favicon) to values defined in branding
	 */
	function _initBranding() {
		if($rootScope.app.config){			
			$page.setTitle($rootScope.app.config.title);
			$page.setDescription($rootScope.app.config.description);
			$page.setKeywords($rootScope.app.config.keywords);
			$page.setFavicon($rootScope.app.config.favicon || $rootScope.app.config.logo);
		}
	}

	/**
	 * If an item of settings of page does not set yet, sets it by value defined in branding
	 */
	function _fillUnsetFields() {
		var config = $rootScope.app.config ? $rootScope.app.config : null;
		if(!config){
			return;
		}
		$page.setTitle($page.getTitle() || config.title);
		$page.setDescription($page.getDescription() || config.description);
		$page.setKeywords($page.getKeywords() || config.keywords);
		$page.setFavicon(config.favicon || config.logo);
		$page.setMeta('og:site_name', config.title);
	}
	/*
	 * Listen on change route
	 */
	$rootScope.$on('$routeChangeStart', function( /* event */ ) {
		_initBranding();
	});
	$rootScope.$on('$routeChangeSuccess', function( /*event, current*/ ) {
		var path = $location.absUrl();
		$page.setMeta('twitter:url', path) //
		.setMeta('og:url', path);
	});

	$rootScope.$watch(function(){
		var conf = $rootScope.app.config;
		if(!conf){
			return conf;
		}
		return conf.title +'#'+ conf.description +'#'+ conf.keywords +'#'+ conf.logo +'#'+ conf.favicon;
	}, function() {
		_fillUnsetFields();
	});

	$page.setMeta('twitter:card', 'summary');
	$page.setMeta('og:type', 'object');
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
 * Help dialog 
 */
.run(function($help, $rootScope, $route) {
    // Watch current state
    $rootScope.$watch(function(){
        return $route.current;
    }, 
    function(val){
        // TODO: maso, 2018: Check protection of the current route
        
        // set help page
        $help.setCurrentItem(val);
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
 * Init application resources
 */
.run(function($resource, $location,  $controller ) {

    function getDomain(){
        return $location.protocol() + //
        '://' + //
        $location.host() + //
        (($location.port() ? ':' + $location.port(): ''));
    }

//  TODO: maso, 2018: replace with class
    function getSelection(){
        if(!this.__selections){
            this.__selections = angular.isArray(this.value) ? this.value : [];
        }
        return this.__selections;
    }

    function getIndexOf(list, item) {
        if(!angular.isDefined(item.id)) {
            return list.indexOf(item);
        }
        for(var i = 0; i < list.length; i++){
            if(list[i].id === item.id){
                return i;
            }
        }
    }

    function setSelected(item, selected) {
        var selectionList = this.getSelection();
        var index = getIndexOf(selectionList,item);
        if(selected) {
            // add to selection
            if(index >= 0){
                return;
            }
            selectionList.push(item);
        } else {
            // remove from selection
            if (index > -1) {
                selectionList.splice(index, 1);
            }
        }
    }

    function isSelected(item){
        var selectionList = this.getSelection();
        return getIndexOf(selectionList,item) >= 0;
    }




    /**
     * @ngdoc Resources
     * @name Account
     * @description Get an account from resource
     * 
     * Enable user to select an account
     */
    $resource.newPage({
        label : 'Account',
        type : 'account',
        templateUrl : 'views/resources/mb-accounts.html',
        /*
         * @ngInject
         */
        controller : function($scope) {
            // TODO: maso, 2018: load selected item
            $scope.multi = false;
            this.value = $scope.value;
            this.setSelected = function(item) {
                $scope.$parent.setValue(item);
                $scope.$parent.answer();
            };
            this.isSelected = function(item){
                return item === this.value || item.id === this.value.id;
            };
        },
        controllerAs : 'resourceCtrl',
        priority : 8,
        tags : [ 'account' ]
    });

    /**
     * @ngdoc Resources
     * @name Accounts
     * @description Gets list of accounts
     * 
     * Display a list of accounts and allow user to select them.
     */
    $resource.newPage({
        label : 'Accounts',
        type : 'account-list',
        templateUrl : 'views/resources/mb-accounts.html',
        /*
         * @ngInject
         */
        controller : function($scope) {
            // TODO: maso, 2018: load selected item
            $scope.multi = true;
            this.value = $scope.value;
            this.setSelected = function(item, selected) {
                this._setSelected(item, selected);
                $scope.$parent.setValue(this.getSelection());
            };
            this._setSelected = setSelected;
            this.isSelected = isSelected;
            this.getSelection = getSelection;
        },
        controllerAs : 'resourceCtrl',
        priority : 8,
        tags : [ 'accounts' ]
    });

    // Resource for role-list
    $resource.newPage({
        label : 'Role List',
        type : 'role-list',
        templateUrl : 'views/resources/mb-roles.html',
        /*
         * @ngInject
         */
        controller : function($scope) {
            // TODO: maso, 2018: load selected item
            $scope.multi = true;
            this.value = $scope.value;
            this.setSelected = function(item, selected) {
                this._setSelected(item, selected);
                $scope.$parent.setValue(this.getSelection());
            };
            this._setSelected = setSelected;
            this.isSelected = isSelected;
            this.getSelection = getSelection;
        },
        controllerAs : 'resourceCtrl',
        priority : 8,
        tags : [ 'roles' ]
    });


    // Resource for group-list
    $resource.newPage({
        label : 'Group List',
        type : 'group-list',
        templateUrl : 'views/resources/mb-groups.html',
        /*
         * @ngInject
         */
        controller : function($scope) {
            // TODO: maso, 2018: load selected item
            $scope.multi = true;
            this.value = $scope.value;
            this.setSelected = function(item, selected) {
                this._setSelected(item, selected);
                $scope.$parent.setValue(this.getSelection());
            };
            this._setSelected = setSelected;
            this.isSelected = isSelected;
            this.getSelection = getSelection;
        },
        controllerAs : 'resourceCtrl',
        priority : 8,
        tags : [ 'groups' ]
    });



    /**
     * @ngdoc WB Resources
     * @name cms-content-image
     * @description Load an Image URL from contents
     */
    $resource.newPage({
        type: 'cms-content-image',
        icon: 'image',
        label: 'Images',
        templateUrl: 'views/resources/mb-cms-images.html',
        controller: function($scope){

            /*
             * Extends collection controller
             */
            angular.extend(this, $controller('AmWbSeenCmsContentsCtrl', {
                $scope: $scope
            }));

            /**
             * Sets the absolute mode
             * 
             * @param {boolean}
             *            absolute mode of the controler
             */
            this.setAbsolute = function(absolute) {
                this.absolute = absolute;
            }

            /**
             * Checks if the mode is absolute
             * 
             * @return absolute mode of the controller
             */
            this.isAbsolute = function(){
                return this.absolute;
            }
            
            /*
             * Sets value
             */
            this.setSelected = function(content){
                var path = '/api/v2/cms/contents/'+content.id+'/content';
                if(this.isAbsolute()){
                    path = getDomain() + path;
                }
                this.value = path;
                $scope.$parent.setValue(path);
            }
            
            // init the controller
            this.init()
        },
        controllerAs: 'ctrl',
        priority: 10,
        tags: ['image']
    });
    // TODO: maso, 2018: Add video resource
    // TODO: maso, 2018: Add audio resource

    /**
     * @ngdoc WB Resources
     * @name content-upload
     * @description Upload a content and returns its URL
     */
    $resource.newPage({
        type:'content-upload',
        icon: 'file_upload',
        label: 'Upload',
        templateUrl: 'views/resources/mb-cms-content-upload.html',
        /*
         * @ngInject
         */
        controller: function($scope, $cms, uuid4) {

            /*
             * Extends collection controller
             */
            angular.extend(this, $controller('AmWbSeenCmsContentsCtrl', {
                $scope: $scope
            }));

            this.absolute = false;
            this.files = [];

            /**
             * Sets the absolute mode
             * 
             * @param {boolean}
             *            absolute mode of the controler
             */
            this.setAbsolute = function(absolute) {
                this.absolute = absolute;
            }

            /**
             * Checks if the mode is absolute
             * 
             * @return absolute mode of the controller
             */
            this.isAbsolute = function(){
                return this.absolute;
            }

            /*
             * Add answer to controller
             */
            var ctrl = this;
            $scope.answer = function(){
                // create data
                var data = {};
                data.name = this.name || uuid4.generate();
                data.description = this.description || 'Auto loaded content';
                var file = null;
                if (angular.isArray(ctrl.files) && ctrl.files.length) {
                    file = ctrl.files[0].lfFile;
                    data.title = file.name;
                }
                // upload data to server
                return ctrl.uploadFile(data, file)//
                .then(function(content) {
                    var value = '/api/v2/cms/contents/' + content.id + '/content';
                    if(ctrl.isAbsolute()){
                        value = getDomain() + value;
                    }
                    return value;
                })//
                .catch(function(){
                    alert('Failed to create or upload content');
                });
            };
            // init the controller
            this.init()
        },
        controllerAs: 'ctrl',
        priority: 1,
        tags: ['image', 'audio', 'vedio', 'file']
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
.run(function($options, $preferences) {
	// Pages
	$preferences
	.newPage({
		id : 'local',
		title : 'local',
		description : 'manage dashboard locality and language.',
		templateUrl : 'views/preferences/mb-local.html',
		controller: 'MbLocalCtrl',
		icon : 'language',
		tags : [ 'local', 'language' ]
	})//
	.newPage({
		id : 'brand',
		title : 'Branding',
		description : 'Manage application branding such as title, logo and descritpions.',
		templateUrl : 'views/preferences/mb-brand.html',
//		controller : 'settingsBrandCtrl',
		icon : 'copyright',
		priority: 2,
		required: true,
		tags : [ 'brand' ]
	})//
	.newPage({
		id : 'google-analytic',
		title : 'Google Analytic',
		templateUrl : 'views/preferences/mb-google-analytic.html',
		description : 'Enable google analytic for your application.',
		icon : 'timeline',
		tags : [ 'analysis' ]
	})
	.newPage({
		id: 'update',
		templateUrl : 'views/preferences/mb-update.html',
		title: 'Update application',
		description: 'Settings of updating process and how to update the application.',
		icon: 'autorenew'
	});
	
	// Settings
	$options.newPage({
		title: 'Local',
		templateUrl: 'views/options/mb-local.html',
		controller: 'MbLocalCtrl',
		tags: ['local']
	});
	$options.newPage({
		title: 'Theme',
		controller: 'MbThemesCtrl',
		templateUrl: 'views/options/mb-theme.html',
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
 * @ngdoc Services
 * @name $actions
 * @description Manage application actions
 * 
 * Controllers and views can access actions which is registered by an
 * applications. This service is responsible to manage global actions.
 * 
 */
.service('$actions', function(Action, ActionGroup) {
	var _actionsList = [];
	var _actionsMap = {};

	var _groupsList = [];
	var _groupsMap = [];

	function _actions() {
		return {
			'items' : _actionsList
		};
	}

	// TODO: maso, 2018: add document
	function _newAction(data) {
		// Add new action
		var action = new Action(data);
		_actionsMap[action.id] = action;
		_actionsList.push(action);
		for (var i = 0; i < action.groups.length; i++) {
			var group = _group(action.groups[i]);
			group.items.push(action);
		}
		if (action.scope) {
			action.scope.$on('$destroy', function() {
				_removeAction(action);
			});
		}
		return action;
	}

	// TODO: maso, 2018: add document
	function _action(actionId) {
		var action = _actionsMap[actionId];
		if (action) {
			return action;
		}
	}

	// TODO: maso, 2018: add document
	function _removeAction(action) {
		_actionsMap[action.id] = null;
		var index = _actionsList.indexOf(action);
		if (index > -1) {
			_actionsList.splice(index, 1);
			for (var i = 0; i < action.groups.length; i++) {
				var group = _group(action.groups[i]);
				var j = group.items.indexOf(action);
				if (j > -1) {
					group.items.splice(j, 1);
				}
			}
			return action;
		}
	}

	// TODO: maso, 2018: add document
	function _groups() {
		return {
			'items' : _groupsList
		};
	}

	// TODO: maso, 2018: add document
	function _newGroup(groupData) {
		// TODO: maso, 2018: assert id
		return _group(groupData.id, groupData);
	}

	// TODO: maso, 2018: add document
	function _group(groupId, groupData) {
		var group = _groupsMap[groupId];
		if (!group) {
			group = new ActionGroup();
			group.id = groupId;
			_groupsMap[group.id] = group;
			_groupsList.push(group);
		}
		if (groupData) {
			angular.extend(group, groupData);
		}
		return group;
	}

	return {
		// actions
		actions : _actions,
		newAction : _newAction,
		action : _action,
		removeAction : _removeAction,

		// groups
		groups : _groups,
		newGroup : _newGroup,
		group : _group
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
angular.module('mblowfish-core') //

/**
 * @ngdoc Services
 * @name $app
 * @description Application manager
 * 
 * $app manage the application life-cycle. It gets all required information from
 * server and store those in rootScope. So, in the scope of application everyone
 * who wants something about this type of information it should get them from
 * rootScope. Also, $app watch the rootScope and do all required tasks(such as
 * updating config into the server and etc.) automatically.
 * 
 * That way, the $app service is separated from directly responding to others.
 * Important: In this version, 'start', 'login' and 'logout' are exceptions and
 * could access directly from outside.
 * 
 * The pseudo-code of all works that the service performs is as follows:
 * 
 * <ol>
 * <li>Getting required information from the server and store in rootScope.</li>
 * <li>Watching the rootScope and do all required works. (such as updating
 * config into the server and etc.) automatically.</li>
 * <li>Managing an internally Finite State Machine(FSM) to control the state of
 * the app.</li>
 * <li>Performing login and logout.</li>
 * </ol> ## user
 * 
 * User information will be loaded on the start up and tracked during the
 * application life time. ## settings
 * 
 * Settings are stored in the local storage and each user can edit it directly. ##
 * Options
 * 
 * There is list of Key-Value stored in the sever and control the server
 * behaviors. In the. $app are called options. Options are read only and allow
 * clients to adapt to the server.
 * 
 * All options can access from view as:
 * 
 * <code><pre>
 * 	&lt;span&gt;{{app.options['captcha.engine']}}&lt;/span&gt;
 * </pre></code>
 * 
 * In the code:
 * 
 * <code><pre>
 * var a = $rootScope.app.options['captcha.engine'];
 * </pre></code> ## configurations
 * 
 * Configuration is stored on server an owners are allowed to update. Do not
 * store secure properties on configuration.
 * 
 * Configuration is a CMS file.
 * 
 * 
 * @property {object} app - Application repository.
 * @property {string} app.dir - Application direction which is updated
 *           automatically baed on configuaration and setting.
 * @property {object} app.setting - Application setting.
 * @property {object} app.config - Application setting.
 * @property {object} app.user - Current user information
 * @property {object} app.user.profile - The first profile of current user
 */
.service('$app', function ($rootScope, $usr, $q, $cms, $translate, $http,
        $httpParamSerializerJQLike, $mdDateLocale, $localStorage, QueryParameter, $tenant) {

    var apps = this;

    // Constants
    var APP_PREFIX = 'angular-material-blowfish-';
    var APP_CNF_MIMETYPE = 'application/amd-cnf';
    var USER_DETAIL_GRAPHQL = '{id, login, profiles{first_name, last_name, language, timezone}, roles{id, application, code_name}, groups{id, name, roles{id, application, code_name}}}';
    var OPTIONS_GRAPHQL = '{items{id, key,value}}';

    // the state machine
    var stateMachine;

    // states
    var APP_STATE_WAITING = 'waiting';
    var APP_STATE_LOADING = 'loading';

    // final states
    var APP_STATE_READY = 'ready';
    var APP_STATE_READY_NOT_CONFIGURED = 'ready_not_configured';
    var APP_STATE_OFFLINE = 'offline';
    var APP_STATE_FAIL = 'fail';

    var APP_EVENT_LOADED = 'loaded';
    var APP_EVENT_START = 'start';
    var APP_EVENT_NOT_FOUND = 'resource_not_found';
    var APP_EVENT_SERVER_ERROR = 'server_error';
    var APP_EVENT_NET_ERROR = 'network_error';


    var optionsQuery = new QueryParameter()//
    .put('graphql', OPTIONS_GRAPHQL);
    // All the things that are set up by $app service
    var app = {
            state: {
                // all states: waiting, loading, offline, app_not_configured,
                // ready, fail
                status: 'loading',
                stage: 'starting',
                message: null
            },
            logs: [],
            user: {
                current: {},
                profile : {},
                anonymous: true,
                administrator: false,
                owner: false,
                member: false,
                authorized: false
            },
            config: {},
            setting: {},
            options: {}
    };
    $rootScope.app = app;

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
    // Some controlling variables required in the state machine
    var ctrl = {
            user_loaded: false,
            options_loaded: false,
            configs_loaded: false
    };

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
     * Bind list of roles to app data
     */
    function _loadRolesOfUser(roles) {
        for (var i = 0; i < roles.length; i++) {
            var role = roles[i];
            app.user[role.application + '_' + role.code_name] = true;
        }
    }

    /**
     * تنظیم‌های نرم افزار را لود می‌کند.
     * 
     * @returns promiss
     */
    function loadApplicationConfig() {
        _loadingLog('loading configuration', 'fetch configuration document');

        ctrl.configs_loaded = false;
        ctrl.configs_fail = false;

        $cms.getContent(APP_PREFIX + app.key) //
        .then(function (content) {
            _loadingLog('loading configuration', 'fetch configuration content');
            app._acc = content;
            // load config file
            return app._acc.downloadValue();
        }, function(error){
            ctrl.configs_fail = true;
            stateMachine.error(error);
            // return empty config
            return {};
        })
        .then(function (appConfig) {
            app.config = angular.isObject(appConfig) ? appConfig : {};
        })
        .finally(function(){
            ctrl.configs_loaded = true;
            stateMachine.loaded();
        });
    }

    /*
     * Loads current user informations
     * 
     * اطلاعات کاربر جاری از سرور دریافت شده و بر اساس اطلاعات مورد نیاز در سطح
     * نرم افزار پر می‌شود.
     * 
     * If there is a role x.y (where x is application code and y is code name)
     * in role list then the following var is added in user:
     * 
     * app.user.x_y
     * 
     */
    function loadUserProperty() {
        _loadingLog('loading user info', 'fetch user information');
        return $usr.getAccount('current', {graphql: USER_DETAIL_GRAPHQL}) //
        .then(function (user) {
            // load user info
            ctrl.user_loaded = true;
            // app user data
            app.user = {
                    anonymous: !user.id || user.id === 0,
                    current: user
            };
            // load the first profile of user
            if(angular.isArray(user.profiles)){
                app.user.profile = user.profiles.length? user.profiles[0] : {};
            }
            // load user roles
            _loadingLog('loading user info', 'user information loaded successfully');
            _loadingLog('loading user info', 'check user permissions');
            if (!app.user.anonymous) {
                _loadRolesOfUser(user.roles);
                for (var i = 0; i < user.groups.length; i++) {
                    _loadRolesOfUser(user.groups[i].roles);
                }
                //
                if (!user.isAnonymous()) {
                    app.user.owner = app.user.tenant_owner || app.user.core_owner || app.user.Pluf_owner || app.user.Core_owner;
                    app.user.administrator = app.user.owner;
                } else {
                    app.user.anonymous = true;
                }
            }
            stateMachine.loaded();
        }, function(error){
            ctrl.user_loaded = false;
            stateMachine.error(error);
        });
    }

    /*
     * Loads options
     */
    function loadOptions() {
        // TODO: Masood, 2018: options should be get from server. Now, its api
        // doesn't exist.
        _loadingLog('loading options', 'fetch options document');
        // get the options from server and save in app.options.
        app.options = {};
        return $tenant.getSettings(optionsQuery)
        .then(function (res) {
            for (var i = 0; i < res.items.length; i++) {
                var item = res.items[i];
                app.options[item.key] = item.value;
            }
            ctrl.options_loaded = true;
            stateMachine.loaded();
        }, function(error){
            stateMachine.error(error);
        });
    }

    /*
     * Loads local storage
     */
    function loadSetting() {
        _loadingLog('loading setting from local storage', 'fetch settings');
        /*
         * TODO: masood, 2018: The lines below is an alternative for lines above
         * but not recommended.
         * 
         * TODO: 'key' of app should be used $localStorage.setPrefix(key);
         */
        app.setting = $localStorage.$default({
            dashboardModel: {}
        });
        _loadingLog('setting loaded', 'fetch settings');
    }


    /*
     * Stores app configuration on the back end
     */
    function storeApplicationConfig() {
        appConfigDirty = true;
        if(appConfigLock){
            return;
        }
        if (!(app.user.core_owner || app.user.Pluf_owner || app.user.tenant_owner)) {
            return $q.reject({
                data: {
                    message: 'fail'
                }
            });
        }
        appConfigLock = true;
        var promise;
        if (app._acc) { // content loaded
            appConfigDirty = false;
            promise = app._acc.uploadValue(app.config);
        } else { // create content
            promise = $cms.putContent({
                name: APP_PREFIX + app.key,
                mimetype: APP_CNF_MIMETYPE
            }).then(function (content) {
                appConfigDirty = false;
                app._acc = content;
                stateMachine.loaded();
                return app._acc.uploadValue(app.config);
            }, function (error) {
                stateMachine.error(error);
            });
        } //
        return promise //
        .finally(function () {
            appConfigLock = false;
            if (appConfigDirty) {
                return storeApplicationConfig();
            }
        });
    }

    /*
     * State machine to handle life cycle of the system.
     */
    stateMachine = new machina.Fsm({
        initialize: function (/* options */) {
            app.state.status = APP_STATE_WAITING;
        },
        namespace: 'webpich.$app',
        initialState: APP_STATE_WAITING,
        states: {
            // Before the 'start' event occurs via $app.start().
            waiting: {
                _onEnter: function(){
                    loadUserProperty(); 
                    loadOptions();
                },
                start: APP_STATE_LOADING,
                network_error: APP_STATE_OFFLINE,
                server_error: APP_STATE_FAIL
            },
            // tries to load all part of system
            loading: {
                _onEnter: function () {
                    loadSetting(); 
                    loadApplicationConfig(); 
                },
                loaded: function () {
                    if (ctrl.user_loaded && ctrl.options_loaded && ctrl.configs_loaded) {
                        this.transition(APP_STATE_READY);
                    } else if (ctrl.user_loaded && ctrl.options_loaded && ctrl.configs_fail) {
                        this.transition(APP_STATE_READY_NOT_CONFIGURED);
                    }
                },
                server_error: APP_STATE_FAIL,
                network_error: APP_STATE_OFFLINE
            },
            // app is ready
            ready: {
                network_error: APP_STATE_OFFLINE
            },
            // app is ready with no config
            ready_not_configured: {
                loaded: function () {
                    if(ctrl.configs_loaded){
                        this.transition(APP_STATE_READY);
                    }
                },
                network_error: APP_STATE_OFFLINE
            },
            // server error
            fail: {},
            // net error
            offline: {}
        },

        /*
         * This handle load event of app
         * 
         * If a part of the app loaded then this handler fire an event and
         * update the app state.
         */
        loaded: function () {
            this.handle(APP_EVENT_LOADED);
        },

        /*
         * Fires start event
         */
        start: function () {
            this.handle(APP_EVENT_START);
        },

        /*
         * Handle HTTP response error.
         * 
         * If the is an error in loading and storing configuration then this
         * function checks and fire an event.
         */
        error: function ($error) {
            if ($error.status === 404) {
                this.handle(APP_EVENT_NOT_FOUND);
            } else if ($error.status === 500) {
                this.handle(APP_EVENT_SERVER_ERROR);
            } else if ($error.status === -1) {
                this.handle(APP_EVENT_NET_ERROR);
            }
        }
    });


    // I'd like to know when the transition event occurs
    stateMachine.on('transition', function () {
        _loadingLog('$app event handling', '$app state is changed from ' + app.state.status  + ' to '+ stateMachine.state);
        app.state.status = stateMachine.state;
    });

    /*
     * watch direction and update app.dir
     */
    $rootScope.$watch(function () {
        if (!app.config.local) {
            app.config.local = {};
        }
        return app.setting.dir || app.config.local.dir;
    }, function (value) {
        app.dir = value; // (app.setting.dir || app.config.local.dir)//old
        // version of app.js;
    });
    /*
     * watch local and update language
     */
    $rootScope.$watch(function () {
        // TODO: maso, 2018: remove this part in the next release
        if (!angular.isObject(app.config.local)) {
            app.config.local = {};
        }
        // Check language
        return app.setting.local || app.config.local.language || 'en';
    }, function (key) {
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
        $mdDateLocale.months = localeDate._months;
        $mdDateLocale.shortMonths = localeDate._monthsShort;
        $mdDateLocale.days = localeDate._weekdays;
        $mdDateLocale.shortDays = localeDate._weekdaysMin;
        // Optionaly let the week start on the day as defined by moment's locale
        // data
        $mdDateLocale.firstDayOfWeek = localeDate._week.dow;
    });

    /*
     * watch calendar
     */
    $rootScope.$watch(function () {
        return app.setting.calendar || app.config.calendar || 'Gregorian';
    }, function (key) {
        // 0- set app local
        app.calendar = key;
    });

    /*
     * watch application configuration and update app state
     */
    $rootScope.$watch('app.config', function () {
        if (app.state.status === APP_STATE_READY || app.state.status === APP_STATE_READY_NOT_CONFIGURED) {
            // TODO: maso, 2018: delay to save
            storeApplicationConfig();
        }
    }, true);

    /**
     * Start the application
     * 
     * this function is called when the app get started.
     * 
     * @memberof $app
     */
    function start(key) {
        app.key = key;
        stateMachine.start();
    }

    /**
     * Logins into the backend
     * 
     * @memberof $app
     * @param {object}
     *            credential of the user
     */
    function login(credential) {
        if (!app.user.anonymous) {
            return $q.resolve(app.user.current);
        }
        return $http({
            method: 'POST',
            url: '/api/v2/user/login',
            data: $httpParamSerializerJQLike(credential),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function () {
            loadUserProperty();
        });
    }

    /**
     * Application logout
     * 
     * Logout and clean user data, this will change state of the application.
     * 
     * @memberof $app
     */
    function logout() {
        var oldUser = $rootScope.app.user;
        if (oldUser.anonymous) {
            return $q.resolve(oldUser);
        }
        $rootScope.app.user = {};
        stateMachine.loaded();
        return $http({
            method: 'POST',
            url: '/api/v2/user/logout',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(function () {
            loadUserProperty();
        }, function () {
            // TODO: maso, 2018: fail to logout?!
            $rootScope.app.user = oldUser;
            stateMachine.loaded();
        });
    }

    // Init
    apps.start = start;
    apps.login = login;
    apps.logout = logout;
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
 * @ngdoc Services
 * @name $errorHandler
 * @description A service to handle errors in forms.
 * 
 * 
 * 
 */
.service('$errorHandler', function() {

	/**
	 * Checks status, message and data of the error. If given form is not null,
	 * it set related values in $error of fields in the form. It also returns a
	 * general message to show to the user.
	 */
	function handleError(error, form) {
		var message = null;
		if (error.status === 400 && form) { // Bad request
			message = 'Form is not valid. Fix errors and retry.';
			error.data.data.forEach(function(item) {
				form[item.name].$error = {};
				item.constraints.map(function(cons) {
					if (form[item.name]) {
						form[item.name].$error[cons.toLowerCase()] = true;
					}
				});
			});
		} else {
			message = error.data.message;
		}

		return message;
	}

	return {
		handleError : handleError
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
 * @ngdoc Services
 * @name $amdExport
 * @description Data model exporter
 * 
 * Export data model into a CSV file.
 * 
 */
.service('$amdExport', function(FileSaver, $q, QueryParameter) {

	/**
	 * 
	 * @param findMethod
	 * @param paginationParams
	 * @param type
	 * @param name
	 * @returns
	 */
	function exportList(objectRef, findMethod, QueryParameter, type, name) {
		var params = new QueryParameter();
		// TODO: maso, 2017: adding funnction to clone params
		//
		// Example: params = new QueryParameter(old);
		params.put('_px_q ', QueryParameter.get('_px_q'));
		params.put('_px_sk ', QueryParameter.get('_px_sk'));
		params.put('_px_so ', QueryParameter.get('_px_so'));
		params.put('_px_fk ', QueryParameter.get('_px_fk'));
		params.put('_px_fv ', QueryParameter.get('_px_fv'));
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
         * @ngdoc Services
         * @name $help
         * @description A help management service
         * 
         * Manage application help.
         * 
         * Set help id for an item:
         * 
         * <pre><code>
         * 	var item = {
         * 		...
         * 		helpId: 'help-id'
         * 	};
         * 	$help.openHelp(item);
         * </code></pre>
         * 
         * 
         * 
         * Open help for an item:
         * 
         * <pre><code>
         * $help.openHelp(item);
         * </code></pre>
         * 
         */
        .service('$help', function ($q, $rootScope, $translate, $injector) {

            var _tips = [];
            var _currentItem = null;

            /*
             * Get help id
             */
            function _getHelpId(item) {
                if (!item) {
                    return null;
                }
                var id = item.helpId;
                if (angular.isFunction(item.helpId)) {
                    return $injector.invoke(item.helpId, item);
                }
                return id;
            }

            /**
             * Adds new tip
             * 
             * New tip is added into the tips list.
             * 
             * @memberof $help
             * @param {object}
             *            tipData - Data of a tipe
             */
            function tip(tipData) {
                _tips.push(tipData);
                return this;
            }

            /**
             * List of tips
             * 
             * @memberof $help
             * @return {promise<Array>} of tips
             */
            function tips() {
                return $q.resolve({
                    items: _tips
                });
            }

            /**
             * Gets current item in help system
             * 
             * @memberof $help
             * @return {Object} current item
             */
            function currentItem() {
                return _currentItem;
            }

            /**
             * Sets current item in help system
             * 
             * @memberof $help
             * @params item {Object} target of the help system
             */
            function setCurrentItem(item) {
                _currentItem = item;
            }

            /**
             * Gets help path
             * 
             * @memberof $help
             * @params item {Object} an item to show help for
             * @return path of the help
             */
            function getHelpPath(item) {
                // Get from help id
                var myId = _getHelpId(item || _currentItem);
                if (myId) {
                    var lang = $translate.use();
                    // load content
                    return 'resources/helps/' + myId + '-' + lang + '.json';
                }

                return null;
            }

            /**
             * Check if there exist a help on item
             * 
             * @memberof $help
             * @params item {Object} an item to show help for
             * @return path if the item if exist help or false
             */
            function hasHelp(item) {
                return !!_getHelpId(item);
            }

            /**
             * Display help for an item
             * 
             * This function change current item automatically and display help for it.
             * 
             * @memberof $help
             * @params item {Object} an item to show help for
             */
            function openHelp(item) {
                if (!hasHelp(item)) {
                    return;
                }
                if (_currentItem === item) {
                    $rootScope.showHelp = !$rootScope.showHelp;
                    return;
                }
                setCurrentItem(item);
                $rootScope.showHelp = true;
            }

            /*
             * Service structure
             */
            return {
                tip: tip,
                tips: tips,

                currentItem: currentItem,
                setCurrentItem: setCurrentItem,
                openHelp: openHelp,
                hasHelp: hasHelp,
                getHelpPath: getHelpPath
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
 * @ngdoc Services
 * @name $language
 * @description 
 * Manages languages of the application.
 * This service provide functionality to switch between multiple languages.
 * Also provides functionlity to manage languages (add, remove or edit translations).
 * 
 */
.service('$language', function ($rootScope, $q, $translate) {

    /**
     * Returns language determined by given key.
     * 
     * @memberof $language
     * @param {string} language key - Key of the language
     * @return {object}  Returns language with given key. 
     * @Returns 'undefined' if language does not exist or is not loaded yet.
     */
    function language(key) {
        var languages = $rootScope.app.config.languages;
        if (!languages || !languages.length) {
            return undefined;
        }
        for (var i = 0; i < languages.length; i++) {
            if (languages[i].key === key) {
                return languages[i];
            }
        }
        return undefined;
    }

    /**
     * Returns list of defined and loaded languages.
     * 
     * @memberof $language
     * @return {promise<Array>} of languages
     */
    function languages() {
        var langs = $rootScope.app.config.languages;
        var res = {items: langs || []};
        return $q.when(res);


//      var deferred = $q.defer();
//deferred.resolve(res);
//      return deferred.promise;
    }

    /**
     * Adds a new language
     * 
     * @param {object} lang - Object contain information of a language.
     * 		A language object would contain following properties:
     * 
     * 		- key: a key to determin language (for example fa, en and so on)
     * 		- title: title for language (for example Persian, English, ...)
     * 		- dir: direction of language ('ltr' or 'rtl')
     * 		- map: translation table of language contains some key-values. 
     * 
     * @memberof $language
     */
    function newLanguage(lang) {
        if (!$rootScope.app.user.owner) {
            return $q.reject('not allowed');
        }
        if (!$rootScope.app.config.languages) {
            $rootScope.app.config.languages = [];
        } else {
            var languages = $rootScope.app.config.languages;
            for (var i = 0; i < languages.length; i++) {
                if (lang.key === languages[i].key) {
                    return $q.reject('Sorry! Languages with the same key are not allowed.');
                }
            }
        }
        $rootScope.app.config.languages.push(lang);
        $translate.refresh(lang.key);
        return $q.resolve(lang);
    }

    /**
     * Delete a language
     * 
     * @memberof $language
     * @param {object|string} lang - The Language to delete or key of language to delete
     * @return {promise} promise of deleted language
     */
    function deleteLanguage(lang) {
        if (!$rootScope.app.user.owner) {
            return $q.reject('not allowed');
        }
        var languages = $rootScope.app.config.languages;
        if (!languages || !languages.length) {
            return $q.reject('Not found');
        }
        var index = -1;
        if (angular.isString(lang)) {
            // lang is key of language
            for (var i = 0; i < languages.length; i++) {
                if (languages[i].key === lang) {
                    index = i;
                    break;
                }
            }
        } else {
            index = languages.indexOf(lang);
        }

        if (index !== -1) {
            languages.splice(index, 1);
            return $q.resolve(lang);
        }
        return $q.reject('Not found');
    }

    /**
     * Returns the language key of language that is currently loaded asynchronously.
     * 
     * @memberof $language
     * @return {string} language key
     */
    function proposedLanguage() {
        return $translate.proposedLanguage();
    }

    /**
     * Tells angular-translate which language to use by given language key. This 
     * method is used to change language at runtime. It also takes care of 
     * storing the language key in a configured store to let your app remember 
     * the choosed language.
     *
     * When trying to 'use' a language which isn't available it tries to load it 
     * asynchronously with registered loaders.
     * 
     * Returns promise object with loaded language file data or string of the 
     * currently used language.
     * 
     * If no or a falsy key is given it returns the currently used language key. 
     * The returned string will be undefined if setting up $translate hasn't 
     * finished.
     * 
     * @memberof $language
     * @param {string} key - Feature description.Language key
     * @return {Promise} Promise with loaded language data or the language key if a falsy param was given.
     * 
     */
    function use(key) {
        return $translate.use(key);
    }

    /**
     * Refreshes a translation table pointed by the given langKey. If langKey is not specified,
     * the module will drop all existent translation tables and load new version of those which
     * are currently in use.
     *
     * Refresh means that the module will drop target translation table and try to load it again.
     *
     * In case there are no loaders registered the refresh() method will throw an Error.
     *
     * If the module is able to refresh translation tables refresh() method will broadcast
     * $translateRefreshStart and $translateRefreshEnd events.
     *
     * @example
     * // this will drop all currently existent translation tables and reload those which are
     * // currently in use
     * $translate.refresh();
     * // this will refresh a translation table for the en_US language
     * $translate.refresh('en_US');
     *
     * @param {string} langKey A language key of the table, which has to be refreshed
     *
     * @return {promise} Promise, which will be resolved in case a translation tables refreshing
     * process is finished successfully, and reject if not.
     */
    function refresh(key) {
        return $translate.refresh(key);
    }

    /*
     * Service struct
     */
    return {
        language: language,
        languages: languages,
        newLanguage: newLanguage,
        deleteLanguage: deleteLanguage,
        proposedLanguage: proposedLanguage,
        refresh: refresh,
        use: use
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
 * @ngdoc Services
 * @name $metrics
 * @description collects and manages metrics from application and server
 * 
 * Metrics are stored in application space:
 * 
 * In view:
 * 
 * <code><pre>
 * 	<span>{{app.metrics['message.count']}}</span>
 * </pre></code>
 * 
 * In code:
 * 
 * <code><pre>
 * 	var messageCount = $rootScope.app.metrics['message.count'];
 * </pre></code>
 * 
 * Metrics must be tracked by the following 
 */
.service('$metrics', function($q/*, $timeout, $monitor*/) {
	/*
	 * store list of metrics
	 */
//	var metrics = [];
//	
//	var remoteMetrics = []
//	var localMetrics = []

	// XXX: maso, 1395: metric interval
//	var defaultInterval = 60000;


	/**
	 * Add a monitor in track list
	 * 
	 * با این فراخوانی مانیتور معادل ایجاد شده و به عنوان نتیجه برگردانده
	 * می‌شود.
	 * 
	 * <pre><code>
	 * $metrics.trackMetric('message.count')//
	 * 		.then(function() {
	 * 				// Success
	 * 			}, function(){
	 * 				// error
	 * 			});
	 * </code></pre>
	 * 
	 * @memberof $monitor
	 * @param {string}
	 *            key to track
	 * @param {string}
	 *            $scope which is follower (may be null)
	 *            
	 * @return {promise(PMonitor)}
	 */
	function trackMetric(/*key, $scope*/) {
		// track metric with key
		return $q.resolve('hi');
	}


	/**
	 * Break a monitor
	 * 
	 * @param {Object}
	 *            monitor
	 */
	function breakMonitor(/*key*/) {
//		var def = $q.defer();
//		$timeout(function() {
//			// XXX: maso, 1395: remove monitor
//			def.resolve(monitor);
//		}, 1);
//		return def.promise;
	}


	this.breakMonitor = breakMonitor;
	this.trackMetric = trackMetric;
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
 * @ngdoc Services
 * @name $navigator
 * @description A default system navigator
 *
 * # Item
 *
 * An item is a single navigation part which may be a page, link, action, and etc.
 *
 */
.service('$navigator', function($q, $route, $mdDialog, $location, $window) {

    var _items = [];
    var _groups = [];

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
    function groups(/*paginationParam*/){
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
        if(page && page.toLowerCase().startsWith('http')){
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
    function isPageSelected(/*page*/){
        // XXX: maso, 2017: check if page is the current one
        return false;
    }

    function loadAllItems(pagination) {
        $q.resolve(items(pagination));
    }

    return {
        loadAllItems : loadAllItems,
        openDialog : openDialog,
        openPage: openPage,
        isPageSelected: isPageSelected,
        // Itmes
        items : items,
        newItem: newItem,
        deleteItem: removeItem,
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
 * @ngdoc Services
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
			templateUrl : 'views/dialogs/mb-alert.html',
			config : {
				message : message
			}
		})
		// return true even it the page is canceled
		.then(function(){
			return true;
		}, function(){
			return true;
		});
	}

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
			templateUrl : 'views/dialogs/mb-confirm.html',
			config : {
				message : message
			}
		});
	}

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
			templateUrl : 'views/dialogs/mb-prompt.html',
			config : {
				message : text,
				model : defaultText
			}
		});
	}

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
	}


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
 * @ngdoc Services
 * @name $options
 * @description User option manager
 * 
 * Option is user configurations
 */
.service('$options', function($q) {
	var _pages = [ ];

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
	 * @param {string} pageId - Id of the config
	 * @return {promiss<config>} return config
	 */
	function getPage(pageId){
		for(var i = 0; i < _pages.length; i++){
			if(_pages[i].id === pageId){
				return $q.when(_pages[i]);
			}
		}
		return $q.reject({
			// TODO: maso, 2018: add reason
		});
	}


	/**
	 * Creates configuration/setting page.
	 */
	function newPage(page){
		_pages.push(page);
		return app;
	}
	
	var app = {
			pages : pages,
			page: getPage,
			newPage : newPage
	};
	return app;
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

// TODO: hadi: move it to new module angular-material-home-seo
angular.module('mblowfish-core')

/**
 * @ngdoc service
 * @name $page
 * @description A page management service
 * 
 * 
 * 
 */
.service('$page', function($rootScope, $rootElement) {



	/*
	 * <!-- OG -->
	 * <meta property="og:site_name" content="$title">
	 */

	$rootScope.page = {
		title: '',
		description: '',
		keywords: [],
		links:[]
	};
	var page = $rootScope.page;

	/**
	 * 
	 * @param title
	 * @returns
	 */
	function setTitle(title){
		page.title = title;
		var head = $rootElement.find('head');
		var elements = head.find('title');
		var metaElement;
		if(elements.length === 0){
			// title element not found
			metaElement = angular.element('<title></title>');
			head.append(metaElement);
		} else {
			metaElement = angular.element(elements[0]);
		}
		metaElement.text(title);
		setMeta('twitter:title', title);
		setMetaOg('og:title', title);
		return this;
	}

	/**
	 * 
	 * @returns
	 */
	function getTitle(){
		return page.title;
	}

	/**
	 * 
	 * @param description
	 * @returns
	 */
	function setDescription(description){
		page.description = description;
		setMeta('description', description);
		setMeta('twitter:description', description);
		setMetaOg('og:description', description);
		return this;
	}

	/**
	 * 
	 * @returns
	 */
	function getDescription(){
//		return getMeta('description');
		return page.description;
	}

	/**
	 * 
	 * @param keywords
	 * @returns
	 */
	function setKeywords(keywords){
		page.keywords = keywords;
		setMeta('keywords', keywords);
		return this;
	}

	/**
	 * 
	 * @returns
	 */
	function getKeywords(){
//		return getMeta('keywords');
		return page.keywords;
	}
	
	function setFavicon(favicon){
		updateLink('favicon-link', {
			href: favicon,
			rel: 'icon'
		});
		setMeta('twitter:image', favicon);
		setMetaOg('og:image', favicon);
		return this;
	}

	function updateLink(key, data){
		var searchkey = key.replace(new RegExp(':', 'g'), '\\:');
		var head = $rootElement.find('head');
		var elements = head.find('link[key='+searchkey+']');
		var metaElement;
		if(elements.length === 0){
			// title element not found
			metaElement = angular.element('<link key=\''+key+'\' />');
			head.append(metaElement);
		} else {
			metaElement = angular.element(elements[0]);
		}
		for (var property in data) {
			metaElement.attr(property, data[property]);
		}
		return this;
	}

	function setMeta(key, value){
		var searchkey = key.replace(new RegExp(':', 'g'), '\\:');
		var head = $rootElement.find('head');
		var elements = head.find('meta[name='+searchkey+']');
		var metaElement;
		if(elements.length === 0){
			// title element not found
			metaElement = angular.element('<meta name=\''+key+'\' content=\'\' />');
			head.append(metaElement);
		} else {
			metaElement = angular.element(elements[0]);
		}
		metaElement.attr('content', value);
		return this;
	}
	
	/**
	 * Adds or set an OG meta tag to document.
	 * Note: OG meta tag is differ than usual meta tags. Attributes of an OG meta tag are: property and content
	 * while attributes of an usual meta tag are: name and content. 
	 */
	function setMetaOg(key, value){
		var searchkey = key.replace(new RegExp(':', 'g'), '\\:');
		var head = $rootElement.find('head');
		var elements = head.find('meta[name='+searchkey+']');
		var metaElement;
		if(elements.length === 0){
			// title element not found
			metaElement = angular.element('<meta property=\''+key+'\' content=\'\' />');
			head.append(metaElement);
		} else {
			metaElement = angular.element(elements[0]);
		}
		metaElement.attr('content', value);
		return this;
	}

	/**
	 * Adds or set an OG meta tag to document.
	 * Note: OG meta tag is differ than usual meta tags. Attributes of an OG meta tag are: property and content
	 * while attributes of an usual meta tag are: name and content. 
	 */
	function setMetaOg(key, value){
		var searchkey = key.replace(new RegExp(':', 'g'), '\\:');
		var head = $rootElement.find('head');
		var elements = head.find('meta[name='+searchkey+']');
		var metaElement;
		if(elements.length === 0){
			// title element not found
			metaElement = angular.element('<meta property=\''+key+'\' content=\'\' />');
			head.append(metaElement);
		} else {
			metaElement = angular.element(elements[0]);
		}
		metaElement.attr('content', value);
		return this;
	}
	
	/*
	 * Service struct
	 */
	return {
		// Init
		setTitle: setTitle,
		getTitle: getTitle,
		setDescription: setDescription,
		getDescription: getDescription,
		setKeywords: setKeywords,
		getKeywords: getKeywords,
		setFavicon: setFavicon,
		setMeta: setMeta,
		setLink: updateLink
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
 * @ngdoc Services
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
	 * Gets a preference page
	 * 
	 * @memberof $preferences
	 * @param id {string} Pereference page id
	 */
	function page(id){
		// get preferences
		for (var i = 0, len = preferences.length; i < len; i++) {
			if(preferences[i].id === id){
				return $q.when(preferences[i]);
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
	function newPage(page){
		preferences.push(page);
		return this;
	}

	return  {
		'pages' : pages,
		'page': page,
		'newPage': newPage,
		'openPage' : open
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
angular.module('mblowfish-core') //

/**
 * @ngdoc Services
 * @name $sidenav
 * @param {} $q
 * @description sidenavs manager
 * 
 */
.service('$sidenav', function ($q) {
    var _sidenavs = [];

    /**
     * Get list of all sidenavs
     * 
     * @memberof $sidenav
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
     * @memberof $sidenav
     * @param {} sidenav
     * @return promiss
     */
    function newSidenav(sidenav){
        _sidenavs.push(sidenav);
    }

    /**
     * Get a sidnav by id
     * 
     * @memberof $sidenav
     * @param {} id
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

    var _defaultSidenavs = [];

    /**
     * Add new sidenav
     * 
     * @memberof $sidenav
     * @param {} defaultSidenavs
     * @return promiss
     */
    function setDefaultSidenavs(defaultSidenavs){
        _defaultSidenavs = defaultSidenavs || [];
        return this;
    }

    /**
     * Add new sidenav
     * 
     * @memberof $sidenav
     * @return promiss
     */
    function defaultSidenavs(){
        return _defaultSidenavs;
    }


    var apps = {};

    apps.sidenavs = sidenavs;
    apps.newSidenav = newSidenav;
    apps.sidenav = sidenav;
    apps.setDefaultSidenavs = setDefaultSidenavs;
    apps.defaultSidenavs = defaultSidenavs;

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
angular.module('mblowfish-core') //

/**
 * @ngdoc Services
 * @name $toolbar
 * @description toolbars manager
 * 
 */
.service('$toolbar', function ($q) {

    var _toolbars = [];

    /**
     * Get list of all toolbars
     * 
     * @memberof $app
     * @return promiss
     */
    function toolbars() {
        return $q.when({
            items: _toolbars
        });
    }

    /**
     * Add new toolbar
     * 
     * @memberof $toolbar
     * @param {} toolbar
     * @return promise
     */
    function newToolbar(toolbar) {
        _toolbars.push(toolbar);
    }

    /**
     * Get a toolbar by id
     * 
     * @memberof $app
     * @param {} id
     * @return promise
     */
    function toolbar(id) {
        for (var i = 0; i < _toolbars.length; i++) {
            if (_toolbars[i].id === id) {
                return $q.when(_toolbars[i]);
            }
        }
        return $q.reject('Toolbar not found');
    }

    var _defaultToolbars = [];
    function setDefaultToolbars(defaultToolbars) {
        _defaultToolbars = defaultToolbars || [];
        return this;
    }

    function defaultToolbars() {
        return _defaultToolbars;
    }

    var apps = {};
    // toolbars
    apps.toolbars = toolbars;
    apps.newToolbar = newToolbar;
    apps.toolbar = toolbar;
    apps.setDefaultToolbars = setDefaultToolbars;
    apps.defaultToolbars = defaultToolbars;

    return apps;
});

angular.module('mblowfish-core').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/dialogs/mb-alert.html',
    "<md-dialog layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <wb-icon>error</wb-icon> <h2 translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=cancel()> <wb-icon aria-label=\"Close dialog\">close</wb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=row layout-padding layout-align=\"center center\" flex> <p translate>{{config.message}}</p> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mb-confirm.html',
    "<md-dialog layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <wb-icon>warning</wb-icon> <h2 translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=answer(true)> <wb-icon aria-label=Done>done</wb-icon> </md-button> <md-button class=md-icon-button ng-click=cancel()> <wb-icon aria-label=\"Close dialog\">close</wb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=row layout-padding layout-align=\"center center\" flex> <p translate>{{config.message}}</p> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/dialogs/mb-prompt.html',
    "<md-dialog layout=column ng-cloak> <md-toolbar> <div class=md-toolbar-tools> <wb-icon>input</wb-icon> <h2 translate>{{app.title}}</h2> <span flex></span> <md-button class=md-icon-button ng-click=answer(config.model)> <wb-icon aria-label=Done>done</wb-icon> </md-button> <md-button class=md-icon-button ng-click=cancel()> <wb-icon aria-label=\"Close dialog\">close</wb-icon> </md-button> </div> </md-toolbar> <md-dialog-content layout=column layout-padding layout-align=\"center stretch\" flex> <p translate>{{config.message}}</p> <md-input-container class=md-block> <label translate>Input value</label> <input ng-model=config.model> </md-input-container> </md-dialog-content> </md-dialog>"
  );


  $templateCache.put('views/directives/mb-captcha.html',
    "<div>  <div vc-recaptcha ng-model=ctrl.captchaValue theme=\"app.captcha.theme || 'light'\" type=\"app.captcha.type || 'image'\" key=app.captcha.key lang=\"app.captcha.language || 'fa'\"> </div>  </div>"
  );


  $templateCache.put('views/directives/mb-dynamic-tabs.html',
    "<div layout=column> <md-tabs md-selected=pageIndex> <md-tab ng-repeat=\"tab in mbTabs\"> <span translate>{{tab.title}}</span> </md-tab> </md-tabs> <div id=mb-dynamic-tabs-select-resource-children> </div> </div>"
  );


  $templateCache.put('views/directives/mb-navigation-bar.html',
    "<div class=mb-navigation-path-bar md-colors=\"{'background-color': 'primary'}\" layout=row> <div layout=row> <md-button ng-click=goToHome() aria-label=Home class=\"mb-navigation-path-bar-item mb-navigation-path-bar-item-home\"> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{'home' | translate}}</md-tooltip> <wb-icon>home</wb-icon> </md-button> </div> <div layout=row data-ng-repeat=\"menu in pathMenu.items | orderBy:['-priority']\"> <wb-icon>{{app.dir==='rtl' ? 'chevron_left' : 'chevron_right'}}</wb-icon> <md-button ng-show=isVisible(menu) ng-href={{menu.url}} ng-click=menu.exec($event); class=mb-navigation-path-bar-item> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.description}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> {{menu.title | translate}} </md-button>  </div> </div>"
  );


  $templateCache.put('views/directives/mb-pagination-bar.html',
    "<div class=wrapper-stack-toolbar-container>  <div md-colors=\"{background: 'primary-hue-1'}\"> <div class=md-toolbar-tools> <md-button ng-if=mbIcon md-no-ink class=md-icon-button aria-label={{mbIcon}}> <wb-icon>{{mbIcon}}</wb-icon> </md-button> <h2 flex md-truncate ng-if=mbTitle>{{mbTitle}}</h2> <md-button ng-if=mbReload class=md-icon-button aria-label=Reload ng-click=__reload()> <wb-icon>repeat</wb-icon> </md-button> <md-button ng-show=mbSortKeys class=md-icon-button aria-label=Sort ng-click=\"showSort = !showSort\"> <wb-icon>sort</wb-icon> </md-button> <md-button ng-show=mbEnableSearch class=md-icon-button aria-label=Search ng-click=\"showSearch = true; focusToElement('searchInput');\"> <wb-icon>search</wb-icon> </md-button> <md-button ng-if=exportData class=md-icon-button aria-label=Export ng-click=exportData()> <wb-icon>save</wb-icon> </md-button> <span flex ng-if=!mbTitle></span> <md-menu ng-show=mbMoreActions.length> <md-button class=md-icon-button aria-label=Menu ng-click=$mdOpenMenu($event)> <wb-icon>more_vert</wb-icon> </md-button> <md-menu-content width=4> <md-menu-item ng-repeat=\"item in mbMoreActions\"> <md-button ng-click=item.action() aria-label={{item.title}}> <wb-icon ng-show=item.icon>{{item.icon}}</wb-icon> <span translate=\"\">{{ item.title }}</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </div> </div>  <div class=\"stack-toolbar new-box-showing-animation\" md-colors=\"{background: 'primary-hue-2'}\" ng-show=showSearch> <div class=md-toolbar-tools> <md-button style=min-width:0px ng-click=\"showSearch = false\" aria-label=Back> <wb-icon class=icon-rotate-180-for-rtl>arrow_back</wb-icon> </md-button> <md-input-container flex md-theme=dark md-no-float class=\"md-block fit-input\"> <input id=searchInput placeholder=\"{{'Search'|translate}}\" ng-model=query.searchTerm ng-model-options={debounce:1000}> </md-input-container> </div> </div>  <div class=\"stack-toolbar new-box-showing-animation\" md-colors=\"{background: 'primary-hue-2'}\" ng-show=showSort> <div class=md-toolbar-tools> <md-button style=min-width:0px ng-click=\"showSort = false\" aria-label=Back> <wb-icon class=icon-rotate-180-for-rtl>arrow_back</wb-icon> </md-button> <h3 translate=\"\">Sort</h3> <span style=\"width: 10px\"></span>  <md-menu> <md-button layout=row style=\"text-transform: none\" ng-click=$mdMenu.open()> <h3>{{mbSortKeysTitles?mbSortKeysTitles[mbSortKeys.indexOf(query.sortBy)]:query.sortBy|translate}}</h3> </md-button> <md-menu-content width=4> <md-menu-item ng-repeat=\"key in mbSortKeys\"> <md-button ng-click=\"query.sortBy=key\"> <wb-icon ng-if=\"query.sortBy===key\">check_circle</wb-icon> <wb-icon ng-if=\"query.sortBy!==key\">radio_button_unchecked</wb-icon> {{mbSortKeysTitles?mbSortKeysTitles[$index]:key|translate}} </md-button> </md-menu-item> </md-menu-content> </md-menu>  <md-menu> <md-button layout=row style=\"text-transform: none\" ng-click=$mdMenu.open()> <wb-icon ng-if=!query.sortDesc class=icon-rotate-180>filter_list</wb-icon> <wb-icon ng-if=query.sortDesc>filter_list</wb-icon> {{query.sortDesc?'Descending':'Ascending'|translate}} </md-button> <md-menu-content width=4> <md-menu-item> <md-button ng-click=\"query.sortDesc=false\"> <wb-icon ng-if=!query.sortDesc>check_circle</wb-icon> <wb-icon ng-if=query.sortDesc>radio_button_unchecked</wb-icon> {{'Ascending'|translate}} </md-button> </md-menu-item> <md-menu-item> <md-button ng-click=\"query.sortDesc=true\"> <wb-icon ng-if=query.sortDesc>check_circle</wb-icon> <wb-icon ng-if=!query.sortDesc>radio_button_unchecked</wb-icon> {{'Descending'|translate}} </md-button> </md-menu-item> </md-menu-content> </md-menu> <span flex=\"\"></span> </div> </div> </div>"
  );


  $templateCache.put('views/directives/mb-panel.html',
    "<div id=mb-panel-root md-theme=\"{{app.setting.theme|| app.config.theme || 'default'}}\" md-theme-watch ng-class=\"{'mb-rtl-direction': app.dir === 'rtl', 'mb-ltr-direction': app.dir !== 'rtl'}\" dir={{app.dir}} layout=column layout-fill>  <div id=mb-panel-root-ready mb-panel-toolbar-anchor ng-if=\"status === 'ready'\" layout=column layout-fill>   <div id=mb-panel-root-ready-anchor mb-panel-sidenav-anchor layout=row flex> <md-whiteframe layout=row id=main class=\"md-whiteframe-24dp main mb-page-content\" ng-view flex> </md-whiteframe> </div> </div> <div id=mb-panel-root-access-denied ng-if=\"status === 'accessDenied'\" layout=column layout-fill> Access Denied </div> <div ng-if=\"status === 'loading'\" layout=column layout-align=\"center center\" layout-fill> <h3>Loading...</h3>   <md-progress-linear style=\"width: 50%\" md-mode=indeterminate> </md-progress-linear> <md-button ng-if=\"app.state.status === 'fail'\" class=\"md-raised md-primary\" ng-click=restart() aria-label=Retry> <wb-icon>replay</wb-icon> retry </md-button> </div> <div ng-if=\"status === 'login'\" layout=row layout-aligne=none layout-align-gt-sm=\"center center\" ng-controller=MbAccountCtrl flex> <div md-whiteframe=3 flex=100 flex-gt-sm=50 layout=column mb-preloading=ctrl.loadUser>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=\"!(ctrl.loginProcess || ctrl.logoutProcess)\" style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <div style=\"text-align: center\" layout-margin ng-show=\"!ctrl.loginProcess && ctrl.loginState === 'fail'\"> <p><span md-colors=\"{color:'warn'}\" translate>{{loginMessage}}</span></p> </div> <form name=ctrl.myForm ng-submit=login(credit) layout=column layout-padding> <md-input-container> <label translate>Username</label> <input ng-model=credit.login name=username required> <div ng-messages=ctrl.myForm.username.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container> <md-input-container> <label translate>Password</label> <input ng-model=credit.password type=password name=password required> <div ng-messages=ctrl.myForm.password.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container>  <div ng-if=\"app.options['captcha.engine'] === 'recaptcha'\" vc-recaptcha ng-model=credit.g_recaptcha_response theme=\"app.captcha.theme || 'light'\" type=\"app.captcha.type || 'image'\" key=\"app.options['captcha.engine.recaptcha.key']\" lang=\"app.setting.local || app.config.local || 'en'\"> </div> <input hide type=\"submit\"> <div layout=column layout-align=none layout-gt-xs=row layout-align-gt-xs=\"end center\" layout-margin> <a href=users/reset-password style=\"text-decoration: none\" ui-sref=forget flex-order=1 flex-order-gt-xs=-1>{{'forgot your password?'| translate}}</a> <md-button ng-disabled=ctrl.myForm.$invalid flex-order=-1 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=login(credit)>{{'login'| translate}}</md-button>      </div> </form> </div> </div> </div>"
  );


  $templateCache.put('views/directives/mb-preference-page.html',
    "<div id=mb-preference-body layout=row layout-margin flex> </div>"
  );


  $templateCache.put('views/directives/mb-titled-block.html',
    "<div style=\"border-radius: 5px; margin: 5px 5px 10px 10px; padding: 0px\" md-whiteframe=4> <md-toolbar layout=row style=\"border-top-left-radius: 5px;border-top-right-radius: 5px; margin: 0px; padding: 0px\"> <div layout=row layout-align=\"start center\" class=md-toolbar-tools> <wb-icon ng-if=mbIcon>{{mbIcon}}</wb-icon> <h3>{{mbTitle}}</h3> </div> <md-menu layout-align=\"end center\" ng-show=mbMoreActions.length> <md-button class=md-icon-button aria-label=Menu ng-click=$mdOpenMenu($event)> <wb-icon>more_vert</wb-icon> </md-button> <md-menu-content width=4> <md-menu-item ng-repeat=\"item in mbMoreActions\"> <md-button ng-click=item.action() aria-label={{item.title}}> <wb-icon ng-show=item.icon>{{item.icon}}</wb-icon> <span translate=\"\">{{ item.title}}</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </md-toolbar> <md-progress-linear ng-if=mbProgress style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-warn md-color> </md-progress-linear> <div style=\"margin: 8px\" ng-transclude></div> </div>"
  );


  $templateCache.put('views/directives/mb-tree-heading.html',
    "<h2 md-colors=\"{color: 'primary.A100'}\" class=\"mb-tree-heading md-subhead\"> <wb-icon ng-if=mbSection.icon>{{mbSection.icon}}</wb-icon> {{mbSection.title}} </h2>"
  );


  $templateCache.put('views/directives/mb-tree-link.html',
    "<md-button md-colors=\"{backgroundColor: (isSelected(mbSection.state) || $state.includes(mbSection.state)) ? 'primary.800': 'primary'}\" class=\"md-raised md-primary md-hue-1\" ng-click=focusSection(mbSection)> <wb-icon ng-if=mbSection.icon>{{mbSection.icon}}</wb-icon> <span translate>{{mbSection.title}}</span> <span class=md-visually-hidden ng-if=isSelected(mbSection)> current page </span> </md-button>"
  );


  $templateCache.put('views/directives/mb-tree-toggle.html',
    "<div ng-show=isVisible()> <md-button class=\"md-raised md-primary md-hue-1 md-button-toggle\" ng-click=toggle(mbSection) aria-controls=docs-menu-{{section.name}} aria-expanded={{isOpen(mbSection)}}> <div flex layout=row> <wb-icon ng-if=mbSection.icon>{{mbSection.icon}}</wb-icon> <span class=mb-toggle-title translate>{{mbSection.title}}</span> <span flex></span> <span aria-hidden=true class=md-toggle-icon ng-class=\"{toggled : isOpen(mbSection)}\"> <wb-icon>keyboard_arrow_up</wb-icon> </span> </div> <span class=md-visually-hidden> Toggle {{isOpen(mbSection)? expanded : collapsed}} </span> </md-button> <ul id=docs-menu-{{mbSection.title}} class=mb-tree-toggle-list> <li ng-repeat=\"section in mbSection.sections\" ng-if=isVisible(section)> <mb-tree-link mb-section=section ng-if=\"section.type === 'link'\"> </mb-tree-link> </li> </ul> </div>"
  );


  $templateCache.put('views/directives/mb-tree.html',
    "<ul id=mb-tree-root-element class=mb-tree> <li md-colors=\"{borderBottomColor: 'background-600'}\" ng-repeat=\"section in mbSection.sections | orderBy : 'priority'\" ng-show=isVisible(section)> <mb-tree-heading mb-section=section ng-if=\"section.type === 'heading'\"> </mb-tree-heading> <mb-tree-link mb-section=section ng-if=\"section.type === 'link'\"> </mb-tree-link> <mb-tree-toggle mb-section=section ng-if=\"section.type === 'toggle'\"> </mb-tree-toggle> </li> </ul>"
  );


  $templateCache.put('views/directives/mb-user-menu.html',
    "<div md-colors=\"{'background-color': 'primary-hue-1'}\" class=amd-user-menu> <md-menu md-offset=\"0 20\"> <md-button class=amd-user-menu-button ng-click=$mdOpenMenu() aria-label=\"Open menu\"> <img height=32px class=img-circle style=\"border-radius: 50%; vertical-align: middle\" ng-src=/api/v2/user/accounts/{{app.user.current.id}}/avatar ng-src-error=\"https://www.gravatar.com/avatar/{{app.user.current.id|wbmd5}}?d=identicon&size=32\"> <span>{{app.user.profile.first_name}} {{app.user.profile.last_name}}</span> <wb-icon class=material-icons>keyboard_arrow_down</wb-icon> </md-button> <md-menu-content width=3>  <md-menu-item ng-if=menu.items.length ng-repeat=\"item in menu.items| orderBy:['-priority']\"> <md-button ng-click=item.exec($event) translate=\"\"> <wb-icon ng-if=item.icon>{{item.icon}}</wb-icon> <span ng-if=item.title>{{item.title| translate}}</span> </md-button> </md-menu-item> <md-menu-divider ng-if=menu.items.length></md-menu-divider> <md-menu-item> <md-button ng-click=settings()> <span translate=\"\">Settings</span> </md-button> </md-menu-item> <md-menu-item ng-if=!app.user.anonymous> <md-button ng-click=logout()> <span translate=\"\">Logout</span> </md-button> </md-menu-item> <md-menu-item ng-if=app.user.anonymous> <md-button ng-href=users/login> <span translate=\"\">Login</span> </md-button> </md-menu-item> </md-menu-content> </md-menu> </div>"
  );


  $templateCache.put('views/directives/mb-user-toolbar.html',
    "<md-toolbar layout=row layout-align=\"center center\"> <img width=80px class=img-circle ng-src=/api/v2/user/accounts/{{app.user.current.id}}/avatar> <md-menu md-offset=\"0 20\"> <md-button class=capitalize ng-click=$mdOpenMenu() aria-label=\"Open menu\"> <span>{{app.user.profile.first_name}} {{app.user.profile.last_name}}</span> <wb-icon class=material-icons>keyboard_arrow_down</wb-icon> </md-button> <md-menu-content width=3>  <md-menu-item ng-if=menu.items.length ng-repeat=\"item in menu.items | orderBy:['-priority']\"> <md-button ng-click=item.exec($event) translate> <wb-icon ng-if=item.icon>{{item.icon}}</wb-icon> <span ng-if=item.title>{{item.title | translate}}</span> </md-button> </md-menu-item> <md-menu-divider></md-menu-divider> <md-menu-item> <md-button ng-click=toggleRightSidebar();logout();>{{'Logout' | translate}}</md-button> </md-menu-item> </md-menu-content> </md-menu> </md-toolbar>"
  );


  $templateCache.put('views/mb-error-messages.html',
    "<div ng-message=403 layout=column layout-align=\"center center\"> <wb-icon size=64px>do_not_disturb</wb-icon> <strong translate>Access denied</strong> <p translate>You are not allowed to access this item.</p> </div> <div ng-message=404 layout=column layout-align=\"center center\"> <wb-icon size=64px>visibility_off</wb-icon> <strong translate>Not found</strong> <p translate>Requested item not found.</p> </div> <div ng-message=500 layout=column layout-align=\"center center\"> <wb-icon size=64px>bug_report</wb-icon> <strong translate>Server error</strong> <p translate>An internal server error is occurred.</p> </div>"
  );


  $templateCache.put('views/mb-initial.html',
    "<div layout=column flex> <md-content layout=column flex> {{basePath}} <mb-preference-page mb-preference-id=currentStep.id> </mb-preference-page> </md-content> <md-stepper id=setting-stepper ng-show=steps.length md-mobile-step-text=false md-vertical=false md-linear=false md-alternative=true> <md-step ng-repeat=\"step in steps\" md-label=\"{{step.title | translate}}\"> </md-step> </md-stepper> </div>"
  );


  $templateCache.put('views/mb-passowrd-recover.html',
    " <md-toolbar layout-padding>  <h3>Forget Your PassWord ?</h3> </md-toolbar>  <div layout=column layout-padding> <md-input-container> <label>Username or Email</label> <input ng-model=credit.login required> </md-input-container> </div> <div layout=column layout-align=none layout-gt-sm=row layout-align-gt-sm=\"space-between center\" layout-padding> <a ui-sref=login flex-order=1 flex-order-gt-sm=-1>Back To Login Page</a> <md-button flex-order=0 class=\"md-primary md-raised\" ng-click=login(credit)>Send</md-button> </div>"
  );


  $templateCache.put('views/mb-preference.html',
    "<div layout=column ng-cloak flex> <table layout=row> <tr> <td> <wb-icon wb-icon-name={{preference.icon}} size=128> </wb-icon> </td> <td> <h1 translate>{{preference.title}}</h1> <p translate>{{preference.description}}</p> </td> </tr> </table> <mb-preference-page mb-preference-id=preference.id flex> </mb-preference-page> </div>"
  );


  $templateCache.put('views/mb-preferences.html',
    "<md-content ng-cloak layout-padding flex> <md-grid-list md-cols-gt-md=3 md-cols=3 md-cols-md=1 md-row-height=4:3 md-gutter-gt-md=16px md-gutter-md=8px md-gutter=4px> <md-grid-tile ng-repeat=\"tile in preferenceTiles\" md-colors=\"{backgroundColor: 'primary-300'}\" md-colspan-gt-sm={{tile.colspan}} md-rowspan-gt-sm={{tile.rowspan}} ng-click=openPreference(tile.page) style=\"cursor: pointer\"> <md-grid-tile-header> <h3 style=\"text-align: center;font-weight: bold\"> <wb-icon>{{tile.page.icon}}</wb-icon> <span translate=\"\">{{tile.page.title}}</span> </h3> </md-grid-tile-header> <p style=\"text-align: justify\" layout-padding translate=\"\">{{tile.page.description}}</p> </md-grid-tile> </md-grid-list> </md-content>"
  );


  $templateCache.put('views/options/mb-local.html',
    "<md-divider></md-divider> <md-input-container class=md-block> <label translate>Language & Local</label> <md-select ng-model=app.setting.local> <md-option ng-repeat=\"lang in languages\" ng-value=lang.key>{{lang.title | translate}}</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Direction</label> <md-select ng-model=app.setting.dir placeholder=Direction> <md-option value=rtl translate>Right to left</md-option> <md-option value=ltr translate>Left to right</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Calendar</label> <md-select ng-model=app.setting.calendar placeholder=\"\"> <md-option value=Gregorian translate>Gregorian</md-option> <md-option value=Jalaali translate>Jalaali</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Date format</label> <md-select ng-model=app.setting.dateFormat placeholder=\"\"> <md-option value=jMM-jDD-jYYYY translate> {{'2018-01-01' | mbDate:'jMM-jDD-jYYYY'}} </md-option> <md-option value=jYYYY-jMM-jDD translate> {{'2018-01-01' | mbDate:'jYYYY-jMM-jDD'}} </md-option> <md-option value=\"jYYYY jMMMM jDD\" translate> {{'2018-01-01' | mbDate:'jYYYY jMMMM jDD'}} </md-option> </md-select> </md-input-container>"
  );


  $templateCache.put('views/options/mb-theme.html',
    "<md-input-container class=md-block> <label translate>Theme</label> <md-select ng-model=app.setting.theme> <md-option ng-repeat=\"theme in themes\" value={{theme.id}} translate>{{theme.label}}</md-option> </md-select> </md-input-container> <md-input-container class=md-block ng-init=\"app.setting.navigationPath = app.setting.navigationPath || true\"> <md-switch class=md-primary name=special ng-model=app.setting.navigationPath> <sapn flex translate>Navigation path</sapn> </md-switch> </md-input-container>"
  );


  $templateCache.put('views/partials/mb-branding-header-toolbar.html',
    " <md-toolbar layout=row layout-padding md-colors=\"{backgroundColor: 'primary-100'}\">  <img style=\"max-width: 50%\" height=160 ng-show=app.config.logo ng-src=\"{{app.config.logo}}\"> <div> <h3>{{app.config.title}}</h3> <p>{{ app.config.description | limitTo: 250 }}{{app.config.description.length > 250 ? '...' : ''}}</p> </div> </md-toolbar>"
  );


  $templateCache.put('views/preferences/mb-brand.html',
    "<div layout=column layout-margin ng-cloak flex> <md-input-container class=md-block> <label translate>Title</label> <input required md-no-asterisk name=title ng-model=\"app.config.title\"> </md-input-container> <md-input-container class=md-block> <label translate>Description</label> <input md-no-asterisk name=description ng-model=\"app.config.description\"> </md-input-container> <wb-ui-setting-image title=Logo wb-ui-setting-clear-button=true wb-ui-setting-preview=true ng-model=app.config.logo> </wb-ui-setting-image> <wb-ui-setting-image title=Favicon wb-ui-setting-clear-button=true wb-ui-setting-preview=true ng-model=app.config.favicon> </wb-ui-setting-image> </div>"
  );


  $templateCache.put('views/preferences/mb-google-analytic.html',
    "<div layout=column layout-margin ng-cloak flex> <md-input-container class=md-block> <label>Google analytic property</label> <input required md-no-asterisk name=property ng-model=\"app.config.googleAnalytic.property\"> </md-input-container> </div>"
  );


  $templateCache.put('views/preferences/mb-language.html',
    " <div layout=column layout-align=\"center center\" layout-margin style=\"min-height: 300px\" flex> <div layout=column layout-align=\"center start\"> <p>{{'Select default language of site:' | translate}}</p> <md-checkbox ng-repeat=\"lang in languages\" style=\"margin: 8px\" ng-checked=\"myLanguage.key === lang.key\" ng-click=setLanguage(lang) aria-label={{lang.key}}> {{lang.title | translate}} </md-checkbox> </div> </div>"
  );


  $templateCache.put('views/preferences/mb-local.html',
    "<div layout=column layout-padding ng-cloak flex> <md-input-container class=\"md-icon-float md-block\"> <label translate>Language</label> <md-select ng-model=app.config.local.language> <md-option ng-repeat=\"lang in languages\" ng-value=lang.key>{{lang.title | translate}}</md-option> </md-select> <wb-icon style=\"cursor: pointer\" ng-click=goToManage()>settings</wb-icon> </md-input-container> <md-input-container class=md-block> <label translate>Direction</label> <md-select ng-model=app.config.local.dir placeholder=Direction> <md-option value=rtl translate>Right to left</md-option> <md-option value=ltr translate>Left to right</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Calendar</label> <md-select ng-model=app.config.local.calendar placeholder=\"\"> <md-option value=Gregorian translate>Gregorian</md-option> <md-option value=Jalaali translate>Jalaali</md-option> </md-select> </md-input-container> <md-input-container class=md-block> <label translate>Date format</label> <md-select ng-model=app.config.local.dateFormat placeholder=\"\"> <md-option value=jMM-jDD-jYYYY translate> <span translate>Month Day Year, </span> <span translate>Ex. </span> {{'2018-01-01' | mbDate:'jMM-jDD-jYYYY'}} </md-option> <md-option value=jYYYY-jMM-jDD translate> <span translate>Year Month Day, </span> <span translate>Ex. </span> {{'2018-01-01' | mbDate:'jYYYY-jMM-jDD'}} </md-option> <md-option value=\"jYYYY jMMMM jDD\" translate> <span translate>Year Month Day, </span> <span translate>Ex. </span> {{'2018-01-01' | mbDate:'jYYYY jMMMM jDD'}} </md-option> </md-select> </md-input-container> </div>"
  );


  $templateCache.put('views/preferences/mb-update.html',
    "<div layout=column layout-padding ng-cloak flex> <md-switch class=md-secondary ng-model=app.config.update.showMessage aria-label=\"Show spa update message option\"> <p translate=\"\">Show update message to customers</p> </md-switch> <md-switch class=md-secondary ng-model=app.config.update.autoReload ng-disabled=!app.config.update.showMessage aria-label=\"Automatically reload page option\"> <p translate=\"\">Reload the page automatically on update</p> </md-switch> </div>"
  );


  $templateCache.put('views/resources/mb-accounts.html',
    "<div ng-controller=\"MbAccountsCtrl as ctrl\" ng-init=\"ctrl.setDataQuery('{id, is_active, date_joined, last_login, profiles{first_name,last_name}}')\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex>  <mb-pagination-bar mb-model=ctrl.queryParameter mb-reload=ctrl.reload() mb-sort-keys=ctrl.getSortKeys() mb-more-actions=ctrl.getMoreActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"user in ctrl.items track by user.id\" ng-click=\"multi || resourceCtrl.setSelected(user)\" class=md-3-line> <img class=md-avatar ng-src=/api/v2/user/accounts/{{::user.id}}/avatar ng-src-error=\"https://www.gravatar.com/avatar/{{ ::user.id | wbmd5 }}?d=identicon&size=32\"> <div class=md-list-item-text layout=column> <h3>{{user.profiles[0].first_name}} - {{user.profiles[0].last_name}}</h3> <h4> <span ng-show=user.is_active> <span translate>Active</span>, </span> <span ng-show=!user.is_active> <span translate>Inactive</span>, </span> </h4> <p> <span translate>Joined</span>: {{user.date_joined}}, <span translate>Last Login</span>: {{user.last_login}}, </p> </div> <md-checkbox ng-if=multi class=md-secondary ng-init=\"user.selected = resourceCtrl.isSelected(user)\" ng-model=user.selected ng-change=\"resourceCtrl.setSelected(user, user.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-cms-content-upload.html',
    "<div layout=column flex> <lf-ng-md-file-input lf-files=ctrl.files accept=image/* progress preview drag flex> </lf-ng-md-file-input>  <div layout=row> <md-checkbox ng-model=_absolutPathFlag ng-change=ctrl.setAbsolute(_absolutPathFlag) aria-label=\"Abslout path of the image\"> <span translate>Absolut path</span> </md-checkbox> </div> </div>"
  );


  $templateCache.put('views/resources/mb-cms-images.html',
    "<div layout=column mb-preloading=\"ctrl.state === 'busy'\" flex>  <mb-pagination-bar mb-model=ctrl.queryParameter mb-reload=ctrl.reload() mb-sort-keys=ctrl.getProperties() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=row layout-wrap layout-align=\"start start\" flex> <div ng-click=\"ctrl.setSelected(pobject, $index, $event);\" ng-repeat=\"pobject in ctrl.items track by pobject.id\" style=\"border: 16px; border-style: solid; border-width: 1px; margin: 8px\" md-colors=\"ctrl.isSelected($index) ? {borderColor:'accent'} : {}\" ng-if=!listViewMode> <img style=\"width: 128px; height: 128px\" ng-src=\"{{'/api/v2/cms/contents/'+pobject.id+'/thumbnail'}}\"> </div> <md-list ng-if=listViewMode> <md-list-item ng-repeat=\"pobject in items track by pobject.id\" ng-click=\"ctrl.setSelected(pobject, $index, $event);\" md-colors=\"ctrl.isSelected($index) ? {background:'accent'} : {}\" class=md-3-line> <img ng-if=\"pobject.mime_type.startsWith('image/')\" style=\"width: 128px; height: 128px\" ng-src=/api/v2/cms/contents/{{pobject.id}}/thumbnail> <wb-icon ng-if=\"!pobject.mime_type.startsWith('image/')\">insert_drive_file</wb-icon> <div class=md-list-item-text layout=column> <h3>{{pobject.title}}</h3> <h4>{{pobject.name}}</h4> <p>{{pobject.description}}</p> </div> <md-divider md-inset></md-divider> </md-list-item> </md-list>  <div layout=column layout-align=\"center center\"> <md-progress-circular ng-show=\"ctrl.status === 'working'\" md-diameter=96> Loading ... </md-progress-circular> </div> </md-content>  <div layout=row> <md-checkbox ng-model=_absolutPathFlag ng-change=ctrl.setAbsolute(_absolutPathFlag) aria-label=\"Abslout path of the image\"> <span translate>Absolut path</span> </md-checkbox> </div> </div>"
  );


  $templateCache.put('views/resources/mb-groups.html',
    "<div ng-controller=\"MbGroupsCtrl as ctrl\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex>  <mb-pagination-bar mb-model=ctrl.queryParameter mb-reload=ctrl.reload() mb-sort-keys=ctrl.getProperties() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"group in ctrl.items track by group.id\" ng-click=\"multi || resourceCtrl.setSelected(group)\" class=md-3-line> <wb-icon>group</wb-icon> <div class=md-list-item-text layout=column> <h3>{{group.name}}</h3> <h4></h4> <p>{{group.description}}</p> </div> <md-checkbox ng-if=multi class=md-secondary ng-init=\"group.selected = resourceCtrl.isSelected(group)\" ng-model=group.selected ng-click=\"resourceCtrl.setSelected(group, group.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item>  </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-roles.html',
    "<div ng-controller=\"MbRolesCtrl as ctrl\" mb-preloading=\"ctrl.state === 'busy'\" layout=column flex>  <mb-pagination-bar mb-model=ctrl.queryParameter mb-reload=ctrl.reload() mb-sort-keys=ctrl.getProperties() mb-more-actions=ctrl.getActions()> </mb-pagination-bar> <md-content mb-infinate-scroll=ctrl.loadNextPage() layout=column flex> <md-list flex> <md-list-item ng-repeat=\"role in ctrl.items track by role.id\" ng-click=\"multi || resourceCtrl.selectRole(role)\" class=md-3-line> <wb-icon>accessibility</wb-icon> <div class=md-list-item-text layout=column> <h3>{{role.name}}</h3> <p>{{role.description}}</p> </div> <md-checkbox class=md-secondary ng-init=\"role.selected = resourceCtrl.isSelected(role)\" ng-model=role.selected ng-click=\"resourceCtrl.setSelected(role, role.selected)\"> </md-checkbox> <md-divider md-inset></md-divider> </md-list-item> </md-list> </md-content> </div>"
  );


  $templateCache.put('views/resources/mb-sidenav.html',
    ""
  );


  $templateCache.put('views/sidenavs/mb-help.html',
    "<md-toolbar class=md-hue-1 layout=column layout-align=center> <div layout=row layout-align=\"start center\"> <md-button class=md-icon-button aria-label=Close ng-click=closeHelp()> <wb-icon>close</wb-icon> </md-button> <span flex></span> <h4 translate>Help</h4> </div> </md-toolbar> <md-content mb-preloading=helpLoading layout-padding flex> <wb-group ng-model=helpContent></wb-group> </md-content>"
  );


  $templateCache.put('views/sidenavs/mb-messages.html',
    "<md-toolbar class=md-hue-1 layout=column layout-align=center> <div layout=row layout-align=\"start center\"> <h4 translate=\"\">Messages</h4> </div> </md-toolbar> <md-content mb-preloading=\"ctrl.status === 'working'\" mb-infinate-scroll=nextMessages() flex layout-fill> <md-list> <md-list-item class=md-2-line ng-repeat=\"message in ctrl.items\"> <wb-icon ng-class=\"\">mail</wb-icon> <div class=md-list-item-text> <p>{{message.message}}</p> </div> <md-button class=\"md-secondary md-icon-button\" ng-click=remove(message) aria-label=remove> <wb-icon>delete</wb-icon> </md-button> </md-list-item> </md-list> </md-content>"
  );


  $templateCache.put('views/sidenavs/mb-navigator.html',
    "<md-toolbar class=md-whiteframe-z2 layout=column layout-align=\"start center\"> <img width=128px height=128px ng-show=app.config.logo ng-src=\"{{app.config.logo}}\"> <strong>{{app.config.title}}</strong> <p style=\"text-align: center\">{{ app.config.description | limitTo: 100 }}{{app.config.description.length > 150 ? '...' : ''}}</p> </md-toolbar> <md-content md-colors=\"{backgroundColor: 'primary'}\" flex> <mb-tree mb-section=menuItems> </mb-tree> </md-content>"
  );


  $templateCache.put('views/sidenavs/mb-options.html',
    " <mb-user-toolbar mb-actions=userActions> </mb-user-toolbar>  <md-content layout-padding> <mb-dynamic-tabs mb-tabs=tabs> </mb-dynamic-tabs> </md-content>"
  );


  $templateCache.put('views/toolbars/mb-dashboard.html',
    "<div layout=row layout-align=\"start center\"> <md-button class=md-icon-button hide-gt-sm ng-click=toggleNavigationSidenav() aria-label=Menu> <wb-icon>menu</wb-icon> </md-button> <img hide-gt-sm height=32px ng-if=app.config.logo ng-src=\"{{app.config.logo}}\"> <strong hide-gt-sm style=\"padding: 0px 8px 0px 8px\"> {{app.config.title}} </strong> <mb-navigation-bar hide show-gt-sm ng-show=\"app.setting.navigationPath !== false\"> </mb-navigation-bar> </div> <div layout=row layout-align=\"end center\">  <md-button ng-repeat=\"menu in scopeMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-href={{menu.url}} ng-click=menu.exec($event); class=md-icon-button> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.description}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> </md-button> <md-divider ng-if=scopeMenu.items.length></md-divider> <md-button ng-repeat=\"menu in toolbarMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-href={{menu.url}} ng-click=menu.exec($event); class=md-icon-button> <md-tooltip ng-if=\"menu.tooltip || menu.description\" md-delay=1500>{{menu.description | translate}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> </md-button> <md-button ng-show=messageCount ng-click=toggleMessageSidenav() style=\"overflow: visible\" class=md-icon-button> <md-tooltip md-delay=1500> <span translate=\"\">Display list of messages</span> </md-tooltip> <wb-icon mb-badge={{messageCount}} mb-badge-fill=accent>notifications</wb-icon> </md-button> <mb-user-menu></mb-user-menu> <md-button ng-repeat=\"menu in userMenu.items | orderBy:['-priority']\" ng-show=menu.visible() ng-click=menu.exec($event) class=md-icon-button> <md-tooltip ng-if=menu.tooltip md-delay=1500>{{menu.tooltip}}</md-tooltip> <wb-icon ng-if=menu.icon>{{menu.icon}}</wb-icon> </md-button> </div>"
  );


  $templateCache.put('views/users/mb-account.html',
    "<md-content mb-preloading=ctrl.loadingUser class=md-padding layout-padding flex> <div layout-gt=row>  <mb-titled-block mb-title=Account mb-progress=ctrl.avatarLoading flex-gt-sm=50> <div layout=column> <md-input-container> <label translate>ID</label> <input ng-model=ctrl.user.id disabled> </md-input-container> <md-input-container> <label translate>Username</label> <input ng-model=ctrl.user.login disabled> </md-input-container> <md-input-container> <label translate>Email</label> <input ng-model=ctrl.user.email type=email disabled> </md-input-container> </div> </mb-titled-block> </div> </md-content>"
  );


  $templateCache.put('views/users/mb-forgot-password.html',
    " <md-content layout=row layout-align=none layout-align-gt-sm=\"center center\" flex> <div md-whiteframe=3 style=\"max-height: none\" flex=100 flex-gt-sm=50 layout=column>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=!ctrl.sendingToken style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <div layout-margin> <h3 translate>recover password</h3> <p translate>recover password description</p> </div> <div style=\"text-align: center\" layout-margin ng-show=!ctrl.sendingToken> <span ng-show=\"ctrl.sendTokenState === 'fail'\" md-colors=\"{color:'warn'}\" translate>Failed to send token.</span> <span ng-show=\"ctrl.sendTokenState === 'success'\" md-colors=\"{color:'primary'}\" translate>Token is sent.</span> </div> <form name=ctrl.myForm ng-submit=sendToken(credit) layout=column layout-margin> <md-input-container> <label translate>Username</label> <input ng-model=credit.login name=username> </md-input-container> <md-input-container> <label translate>Email</label> <input ng-model=credit.email name=email type=email> <div ng-messages=ctrl.myForm.email.$error> <div ng-message=email translate>Email is not valid.</div> </div> </md-input-container>     <div ng-if=\"app.captcha.engine==='recaptcha'\" vc-recaptcha ng-model=credit.g_recaptcha_response theme=\"app.captcha.theme || 'light'\" type=\"app.captcha.type || 'image'\" key=app.captcha.recaptcha.key lang=\"app.captcha.language || 'fa'\"> </div> <input hide type=\"submit\"> </form> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\" layout-margin> <md-button ng-disabled=\"(credit.email === undefined && credit.login === undefined) || ctrl.myForm.$invalid\" flex-order=0 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=sendToken(credit)>{{'send recover message' | translate}}</md-button>     <md-button ng-click=cancel() flex-order=0 flex-order-gt-xs=0 class=md-raised> {{'cancel' | translate}} </md-button> </div> </div> </md-content>"
  );


  $templateCache.put('views/users/mb-login.html',
    " <md-content layout=row layout-align=none layout-align-gt-sm=\"center center\" flex> <div md-whiteframe=3 style=\"max-height: none\" flex=100 flex-gt-sm=50 layout=column>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=\"!(ctrl.loginProcess || ctrl.logoutProcess)\" style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <div style=\"text-align: center\" layout-margin ng-show=\"!ctrl.loginProcess && ctrl.loginState === 'fail'\"> <p><span md-colors=\"{color:'warn'}\" translate>{{loginMessage}}</span></p> </div> <form ng-show=app.user.anonymous name=ctrl.myForm ng-submit=ctrl.login(credit) layout=column layout-margin> <md-input-container> <label translate=\"\">Username</label> <input ng-model=credit.login name=username required> <div ng-messages=ctrl.myForm.username.$error> <div ng-message=required translate=\"\">This field is required.</div> </div> </md-input-container> <md-input-container> <label translate=\"\">Password</label> <input ng-model=credit.password type=password name=password required> <div ng-messages=ctrl.myForm.password.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container>  <div ng-if=\"app.options['captcha.engine']==='recaptcha'\" vc-recaptcha ng-model=credit.g_recaptcha_response theme=\"app.captcha.theme || 'light'\" type=\"app.captcha.type || 'image'\" key=\"app.options['captcha.engine.recaptcha.key']\" lang=\"app.setting.local || app.config.local || 'en'\"> </div> <input hide type=\"submit\"> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\" layout-margin> <a href=users/reset-password style=\"text-decoration: none\" ui-sref=forget flex-order=1 flex-order-gt-xs=-1> <span translate>Forgot your password?</span> </a> <md-button ng-disabled=ctrl.myForm.$invalid flex-order=-1 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=\"ctrl.login(credit, ctrl.myForm)\"> <span translate>Login</span> </md-button></div> </form> <div layout-margin ng-show=!app.user.anonymous layout=column layout-align=\"none center\"> <img width=150px height=150px ng-show=!uploadAvatar ng-src=\"{{app.user.current.avatar}}\"> <h3>{{app.user.current.login}}</h3> <p translate>you are logged in. go to one of the following options.</p> </div> <div ng-show=!app.user.anonymous layout=column layout-align=none layout-gt-xs=row layout-align-gt-xs=\"center center\" layout-margin> <md-button ng-click=ctrl.cancel() flex-order=0 flex-order-gt-xs=0 class=md-raised> <wb-icon>settings_backup_restore</wb-icon> <span translate>Back</span> </md-button> <md-button ng-href=users/account flex-order=1 flex-order-gt-xs=-1 class=md-raised> <wb-icon>account_circle</wb-icon> <span translate>Account</span> </md-button> </div> </div> </md-content>"
  );


  $templateCache.put('views/users/mb-password.html',
    "<md-content class=md-padding layout-padding flex>  <mb-titled-block mb-title=\"Change password\" mb-progress=ctrl.changingPassword flex-gt-sm=50> <p translate>Insert current password and new password to change it.</p> <form name=ctrl.passForm ng-submit=\"ctrl.changePassword(data, ctrl.passForm)\" layout=column layout-padding> <input hide type=\"submit\"> <div style=\"text-align: center\" layout-margin ng-show=\"!ctrl.changingPassword && changePassMessage\"> <p><span md-colors=\"{color:'warn'}\" translate>{{changePassMessage}}</span></p> </div> <md-input-container layout-fill> <label translate>current password</label> <input name=oldPass ng-model=data.oldPass type=password required> <div ng-messages=ctrl.passForm.oldPass.$error> <div ng-message=required>This is required.</div> </div> </md-input-container> <md-input-container layout-fill> <label translate>new password</label> <input name=newPass ng-model=data.newPass type=password required> <div ng-messages=ctrl.passForm.newPass.$error> <div ng-message=required>This is required.</div> </div> </md-input-container> <md-input-container layout-fill> <label translate>repeat new password</label> <input name=newPass2 ng-model=newPass2 type=password compare-to=data.newPass required> <div ng-messages=ctrl.passForm.newPass2.$error> <div ng-message=required>This is required.</div> <div ng-message=compareTo>password is not match.</div> </div> </md-input-container> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\"> <md-button class=\"md-raised md-primary\" ng-click=\"ctrl.changePassword(data, ctrl.passForm)\" ng-disabled=ctrl.passForm.$invalid> <span translate=\"\">Change password</span> </md-button> </div> </form> </mb-titled-block>  </md-content>"
  );


  $templateCache.put('views/users/mb-profile.html',
    "<md-content class=md-padding layout-padding flex> <div layout-gt-sm=row layout=column> <mb-titled-block mb-title=Avatar mb-progress=ctrl.avatarLoading flex-gt-sm=50 layout=column layout-margin> <div layout=row layout-align=\"center start\"> <lf-ng-md-file-input ng-if=\"ctrl.avatarState === 'edit'\" lf-files=ctrl.avatarFiles accept=image/* progress preview drag> </lf-ng-md-file-input> <img ng-if=\"ctrl.avatarState === 'normal'\" width=60% ng-src=/api/v2/user/accounts/{{ctrl.user.id}}/avatar ng-src-error=\"https://www.gravatar.com/avatar/{{app.user.current.id|wbmd5}}?d=identicon&size=32\"> </div> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\" ng-if=\"ctrl.avatarState === 'normal'\"> <md-button class=\"md-raised md-primary\" ng-click=ctrl.editAvatar()> <sapn translate>Edit</sapn> </md-button> <md-button class=\"md-raised md-accent\" ng-click=ctrl.deleteAvatar()> <sapn translate>Delete</sapn> </md-button> </div> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\" ng-if=\"ctrl.avatarState === 'edit'\"> <md-button class=\"md-raised md-primary\" ng-click=ctrl.uploadAvatar(ctrl.avatarFiles)> <sapn translate>Save</sapn> </md-button> <md-button class=\"md-raised md-accent\" ng-click=ctrl.cancelEditAvatar()> <sapn translate>Cancele</sapn> </md-button> </div> </mb-titled-block>  <mb-titled-block mb-title=\"Public Information\" mb-progress=\"ctrl.loadingProfile || ctrl.savingProfile\" flex-gt-sm=50 layout=column layout-margin> <form name=contactForm layout=column layout-padding> <md-input-container layout-fill> <label translate>First Name</label> <input ng-model=ctrl.profile.first_name> </md-input-container> <md-input-container layout-fill> <label translate>Last Name</label> <input ng-model=ctrl.profile.last_name> </md-input-container> <md-input-container layout-fill> <label translate>Public Email</label> <input name=email ng-model=ctrl.profile.public_email type=email> </md-input-container> <md-input-container layout-fill> <label translate>Language</label> <input ng-model=ctrl.profile.language> </md-input-container> <md-input-container layout-fill> <label translate>Timezone</label> <input ng-model=ctrl.profile.timezone> </md-input-container> </form> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\"> <md-button class=\"md-raised md-primary\" ng-click=save()> <sapn translate>Update</sapn> </md-button> </div> </mb-titled-block> </div> </md-content>"
  );


  $templateCache.put('views/users/mb-recover-password.html',
    " <md-content layout=row layout-align=none layout-align-gt-sm=\"center center\" flex> <div md-whiteframe=3 style=\"max-height: none\" flex=100 flex-gt-sm=50 layout=column>  <ng-include src=\"'views/partials/mb-branding-header-toolbar.html'\"></ng-include> <md-progress-linear ng-disabled=!ctrl.changingPass style=\"margin: 0px; padding: 0px\" md-mode=indeterminate class=md-primary md-color> </md-progress-linear>  <div layout-margin> <h3 translate>reset password</h3> <p translate>reset password description</p> </div> <div style=\"text-align: center\" layout-margin ng-show=!ctrl.changingPass> <span ng-show=\"ctrl.changePassState === 'fail'\" md-colors=\"{color:'warn'}\" translate>Failed to reset password.</span> <span ng-show=\"ctrl.changePassState === 'fail'\" md-colors=\"{color:'warn'}\" translate>{{$scope.changePassMessage}}</span> <span ng-show=\"ctrl.changePassState === 'success'\" md-colors=\"{color:'primary'}\" translate>Password is reset.</span> </div> <form name=ctrl.myForm ng-submit=changePassword(data) layout=column layout-margin> <md-input-container> <label translate>Token</label> <input ng-model=data.token name=token required> <div ng-messages=ctrl.myForm.token.$error> <div ng-message=required translate>This field is required.</div> </div> </md-input-container> <md-input-container> <label translate>New password</label> <input ng-model=data.password name=password type=password required> <div ng-messages=ctrl.myForm.password.$error> <div ng-message=required translate>This field required.</div> </div> </md-input-container> <md-input-container> <label translate>Repeat new password</label> <input name=password2 ng-model=repeatPassword type=password compare-to=data.password required> <div ng-messages=ctrl.myForm.password2.$error> <div ng-message=required translate>This field is required.</div> <div ng-message=compareTo translate>Passwords is not match.</div> </div> </md-input-container> <input hide type=\"submit\"> </form> <div layout=column layout-align=\"center none\" layout-gt-xs=row layout-align-gt-xs=\"end center\"> <md-button ng-disabled=ctrl.myForm.$invalid flex-order=0 flex-order-gt-xs=1 class=\"md-primary md-raised\" ng-click=changePassword(data)>{{'change password' | translate}}</md-button>     <md-button ng-click=cancel() flex-order=0 flex-order-gt-xs=0 class=md-raised> {{'cancel' | translate}} </md-button> </div> </div> </md-content>"
  );

}]);
