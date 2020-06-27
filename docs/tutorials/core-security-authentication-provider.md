# Mblowfish Security Authentication Provider

This tutorial will show how to set up an Authentication Provider in Mblowfish Security to allow for additional flexibility 
compared to the standard scenario using a simple UserDetailsService.


## The Authentication Provider

Mblowfish Security provides a variety of options for performing authentication. These follow a simple contract – an Authentication request is processed by an AuthenticationProvider and a fully authenticated object with full credentials is returned.

The standard and most common implementation is the SeenAuthenticationProvider – which retrieves the user details from a simple, read-only user REST.

More custom scenarios will still need to access the full Authentication request to be able to perform the authentication process. For example, when authenticating against some external, third party service – both the username and the password from the authentication request will be necessary.

For these, more advanced scenarios, we'll need to define a custom Authentication Provider:

	mblowfish.factory('CustomAuthenticationProvider', function($http, MblowfishAuthenticationProvider){
		
		function CustomAuthenticationProvider(configs) {
			MblowfishAuthenticationProvider.call(this, configs);
			return this;
		};
		CustomAuthenticationProvider.prototype = Object.create(MblowfishAuthenticationProvider.prototype);
	
		CustomAuthenticationProvider.prototype.authenticate = function(authentication) {
			return $http.post('/authentication/endpoint', authentication)
				.then(function(result){
					return result.data;
				});
		};
	
		return CustomAuthenticationProvider;
	});

Notice that the granted authorities set on the returned Authentication object are empty. This is because authorities are of course application specific.

## Register the Auth Provider

Now that we've defined the Authentication Provider, we need to specify it in the application configuration:

	mblowfish.config(function($mbAccountProvider){
		$mbAccountProvider
			...
			.setAuthenticationProvider('CustomAuthenticationProvider');
	});

## Conclusion

In this article, we discussed an example of a custom authentication provider for Spring Security.

The full implementation of this tutorial can be found in the GitHub project.
