
mblowfish.factory('DemoMemoryAuthenticationProvider', function($q, MbAuthenticationProvider, MbAuthentication) {

	var accounts = {
		admin: {
			principal: ['tenant.owner', 'demo.manager'],
			password: 'admin',
			title: 'Demo Admin',
			profile: {
				first_name: 'Demo',
				last_name: 'Admin'
			}
		}
	};

	DemoMemoryAuthenticationProvider = function() {
		MbAuthenticationProvider.apply(this, arguments);
	}
	DemoMemoryAuthenticationProvider.prototype = Object.create(MbAuthenticationProvider.prototype);

	DemoMemoryAuthenticationProvider.prototype.supports = function(auth) {
		return auth && auth.login && auth.password;
	};

	DemoMemoryAuthenticationProvider.prototype.authenticate = function(auth) {
		var detail = accounts[auth.login];
		if (!detail) {
			return $q.reject(new MbAuthentication({
				message: 'Account not found'
			}));
		}
		if (auth.password != detail.password) {
			return $q.reject(new MbAuthentication({
				message: 'Bad cridential'
			}));
		}
		return $q.resolve(new MbAuthentication({
			credentials: auth,
			details: detail,
			principal: detail.principal,
			authenticated: true,
		}));
	};


	DemoMemoryAuthenticationProvider.prototype.forget = function() {
		return $q.resolve(new MbAuthentication());
	};


	return DemoMemoryAuthenticationProvider;


})