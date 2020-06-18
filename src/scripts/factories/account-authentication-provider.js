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
Indicates a class can process a specific Authentication implementation.

One of the fundamental ways to secure a resource is to make sure that the caller is who 
they claim to be. This process of checking credentials and making sure that they are 
genuine is called authentication.

 */
mblowfish.factory('MbAuthenticationProvider', function($q, MbAuthentication) {

	/**
	Creates new instance of provider
		
	@generator
	@memberof MbAuthenticationProvider
	@params {Objct} data To bind as initial data
	 */
	function MbAuthenticationProvider() { };

	/**
	@name authenticate
	@memberof MbAuthenticationProvider
	
	Performs authentication with the same contract as $mbAccount.login(Authentication) .
	
	@param {Object} authentication - the authentication request object.
	@returns {Promise} a fully authenticated object including credentials. May return
		null if the AuthenticationProvider is unable to support authentication of the 
		passed Authentication object. In such a case, the next AuthenticationProvider 
		that supports the presented Authentication class will be tried.
	@throws {AuthenticationException} if authentication fails.
	 */
	MbAuthenticationProvider.prototype.authenticate = function(authentication) {
		return $q.resolve(new MbAuthentication(authentication));
	};

	/**
	@name supports(authentication)
	
	Returns true if this AuthenticationProvider supports the indicated Authentication object.
	
	Returning true does not guarantee an AuthenticationProvider will be able to authenticate 
	the presented instance of the Authentication class. It simply indicates it can support closer 
	evaluation of it. An AuthenticationProvider can still return null from the authenticate(Authentication) 
	method to indicate another AuthenticationProvider should be tried.

	Selection of an AuthenticationProvider capable of performing authentication is conducted 
	at runtime the ProviderManager.

	@param {Object} authentication information from view
	@returns {boolean} true if the implementation can more closely evaluate the 
		Authentication class presented
	
	 */
	MbAuthenticationProvider.prototype.supports = function(authentication) {
		return authentication && false;
	};


	/**
	@name forget
	@memberof MbAuthenticationProvider
	
	Removes authentication with the same contract as authenticate(Authentication) .
	
	@param {Object} authentication - the authentication request object.
	@returns {Promise} a fully authenticated object including empty credentials.
	@throws {AuthenticationException} if forget fails.
	 */
	MbAuthenticationProvider.prototype.forget = function(authentication) {
		return $q.resolve(new MbAuthentication(authentication));
	};


	return MbAuthenticationProvider;
});
