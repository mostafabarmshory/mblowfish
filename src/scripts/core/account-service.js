

angular.module('mblowfish-core').provider('$mbAccount', function() {
	//---------------------------------------
	// Services
	//---------------------------------------
	var provider;
	var service;
	var rootScope;


	//---------------------------------------
	// variables
	//---------------------------------------
	var USER_DETAIL_GRAPHQL = '{id, login, profiles{first_name, last_name, language, timezone}, roles{id, application, code_name}, groups{id, name, roles{id, application, code_name}}}';




	//---------------------------------------
	// functions
	//---------------------------------------
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

	/**
	 * Logins into the backend
	 * 
	 * @memberof $mbAccount
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
	 * @memberof $mbAccount
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

	provider = {
		$get: function() {
			return service;
		}
	};
	return provider;
});