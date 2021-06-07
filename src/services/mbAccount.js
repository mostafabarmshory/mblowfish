import './mbAccount.css';

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

@example
	mblowfish.addView('/view/path', {
		...
		preAuthorize: 'isAuthenticated() && hasRole('account.manager')'
	});

@tutorial core-security-in-views.md
@tutorial core-security-authentication-provider.md

 */
function mbAccount() {
	//---------------------------------------
	// Services
	//---------------------------------------
	var provider;
	var service;

	var rootScope;
	var dispatcher;
	var q;
	var Authentication;


	//---------------------------------------
	// variables
	//---------------------------------------
	var rememberMe = true;
	var authenticated = false;
	var authentication;
	var principal; // principles (maps of roles)

	var exrpressionsEnabled = true;
	var providers = [];

	//---------------------------------------
	// functions
	//---------------------------------------
	function setExrpressionsEnabled(flag) {
		exrpressionsEnabled = flag;
		return provider;
	}


	/**
	 Loads current user informations
	 
	 If there is a role x.y (where x is application code and y is code name)
	 in role list then the following var is added in user:
	 
	 @name reload
	 @memberof $mbAccount
	 */
	function reload() {
		login(authentication);
	}

	/**
	 Logins into the backend
	 
	 @memberof $mbAccount
	 @param {object} credential User and password of the user
	 */
	function login(credential) {
		for (var i = 0; i < providers.length; i++) {
			if (providers[i].supports(credential)) {
				return providers[i].authenticate(credential)
					.then(function(newAuth) {
						newAuth.provider = providers[i];
						updateAuthentication(newAuth);
						authenticated = newAuth.authenticated;
					});
			}
		}
		return q.reject({
			providers: providers,
			message: 'No suitable provider found for authentication',
		});
	}

	/**
	 Application logout
	 
	 Logout and clean user data, this will change state of the application.
	 
	 @memberof $mbAccount
	 */
	function logout() {
		for (var i = 0; i < providers.length; i++) {
			if (providers[i] === authentication.provider) {
				return providers[i].forget(authentication)
					.then(updateAuthentication);
			}
		}
		for (var i = 0; i < providers.length; i++) {
			if (providers[i].supports(authentication)) {
				return providers[i].forget(authentication)
					.then(updateAuthentication);
			}
		}
		return q.reject({
			message: 'No suitable provider found'
		});
	}

	function getAuthentication() {
		return authention;
	}

	function getPrincipal() {
		return principal;
	}

	/**
	@name hasRole
	@memberof $mbAccount
	
	Returns true if the current principal has the specified role.
	
	@returns {boolean} true if current principle contains the input role
	 */
	function hasRole(role) {
		return hasAnyRole(role);
	}

	/**
	@name hasAnyRole
	@memberof $mbAccount
	
	Returns true if the current principal has any of the supplied roles (given as a comma-separated list of strings)
	
	@returns {boolean} true if current principle contains any input roles
	 */
	function hasAnyRole() {
		if (_.isUndefined(principal)) {
			return false;
		}
		for (var i = 0; i < arguments.length; i++) {
			if (principal[arguments[i]]) {
				return true;
			}
		}
		return false;
	}

	/**
	@name isAnonymous
	@memberof $mbAccount
	
	Returns true if the current principal is an anonymous user
	
	 */
	function isAnonymous() {
		return !authentication.authenticated;
	}

	/**
	@name isRememberMe
	@memberof $mbAccount
	
	Returns true if the current principal is a remember-me user
	
	 */
	function isRememberMe() {
		return rememberMe;
	}

	/**
	@name setRememberMe
	@memberof $mbAccount
	
	Set remember me option enable
	 */
	function setRememberMe(flag) {
		rememberMe = flag;
		return provider;
	}

	/**
	@name isAuthenticated
	@memberof $mbAccount
	
	Returns true if the user is not anonymous
	 */
	function isAuthenticated() {
		return authentication.authenticated;
	}

	/**
	@name isFullyAuthenticated
	@memberof $mbAccount
	
	Returns true if the user is not an anonymous or a remember-me user
	 */
	function isFullyAuthenticated() {
		return authenticated && isAuthenticated();
	}

	// Load basic functions into the rootScope
	function loadExpressions() {
		if (!exrpressionsEnabled) {
			return;
		}
		_.assign(rootScope, {
			isAnonymous: isAnonymous,
			hasRole: hasRole,
			hasAnyRole: hasAnyRole,
			principal: principal,
			authentication: authentication,
			isRememberMe: isRememberMe,
			isAuthenticated: isAuthenticated,
			isFullyAuthenticated: isFullyAuthenticated,
		});
	}

	//	Updates all global modules in root scope
	function updateAuthentication(newAuthentication) {
		authentication = newAuthentication;
		principal = newAuthentication.principal;
		if (exrpressionsEnabled) {
			_.assign(rootScope, {
				principal: principal,
				authentication: authentication,
			});
		}
		dispatcher.dispatch(MB_SECURITY_ACCOUNT_SP, {
			valeus: [authentication]
		});
	}

	//---------------------------------------
	// End
	//---------------------------------------
	service = {
		reload: reload,
		login: login,
		logout: logout,
		isAnonymous: isAnonymous,
		hasRole: hasRole,
		hasAnyRole: hasAnyRole,
		isRememberMe: isRememberMe,
		isAuthenticated: isAuthenticated,
		isFullyAuthenticated: isFullyAuthenticated,
		getAuthentication: getAuthentication,
		getPrincipal: getPrincipal,
	};
	provider = {
		$get: function($q, $rootScope, $mbDispatcher, $injector, MbAuthentication) {
			"ngInject";
			//>> Services
			rootScope = $rootScope;
			dispatcher = $mbDispatcher;
			Authentication = MbAuthentication;
			q = $q;

			//>> load the service
			authentication = new Authentication();
			loadExpressions();
			_.forEach(provider.providers, function(name) {
				var Factory = $injector.get(name);
				providers.push(new Factory());
			});
			return service;
		},
		setExrpressionsEnabled: setExrpressionsEnabled,
		setRememberMe: setRememberMe,
		providers: [],
		addAuthenticationProvider: function(name) {
			provider.providers.push(name);
		}
	};
	return provider;
}

export default mbAccount;