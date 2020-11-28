describe('Service $mbColors', function() {
	var $mbColors;

	// load the service's module
	beforeEach(module('mblowfish-core'));

	// instantiate service
	beforeEach(inject(function(_$mbColors_) {
		$mbColors = _$mbColors_;
	}));

	it('must implements the API', function() {
		expect(angular.isFunction($mbColors.applyThemeColors)).toBe(true);
		expect(angular.isFunction($mbColors.getThemeColor)).toBe(true);
		expect(angular.isFunction($mbColors.hasTheme)).toBe(true);
	});

});
