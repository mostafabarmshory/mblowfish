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
@ngdoc Services
@name $mbAccount
@description Mnages and follow the state fo current account.

The application can serve a singele accoutn at a time. 

This serivce is designe to follow the state of the current account.

Here is some commone functions:

- login
- logout
- getting account detaile
- change profile, account, email, ...
- check groups
- check rolses

# Expression-Based Access Control

Mblowfish Security introduced the ability to use expressions as an 
authorization mechanism in addition to the simple use of configuration attributes 
and access-decision voters which have seen before. 

Expression-based access control is built on the same architecture but allows complicated 
boolean logic to be encapsulated in a single expression.

MBlowfish Security uses AngularJS Expression for expression support and you should look at 
how that works if you are interested in understanding the topic in more depth. 
Expressions are evaluated with a “rootScope” as the evaluation context. 
Mblowfish Security uses specific classes for web and method security as the rootScope, in order to 
provide built-in expressions and access to values such as the current principal.

## Common Built-In Expressions

The base class for expression rootScope is $mbAccount. This provides some 
common expressions which are available in security.

- hasRole([role])
- hasAnyRole([role1,role2])
- principal: Allows direct access to the principal object representing the current user
- authentication: Allows direct access to the current Authentication object obtained from the SecurityContext
- permitAll: Always evaluates to true
- denyAll: Always evaluates to false
- isAnonymous()
- isRememberMe()
- isAuthenticated()
- isFullyAuthenticated()

For example, to add security into a view or editor:

	{
		url: '/view/url',
		...
		preAuthorize: 'isAuthenticated() && hasRole('account.manager')'
	}


 */
