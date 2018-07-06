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
 * @ngdoc services
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
.service('$app', function($rootScope, $usr, $monitor, $actions, $q, $cms, $translate, $mdDateLocale, $localStorage) {

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
		if(!app.config.local){
			app.config.local = {};
		}
		return app.setting.dir || app.config.local.dir;
	}, function(value) {
		app.dir = (app.setting.dir || app.config.local.dir);
	});

	/*
	 * watch local
	 */
	$rootScope.$watch(function(){
		// TODO: maso, 2018: remove this part in the next release
		if(!angular.isObject(app.config.local)){
			app.config.local = {};
		}
		// Check language
		return app.setting.local || app.config.local.language || 'en';
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


	var configRequesters = {};

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
		if(app.state.status !== 'loading' && app.state.status !== 'fail'){
			return $q.when(app.config[key] || defaultValue);
		}			
		var defer = $q.defer();
		configRequesters[key] = configRequesters[key] || [];
		configRequesters[key].push(defer);
		return defer.promise;
	}

	$rootScope.$watch('app.state.status', function(val){
		if(val === 'loading'){
			return;
		}
		angular.forEach(configRequesters, function(defers, key){
			angular.forEach(defers, function(def){
				if(val === 'fail' || val === 'error'){						
					def.reject('Fail to get config');
				}else{
					def.resolve(app.config[key]);
				}
			})
		});
	});

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
			_loadingLog('loading configuration', 'fetch configuration content');
			return app._acc.value();
		}, function(error) {
			if(error.status === 404){
				return {};
			}
			// TODO: maso, 2018: throw an excetpion and go the the fail state
			_loadingLog('loading configuration', 'warning: ' + error.message);
		}) //
		.then(function(appConfig) {
			app.config = appConfig;
			_loadingLog('loading configuration', 'application configuration loaded successfully');
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
	 * If there is a role x.y (where x is application code and y is code name) in role list then
	 * the folloing var is added in user:
	 * 
	 *     app.user.x_y
	 * 
	 */
	function loadUserProperty() {
		_loadingLog('loading user info', 'fetch user information');
		return $usr.session() //
		.then(function(user) {
			// app user date
			app.user={};
			app.user.current = user;
			app.user.anonymous = user.isAnonymous();
			_loadingLog('loading user info', 'user information loaded successfully');

			_loadingLog('loading user info', 'check user permissions');
			if(angular.isArray(user.roles)){
				for(var i=0; i < user.roles.length; i++){
					var role = user.roles[i];
					app.user[role.application+'_'+role.code_name] = role;
				}
				delete user.roles;
			}

			/*
			 * @DEPRECATED: this monitor will be removed in the next version.
			 */
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
	 * Loads local storage
	 */
	function loadLocalStorage(){
		$rootScope.app.setting = $localStorage.$default({
			dashboardModel : {}
		});
//		$rootScope.app.session = $localStorage.$default({
//		dashboardModel : {}
//		});
		return $q.when($rootScope.app.setting);
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
	 * Loads local storage used to store user settings.
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
		jobs.push(loadLocalStorage());
		jobs.push(loadUserProperty());
		jobs.push(loadApplicationConfig());
		return $q.all(jobs) //
		// FIXME: maso, 2018: run applilcation defined jobs after all application jobs
//		.then(function(){
//		return $q.all(applicationJobs);
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


	var _defaultToolbars = [];

	function setDefaultToolbars(defaultToolbars){
		_defaultToolbars = defaultToolbars || [];
		return this;
	}

	function defaultToolbars(){
		return _defaultToolbars;
	}

	var _defaultSidenavs = [];

	function setDefaultSidenavs(defaultSidenavs){
		_defaultSidenavs = defaultSidenavs || [];
		return this;
	}

	function defaultSidenavs(){
		return _defaultSidenavs;
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
	apps.setDefaultToolbars = setDefaultToolbars;
	apps.defaultToolbars = defaultToolbars;

	// sidenav
	apps.sidenavs = sidenavs;
	apps.newSidenav = newSidenav;
	apps.sidenav = sidenav;
	apps.setDefaultSidenavs = setDefaultSidenavs;
	apps.defaultSidenavs = defaultSidenavs;

	return apps;
});