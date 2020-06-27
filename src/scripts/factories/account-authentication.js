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

/**
@ngdoc Factories
@name MbAuthenticationProvider
@description 

Represents the token for an authentication request or for an authenticated principal once
the request has been processed by the MblowfishAuthenticationProvider.authenticate(Authentication) 
method.

Once the request has been authenticated, the Authentication will usually be stored in a
security context managed by the $mbAccount by the authentication mechanism which is 
being used. An explicit authentication can be achieved, without using one of mblowfish Security's 
authentication mechanisms, by creating an Authentication instance and using the code:

	$mbAccount.setAuthentication(anAuthentication);
 
Note that unless the Authentication has the authenticated property set to true, it will still 
be authenticated by any security interceptor (for method or web invocations) which encounters it.

In most cases, the framework transparently takes care of managing the security context and 
authentication objects for you..

 */
mblowfish.factory('MbAuthentication', function() {

	/**
	Creates new instance of event
		
	@generator
	@memberof MbAuthentication
	@params {Objct} data To bind as initial data
	 */
	function MbAuthentication(data) {
		angular.extend(this, _.assign({
			credentials: {},
			details: {},
			principal: {},
			authenticated: false,
		}, data));
	};


	/**
	@memberof MbAuthentication
	@name getAuthorities
	Set by an AuthenticationProvider to indicate the authorities that the principal has been granted. Note 
	that classes should not rely on this value as being valid unless it has been set by a trusted 
	AuthenticationProvider.
	
	Implementations should ensure that modifications to the returned collection do not affect the state 
	of the Authentication object, or use an unmodifiable instance.

	@returns {Object} the authorities granted to the principal, or an empty collection if the 
		token has not been authenticated. Never null.
 	*/
	MbAuthentication.prototype.getAuthorities = function() {
		return credentials;
	};

	/**
	@name getCredentials
	@memberof MbAuthentication
	
	The credentials that prove the principal is correct. This is usually a password, but could be anything 
	relevant to the AuthenticationProvider. Callers are expected to populate the credentials.

	@returns {Object} the credentials that prove the identity of the Principal
	 */
	MbAuthentication.prototype.getCredentials = function() {
		return credentials;
	};

	/**
	@name getDetails
	@memberof MbAuthentication
	
	Stores additional details about the authentication request. These might be an IP address,
	certificate serial number etc.

	@returns {Object} additional details about the authentication request, or null if not used
	 */
	MbAuthentication.prototype.getDetails = function() {
		return details;
	};


	/**
	@name getPrincipal
	@memberof MbAuthentication
	
	The identity of the principal being authenticated. In the case of an authentication request with
	username and password, this would be the username. Callers are expected to populate the principal
	for an authentication request.
	
	The AuthenticationProvider implementation will often return an Authentication containing richer 
	information as the principal for use by the application. Many of the authentication providers 
	will create a UserDetails object as the principal.
	
	@returns {Object} the Principal being authenticated or the authenticated principal after authentication.
	 */
	MbAuthentication.prototype.getPrincipal = function() {
		return principal;
	};

	/**
	@name isAuthenticated
	@memberof MbAuthentication
	
	Used to indicate to AbstractSecurityInterceptor whether it should present the authentication token 
	to the AuthenticationProvider. Typically an AuthenticationProvider  will return an immutable authentication 
	token after successful authentication, in which case that token can safely return true to this method. 
	Returning true will improve performance, as calling the AuthenticationProvider for every request will 
	no longer be necessary.
	
	For security reasons, implementations of this interface should be very careful about returning true from
	this method unless they are either immutable, or have some way of ensuring the properties have not been
	changed since original creation.

	@returns true if the token has been authenticated and the AbstractSecurityInterceptor does not 
		need to present the token to the AuthenticationProvider again for re-authentication.
	 */
	MbAuthentication.prototype.isAuthenticated = function(authenticated) {
		this.authenticated = authenticated;
	};


	/**
	@name setAuthenticated
	@throws {IllegalArgumentException} if an attempt to make the authentication token trusted is rejected due 
		to the implementation being immutable or implementing its own alternative approach to isAuthenticated()
	@see MbAuthentication#isAuthenticated()
	
	Implementations should always allow this method to be called with a false parameter, as this is used 
	by various classes to specify the authentication token should not be trusted. If an implementation
	wishes to reject an invocation with a true parameter (which would indicate the authentication token 
	is trusted - a potential security risk) the implementation should throw an IllegalArgumentException.

	@param {boolean} isAuthenticated - true if the token should be trusted (which may result in an exception) 
		or false if the token should not be trusted
	 */
	MbAuthentication.prototype.setAuthenticated = function() {
		return this.authenticated;
	};


	return MbAuthentication;
});
