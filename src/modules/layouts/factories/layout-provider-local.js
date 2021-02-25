
mblowfish.factory('MbLayoutsLayoutProviderLocal', function(MbLayoutProvider, $mbLayoutsLocalStorage) {

	Provider = function() {
		MbLayoutProvider.apply(this, arguments);
	}
	Provider.prototype = Object.create(MbLayoutProvider.prototype);

	Provider.prototype.list = function() {
		return $mbLayoutsLocalStorage.getLayouts();
	};

	Provider.prototype.has = function(name) {
		return $mbLayoutsLocalStorage.hasLayout(name);
	};

	Provider.prototype.get = function(name) {
		return $mbLayoutsLocalStorage.getLayout(name);
	};

	return Provider;
});