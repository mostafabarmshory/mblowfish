describe('Service $mbIcon', function() {
	var $mbIcon;

	// load the service's module
	beforeEach(module('mblowfish-core'));

	// instantiate service
	beforeEach(inject(function(_$mbIcon_) {
		$mbIcon = _$mbIcon_;
	}));

	it('must implements the API', function() {
		expect(angular.isFunction($mbIcon.getShape)).toBe(true);
		expect(angular.isFunction($mbIcon.getShapes)).toBe(true);
		expect(angular.isFunction($mbIcon.getViewBox)).toBe(true);
		expect(angular.isFunction($mbIcon.getViewBoxes)).toBe(true);
		expect(angular.isFunction($mbIcon.getSize)).toBe(true);
		expect(angular.isFunction($mbIcon.setShape)).toBe(true);
		expect(angular.isFunction($mbIcon.setShapes)).toBe(true);
		expect(angular.isFunction($mbIcon.setViewBox)).toBe(true);
		expect(angular.isFunction($mbIcon.setViewBoxes)).toBe(true);
		expect(angular.isFunction($mbIcon.setSize)).toBe(true);
		expect(angular.isFunction($mbIcon.addShape)).toBe(true);
		expect(angular.isFunction($mbIcon.addShapes)).toBe(true);
		expect(angular.isFunction($mbIcon.addViewBox)).toBe(true);
		expect(angular.isFunction($mbIcon.addViewBoxes)).toBe(true);
	});

});
