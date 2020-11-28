describe('Factory MbColorGradientCanvas ', function() {
	var MbColorGradientCanvas;

	// load the service's module
	beforeEach(module('mblowfish-core'));

	// instantiate service
	beforeEach(inject(function(_MbColorGradientCanvas_) {
		MbColorGradientCanvas = _MbColorGradientCanvas_;
	}));

	it('must be create from RGP', function() {
		var color = new MbColorGradientCanvas('hue');
		expect(color).not.toBe(null);
		expect(color).not.toBe(undefined);
	});
});
