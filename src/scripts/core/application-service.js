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
 * NOTE: base application data is created in run/app.js
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
angular.module('mblowfish-core').service('$app', function(
		/* MB            */ $application, $mbStorage,
		/* seen          */ $usr, $cms, $tenant, UserAccount, $translate,
		/* am-wb-core    */ $dispatcher, $objectPath,
		/* material      */ $mdDateLocale,
		/* angularjs     */ $httpParamSerializerJQLike, $http, $q, $rootScope, $timeout
) {


	//	/*
	//	 * Extends application to be observable
	//	 */
	//	angular.extend(this, new WbObservableObject());

	/***************************************************************************
	 * utils
	 **************************************************************************/
	/*
	 * Bind list of roles to app data
	 */
	function rolesToPermissions(roles) {
		var permissions = [];
		for (var i = 0; i < roles.length; i++) {
			var role = roles[i];
			permissions[role.application + '_' + role.code_name] = true;
		}
		return permissions;
	}

	function keyValueToMap(keyvals) {
		var map = [];
		for (var i = 0; i < keyvals.length; i++) {
			var keyval = keyvals[i];
			map[keyval.key] = keyval.value;
		}
		return map;
	}

	function parseBooleanValue(value) {
		value = value.toLowerCase();
		switch (value) {
			case true:
			case 'true':
			case '1':
			case 'on':
			case 'yes':
				return true;
			default:
				return false;
		}
	}

	/***************************************************************************
	 * applicaiton data
	 **************************************************************************/
	var appConfigurationContent = null;

	// the state machine
	var stateMachine;

	// Constants
	var APP_CNF_MIMETYPE = 'application/amd-cnf';
	var USER_DETAIL_GRAPHQL = '{id, login, profiles{first_name, last_name, language, timezone}, roles{id, application, code_name}, groups{id, name, roles{id, application, code_name}}}';
	var TENANT_GRAPHQL = '{id,title,description,' +
		'account' + USER_DETAIL_GRAPHQL +
		'configurations{key,value}' +
		'settings{key,value}' +
		'}';


	/**
	 * Handles internal service events
	 */
	function handleEvent(key, data) {
		// update internal state machine
		stateMachine.handle(key, data);
	}

	/**
	 * Sets state of the service
	 * 
	 * NOTE: must be used locally
	 */
	function setApplicationState(state) {
		// create event
		var $event = {
			type: 'update',
			value: state,
			oldValue: $rootScope.__app.state
		};
		$rootScope.__app.state = state;

		// staso, 2019: fire the state is changed
		$dispatcher.dispatch('/app/state', $event);

		// TODO: move to application extension
		_loadingLog('$app event handling', '$app state is changed from ' + $event.oldValue + ' to ' + state);
	}

	/**
	 * Gets the state of the application
	 * 
	 * @memberof $app
	 */
	this.getState = function() {
		return $rootScope.__app.state;
	};

	function setApplicationDirection(dir) {
		$rootScope.__app.dir = dir;
	}

	function setApplicationLanguage(key) {
		if ($rootScope.__app.state !== 'ready') {
			return;
		}
		// 0- set app local
		$rootScope.__app.language = key;
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
	}

	function setApplicationCalendar(key) {
		// 0- set app local
		$rootScope.__app.calendar = key;
	}

	function parsTenantConfiguration(configs) {
		$rootScope.__tenant.configs = keyValueToMap(configs);
		var $event = {
			src: this,
			type: 'update',
			value: $rootScope.__tenant.configs
		};
		$dispatcher.dispatch('/tenant/configs', $event);

		// load domains
		var domains = {};
		var regex = new RegExp('^module\.(.*)\.enable$', 'i');
		for (var i = 0; i < configs.length; i++) {
			var config = configs[i];
			var match = regex.exec(config.key);
			if (match) {
				var key = match[1].toLowerCase();
				domains[key] = parseBooleanValue(config.value);
			}
		}
		$rootScope.__tenant.domains = domains;
		// Flux: fire account change
		var $event = {
			src: this,
			type: 'update',
			value: $rootScope.__tenant.domains
		};
		$dispatcher.dispatch('/tenant/domains', $event);
	}

	function parsTenantSettings(settings) {
		$rootScope.__tenant.settings = keyValueToMap(settings);
		$rootScope.__app.options = $rootScope.__tenant.settings;

		// Flux: fire setting change
		var $event = {
			src: this,
			type: 'update',
			value: $rootScope.__account
		};
		$dispatcher.dispatch('/tenant/settings', $event);
	}

	function parsAccount(account) {
		var anonymous = !account.id || account.id == 0;

		// app user data
		$rootScope.__app.user = {
			anonymous: anonymous,
			current: new UserAccount(account)
		};
		// load basic information of account
		$rootScope.__account.anonymous = anonymous;
		$rootScope.__account.id = account.id;
		$rootScope.__account.login = account.login;
		$rootScope.__account.email = account.email;

		if (anonymous) {
			// legacy
			$rootScope.__app.user.profile = {};
			$rootScope.__app.user.roles = {};
			$rootScope.__app.user.groups = {};
			// update app
			$rootScope.__account.profile = {};
			$rootScope.__account.roles = {};
			$rootScope.__account.groups = {};
			return;
		}
		// load the first profile of user
		if (angular.isArray(account.profiles)) {
			var profile = account.profiles.length ? account.profiles[0] : {};
			$rootScope.__app.user.profile = profile;
			$rootScope.__account.profile = profile;
		}
		// load user roles, groups and permissions
		var permissions = rolesToPermissions(account.roles || []);
		var groupMap = {};
		var groups = account.groups || [];
		for (var i = 0; i < groups.length; i++) {
			var group = groups[i];
			groupMap[group.name] = true;
			_.assign(permissions, rolesToPermissions(group.roles || []));
		}
		_.assign($rootScope.__app.user, permissions);
		$rootScope.__account.permissions = permissions;
		$rootScope.__account.roles = account.roles || [];
		$rootScope.__account.groups = account.groups || [];

		// Flux: fire account change
		var $event = {
			src: this,
			type: 'update',
			value: $rootScope.__account
		};
		$dispatcher.dispatch('/account', $event);
	}

	/***********************************************************
	 * Application configuration
	 ***********************************************************/
	/*
	 * deprecated: watch application configuration
	 */
	var __configs_clean = false;
	$rootScope.$watch('__app.configs', function(newValue, oldValue) {
		if (!__configs_clean) {
			return;
		}
		$dispatcher.dispatch('/app/configs', {
			type: 'update',
			value: newValue,
			oldValue: oldValue
		});
	}, true);

	/**
	 * Load application configuration
	 */
	function parsAppConfiguration(config) {
		if (angular.isString(config)) {
			try {
				config = JSON.parse(config);
			} catch (ex) {
			}
		}
		config = angular.isObject(config) ? config : {};
		$rootScope.__app.config = config;
		$rootScope.__app.configs = config;

		// Support old config
		if ($rootScope.__app.configs.local) {
			$rootScope.__app.configs.language = $rootScope.__app.configs.local.language;
			$rootScope.__app.configs.calendar = $rootScope.__app.configs.local.calendar;
			$rootScope.__app.configs.dir = $rootScope.__app.configs.local.dir;
			$rootScope.__app.configs.dateFormat = $rootScope.__app.configs.local.dateFormat;
			delete $rootScope.__app.configs.local;
		}

		// Flux: fire application config
		$dispatcher.dispatch('/app/configs', {
			src: this,
			type: 'load',
			value: $rootScope.__app.configs
		});
		// TODO: remove watch on configs
		$timeout(function() {
			__configs_clean = true;
		}, 1000);
	}

	this.getConfig = function(key) {
		return objectPath.get($rootScope.__app.configs, key);
	};

	this.setConfig = function(key, value) {
		var oldValue = this.getConfig(key);
		objectPath.set($rootScope.__app.configs, key, value);
		// Flux: fire application config
		$dispatcher.dispatch('/app/configs', {
			src: this,
			type: 'update',
			key: key,
			value: value,
			oldValue: oldValue
		});
	};

	function loadDefaultApplicationConfig() {
		// TODO: load last valid configuration from settings
	}

	/************************************************************
	 * Application stting
	 ************************************************************/

	function parsAppSettings(settings) {
		$rootScope.__app.setting = settings;
		$rootScope.__app.settings = settings;


		// Flux: fire application settings
		var $event = {
			src: this,
			type: 'update',
			value: $rootScope.__app.settings
		};
		$dispatcher.dispatch('/app/settings', $event);
	}

	/*
	 * Loads current user informations
	 * 
	 * If there is a role x.y (where x is application code and y is code name)
	 * in role list then the following var is added in user:
	 * 
	 * $rootScope.__app.user.x_y
	 * 
	 */
	function loadUserProperty() {
		_loadingLog('loading user info', 'fetch user information');
		return $usr.getAccount('current', {
			graphql: USER_DETAIL_GRAPHQL
		}) //
			.then(parsAccount);
	}

	function loadRemoteData() {
		_loadingLog('loading', 'fetch remote storage');

		// application config
		var pLoadAppConfig = $cms.getContent($rootScope.__app.configs_key) //
			.then(function(content) {
				appConfigurationContent = content;
				return appConfigurationContent.downloadValue();
			})
			.then(parsAppConfiguration);

		// load current tenant
		var pCurrentTenant = $tenant.getTenant('current', {
			graphql: TENANT_GRAPHQL
		})
			.then(function(data) {
				parsTenantConfiguration(data.configurations || []);
				parsTenantSettings(data.settings || []);
				parsAccount(data.account || []);
			});
		return $q.all([pLoadAppConfig, pCurrentTenant]);
	}

	function loadLocalData() {
		_loadingLog('loading setting from local storage', 'fetch settings');
		/*
		 * TODO: masood, 2018: The lines below is an alternative for lines above
		 * but not recommended.
		 * 
		 * TODO: 'key' of app should be used $mbStorage,.setPrefix(key);
		 */
		var settings =  $mbStorage.$default({
			dashboardModel: {}
		});
		return $q.resolve(settings)
			.then(parsAppSettings);
	}

	function loadApplication() {
		var jobs = [];
		if ($application.isAutoloadConfigs()) {
			jobs.push(loadRemoteData());
		}
		jobs.push(loadLocalData());
		return $q.all(jobs)
			.finally(function() {
				// TODO: maso, check if all things are ok
				if ($rootScope.__app.isOffline) {
					handleEvent(APP_EVENT_NET_ERROR);
					return;
				}
				if ($rootScope.__app.isRemoteDataLoaded) {
					handleEvent(APP_EVENT_SERVER_ERROR);
					return;
				}
				if ($rootScope.__app.isApplicationConfigLoaded) {
					handleEvent(APP_EVENT_APP_CONFIG_ERROR);
					return;
				}
				handleEvent(APP_EVENT_LOADED);
			});
	}

	/***************************************************************************
	 * 
	 **************************************************************************/

	// states
	var APP_STATE_WAITING = 'waiting';
	var APP_STATE_LOADING = 'loading';

	// final states
	var APP_STATE_READY = 'ready';
	var APP_STATE_OFFLINE = 'offline';
	var APP_STATE_FAIL = 'fail';

	var APP_EVENT_LOADED = 'loaded';
	var APP_EVENT_START = 'start';
	var APP_EVENT_SERVER_ERROR = 'server_error';
	var APP_EVENT_NET_ERROR = 'network_error';
	var APP_EVENT_APP_CONFIG_ERROR = 'config_error';

	/*
	 * Attaches loading logs
	 */
	function _loadingLog(stage, message) {
		$rootScope.__app.logs.push(stage + ':' + message);
	}

	/*
	 * Stores app configuration on the back end
	 */
	this.storeApplicationConfig = function() {
		if (!$rootScope.__account.permissions.tenant_owner) {
			return;
		}
		if (appConfigurationContent) { // content loaded
			return appConfigurationContent.uploadValue($rootScope.__app.configs);
		}
		// create content
		promise = $cms.putContent({
			name: $rootScope.__app.configs_key,
			mimetype: APP_CNF_MIMETYPE
		})
			.then(function(content) {
				appConfigurationContent = content;
				return appConfigurationContent.uploadValue($rootScope.__app.configs);
			});
	};

	/*
	 * Check a module to see if it is enable or not
	 */
	// TODO: Masood, 2019: Improve the function to check based on tenant setting
	function isEnable(moduleName) {
		return $rootScope.__tenant.domains[moduleName];
	}

	/**
	 * Logins into the backend
	 * 
	 * @memberof $app
	 * @param {object}
	 *            credential of the user
	 */
	function login(credential) {
		if (!$rootScope.__account.anonymous) {
			return $q.resolve($rootScope.__account);
		}
		return $http({
			method: 'POST',
			url: '/api/v2/user/login',
			data: $httpParamSerializerJQLike(credential),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
			.then(loadUserProperty);
	}

	/**
	 * Application logout
	 * 
	 * Logout and clean user data, this will change state of the application.
	 * 
	 * @memberof $app
	 */
	function logout() {
		if ($rootScope.__account.anonymous) {
			return $q.resolve($rootScope.__account);
		}
		return $http({
			method: 'POST',
			url: '/api/v2/user/logout',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
			.then(loadUserProperty);
	}


	/*
	 * State machine to handle life cycle of the system.
	 */
	stateMachine = new machina.Fsm({
		namespace: 'webpich.$app',
		initialState: APP_STATE_WAITING,
		states: {
			// Before the 'start' event occurs via $app.start().
			waiting: {
				start: APP_STATE_LOADING,
				network_error: APP_STATE_OFFLINE,
				server_error: APP_STATE_FAIL
			},
			// tries to load all part of system
			loading: {
				_onEnter: function() {
					loadApplication();
				},
				loaded: APP_STATE_READY,
				network_error: APP_STATE_OFFLINE,
				server_error: APP_STATE_FAIL,
				config_error: APP_STATE_READY,
			},
			// app is ready
			ready: {
				loaded: APP_STATE_READY,
				network_error: APP_STATE_OFFLINE,
				server_error: APP_STATE_FAIL,
				config_error: APP_STATE_READY,
			},
			// app is ready with no config
			ready_not_configured: {
				_onEnter: function() {
					loadDefaultApplicationConfig();
				},
				loaded: APP_STATE_READY,
				network_error: APP_STATE_OFFLINE,
				server_error: APP_STATE_FAIL,
				config_error: APP_STATE_READY,
			},
			// server error
			fail: {
				loaded: APP_STATE_READY,
				network_error: APP_STATE_OFFLINE,
				server_error: APP_STATE_FAIL,
				config_error: APP_STATE_READY,
			},
			// net error
			offline: {
				_onEnter: function() {
					offlineReloadDelay = 3000;
					$timeout(loadApplication, offlineReloadDelay);
				},
				loaded: APP_STATE_READY,
				network_error: APP_STATE_OFFLINE,
				server_error: APP_STATE_FAIL,
				config_error: APP_STATE_READY,
			}
		},
	});

	// I'd like to know when the transition event occurs
	stateMachine.on('transition', function() {
		setApplicationState(stateMachine.state);
	});

	/*
	 * watch direction and update app.dir
	 */
	$rootScope.$watch(function() {
		return $rootScope.__app.settings.dir || $rootScope.__app.configs.dir || 'ltr';
	}, setApplicationDirection);

	/*
	 * watch local and update language
	 */
	$rootScope.$watch(function() {
		// Check language
		return $rootScope.__app.settings.language || $rootScope.__app.configs.language || 'en';
	}, setApplicationLanguage);

	/*
	 * watch calendar
	 */
	$rootScope.$watch(function() {
		return $rootScope.__app.settings.calendar || $rootScope.__app.configs.calendar || 'Gregorian';
	}, setApplicationCalendar);

	// Init
	this.login = login;
	this.logout = logout;
	this.isEnable = isEnable;

	// test
	// TODO: remove in deploy
	this.__parsTenantConfiguration = parsTenantConfiguration;



	/**************************************************************************
	 * application properties
	 **************************************************************************/
	this.getProperty = function(key, defaultValue) {
		var tempObject = {
			app: $rootScope.__app,
			tenant: $rootScope.__tenant,
			account: $rootScope.__account,
		};
		return $objectPath.get(tempObject, key) || defaultValue;
	};

	this.setProperty = function(key, value) {
		var tempObject = {
			app: $rootScope.__app,
			tenant: $rootScope.__tenant,
			account: $rootScope.__account,
		};
		$objectPath.set(tempObject, key, value)
	};

	this.setProperties = function(map) {
		// TODO:
	};


	/*
	 * Check if current account changed
	 */
	$dispatcher.on('/user/accounts/current', function() {
		loadUserProperty();
	});



	function start(key) {
		/***************************************************************************
	 * New app state
	 * 
	 * Application state is saved in the root scope
	 **************************************************************************/
		/*
		 * Store application state
		 */
		$rootScope.__app = {
			/******************************************************************
			 * New model
			 ******************************************************************/
			state: 'waiting',
			key: '',
			configs: {},
			settings: {},
			language: 'en',
			/******************************************************************
			 * Old model
			 ******************************************************************/
			logs: [],
			user: {
				current: {},
				profile: {},
				anonymous: true,
				administrator: false,
				owner: false,
				member: false,
				authorized: false
			},
			// application settings
			config: {},
			// user settings
			setting: {},
			/*
			 * NOTE: this part is deprecated use tenant
			 */
			// tenant settings
			options: {},
			local: 'en', // Default local and language
			dir: 'rtl'
		};
		$rootScope.app = $rootScope.__app;

		/*
		 * Store tenant sate
		 */
		$rootScope.__tenant = {
			id: 0,
			title: 'notitle',
			description: 'nodescription',
			configs: {},
			settings: {},
			domains: {}
		};

		/*
		 * Store account state
		 */
		$rootScope.__account = {
			anonymous: true,
			id: 0,
			login: '',
			profile: {},
			roles: {},
			groups: {},
			permissions: {},
			messages: []
		};

		$rootScope.__app.key = key;
		$rootScope.__app.configs_key = 'angular-material-blowfish-' + key;

		// handle internal events
		handleEvent(APP_EVENT_START);
	}
	start($application.getKey());
	return this;
})


	/**
	@ngdoc Services
	@name $application
	@description Application manager
	*/
	.provider('$application', function() {

		var provider, service;
		var key = 'demo';
		var autoloadConfigs = false;
		var autosaveConfigs = false;


		function setKey(appkey) {
			key = appkey;
			return provider;
		}

		function getKey() {
			return key;
		}

		function serviceFactory() {
			return service;
		}

		function setAutoloadConfigs(auto) {
			autoloadConfigs = auto;
			return provider;
		}

		function isAutoloadConfigs() {
			return autoloadConfigs;
		}

		function setAutosaveConfigs(auto) {
			autosaveConfigs = auto;
			return provider;
		}

		function isAutosaveConfigs() {
			return autosaveConfigs;
		}

		service = {
			getKey: getKey,
			isAutoloadConfigs: isAutoloadConfigs,
			isAutosaveConfigs: isAutosaveConfigs,
		};
		provider = {
			$get: serviceFactory,
			setKey: setKey,
			setAutoloadConfigs: setAutoloadConfigs,
			setAutosaveConfigs: setAutosaveConfigs
		};
		return provider;
	});