angular.module('mblowfish-core').provider('$mbAccount', function() {
	//---------------------------------------
	// Services
	//---------------------------------------
	var rolesToPermissions;
	var httpParamSerializerJQLike;

	var provider;
	var service;

	var rootScope;
	var http;
	var usr;
	var dispatcher;

	var Account;
	var Profile;
	var Group;
	var Role;

	//---------------------------------------
	// variables
	//---------------------------------------
	var USER_DETAIL_GRAPHQL = '{id, login, profiles{first_name, last_name, language, timezone}, roles{id, application, code_name}, groups{id, name, roles{id, application, code_name}}}';

	var STATE_INIT = 0;
	var STATE_LOGIN = 1;
	var STATE_ANONYMOUS = 2;
	var state;

	/*
	Force to remember the login
	*/
	var rememberMe = true;
	var exrpressionsEnabled = true;

	/*
	True if is authenticated at the current run
	 */
	var authenticated = false;

	var account;
	var roles;
	var groups;
	var permissions;
	var profile;
	var profiles;

	//---------------------------------------
	// functions
	//---------------------------------------

	function setExrpressionsEnabled(flag) {
		exrpressionsEnabled = flag;
		return provider;
	}

	function parsAccount(account) {
		var oldAccount = currentAccount;
		var oldProfiles = profiles;
		var oldProfile = profile;
		var oldGroups = groups;

		//>> Load profiles
		profiles = [];
		profile = undefined;
		if (angular.isArray(account.profiles)) {
			_.forEach(account.profiles, function(profileConfig) {
				profiles.push(new Profile(profileConfig))
			});
		}
		if (profiles[0]) {
			profile = profiles[0];
		}

		//>> Load rolses
		permissions = rolesToPermissions(account.roles || []);
		roles = [];
		_.forEach(account.roles, function(role) {
			roles[role.application + '_' + role.code_name] = new Role(role);
		});

		//>> Load groups
		var groups = {};
		_.forEach(account.groups, function(group) {
			groups[group.name] = new Group(group);
			_.assign(permissions, rolesToPermissions(group.roles || []));
		});


		//>> set account
		currentAccount = new Account(account);


		//>> Fire events
		if (exprexrpressionsEnabled) {
			updateRootScope();
		}
		var $event = {
			src: this,
			type: 'update',
		};
		dispatcher.dispatch('/account', _.assign({}, $event, {
			value: currentAccount,
			oldValue: oldAccount
		}));
	}


	/**
	 Loads current user informations
	 
	 If there is a role x.y (where x is application code and y is code name)
	 in role list then the following var is added in user:
	 
	 @name reload
	 @memberof $mbAccount
	 */
	function reload() {
		return usr.getAccount('current', {
			graphql: USER_DETAIL_GRAPHQL
		}).then(parsAccount);
	}

	/**
	 Logins into the backend
	 
	 @memberof $mbAccount
	 @param {object} credential User and password of the user
	 */
	function login(credential) {
		return http({
			method: 'POST',
			url: '/api/v2/user/login',
			data: httpParamSerializerJQLike(credential),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(reload);
	}

	/**
	 Application logout
	 
	 Logout and clean user data, this will change state of the application.
	 
	 @memberof $mbAccount
	 */
	function logout() {
		if (state = STATE_ANONYMOUS) {
			return;
		}
		return http({
			method: 'POST',
			url: '/api/v2/user/logout',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(reload);
	}

	/**
	 
	 @memberof $mbAccount
	 */
	function getAccount() {
		return account;
	}

	/**
	 
	 @memberof $mbAccount
	 */
	function getProfile() {
		return profile;
	}

	/**
	 
	 @memberof $mbAccount
	 */
	function getProfiles() {
		return profiles;
	}

	/**
	 
	 @memberof $mbAccount
	 */
	function getRoles() {
		return roles;
	}

	/**
	 
	 @memberof $mbAccount
	 */
	function getGroups() {
		return groups;
	}

	/**
	Returns true if the current principal has the specified role.
	 */
	function hasRole(role) {
		return hasAnyRole(role);
	}

	/**
	Returns true if the current principal has any of the supplied roles (given as a comma-separated list of strings)
	
	 */
	function hasAnyRole() {
		for (var i = 0; i < arguments.length; i++) {
			if (permissions[arguments[i]]) {
				return true;
			}
		}
		return false;
	}

	/**
	Returns true if the current principal is an anonymous user
	
	@memberof $mbAccount
	 */
	function isAnonymous() {
		return state != STATE_LOGIN;
	}

	/**
	Returns true if the current principal is a remember-me user
	
	@memberof $mbAccount
	 */
	function isRememberMe() {
		return rememberMe;
	}

	/**
	Set remember me option enable
	
	@memberof $mbAccount
	 */
	function setRememberMe(flag) {
		rememberMe = flag;
		return provider;
	}

	/**
	Returns true if the user is not anonymous
	 */
	function isAuthenticated() {
		return state == STATE_LOGIN;
	}

	/**
	Returns true if the user is not an anonymous or a remember-me user
	 */
	function isFullyAuthenticated() {
		return sate == STATE_LOGIN && authenticated;
	}


	function loadExpressions() {
		_.assign(rootScope, {
			isAnonymous: isAnonymous,
			hasRole: hasRole,
			hasAnyRole: hasAnyRole,
			principal: roles,
			authentication: account,
			permissions: permissions,
			permitAll: true,
			denyAll: false,
			isRememberMe: isRememberMe,
			isAuthenticated: isAuthenticated,
			isFullyAuthenticated: isFullyAuthenticated,
		});
	}

	/*
	Updates all global modules in root scope
	*/
	function updateRootScope() {
		_.assign(rootScope, {
			principal: roles,
			authentication: account,
			permissions: permissions,
		}, account);
	}

	//---------------------------------------
	// End
	//---------------------------------------
	service = {
		STATE_INIT: STATE_INIT,
		STATE_LOGIN: STATE_LOGIN,
		STATE_ANONYMOUS: STATE_ANONYMOUS,
		login: login,
		logout: logout,
		isAnonymous: isAnonymous,
		hasRole: hasRole,
		hasAnyRole: hasAnyRole,
		isRememberMe: isRememberMe,
		isAuthenticated: isAuthenticated,
		isFullyAuthenticated: isFullyAuthenticated,
		getGroups: getGroups,
		getRoles: getRoles,
		getProfile: getProfile,
		getProfiles: getProfiles,
		getAccount: getAccount,
		reload: reload,
	};
	provider = {
		/* @ngInject */
		$get: function(
			$rootScope, $http, $usr, $dispatcher,
			$mbUtil, $httpParamSerializerJQLike,
			UserAccount, UserProfile, UserGroup, UserRole
		) {
			//>> Static methosd
			rolesToPermissions = $mbUtil.rolesToPermissions;
			httpParamSerializerJQLike = $httpParamSerializerJQLike;

			//>> Services
			rootScope = $rootScope;
			http = $http;
			usr = $usr;
			dispatcher = $dispatcher;

			Account = UserAccount;
			Profile = UserProfile;
			Group = UserGroup;
			Role = UserRole;

			//>> load the service
			if (exrpressionsEnabled) {
				loadExpressions();
			}
			return service;
		},
		setExrpressionsEnabled: setExrpressionsEnabled,
		setRememberMe: setRememberMe,
	};
	return provider;
});