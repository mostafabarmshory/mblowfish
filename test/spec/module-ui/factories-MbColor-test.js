describe('Factory MbColor ', function() {
	var MbColor;

	// load the service's module
	beforeEach(module('mblowfish-core'));

	// instantiate service
	beforeEach(inject(function(_MbColor_) {
		MbColor = _MbColor_;
	}));

	it('must be create from RGP', function() {
		var color = new MbColor({
			r: 255,
			g: 0,
			b: 0
		});
		expect(color).not.toBe(null);
		expect(color).not.toBe(undefined);
		expect(color.isValid()).toBe(true);
	});

	it('must be create from RGP with the function directly', function() {
		var color = MbColor({
			r: 255,
			g: 0,
			b: 0
		});
		expect(color).not.toBe(null);
		expect(color).not.toBe(undefined);
		expect(color.isValid()).toBe(true);
	});


	it('must be create from MbColor', function() {
		var colorSrc = new MbColor({
			r: 255,
			g: 0,
			b: 0
		});
		var color = new MbColor(colorSrc);
		expect(color).not.toBe(null);
		expect(color).not.toBe(undefined);
		expect(color.isValid()).toBe(true);
	});


	it('should finds dark colors', function() {
		var darks = [
			{
				r: 0,
				g: 0,
				b: 0
			},
			{
				r: 100,
				g: 100,
				b: 0
			}
		];
		_.forEach(darks, function(darkColor) {
			var color = new MbColor(darkColor);
			expect(color.isDark()).toBe(true);
			expect(color.isLight()).toBe(false);
		});

		var bri = [
			{
				r: 255,
				g: 255,
				b: 255
			},
			{
				r: 180,
				g: 180,
				b: 0
			}
		];
		_.forEach(bri, function(briColor) {
			var color = new MbColor(briColor);
			expect(color.isDark()).toBe(false);
			expect(color.isLight()).toBe(true);
		});
	});


	it('should supports css colors', function() {
		var cssColors = [
			'#ffffff',
			'ffffff',
			'#ff000000',
			'rgb (255, 0, 0)',
			'rgb 255 0 0',
			'rgba (255, 0, 0, 1)',
			'rgba 255, 0, 0, 1',
			'hsl(0, 100%, 50%)',
			'hsl 0 100% 50%',
			'hsla(0, 100%, 50%, 1)',
			'hsla 0 100% 50%, 1',
			'hsv(0, 100%, 100%)',
			'hsv 0 100% 100%'
		];
		_.forEach(cssColors, function(cssColor) {
			var color = new MbColor(cssColor);
			expect(color.isValid()).toBe(true);
			expect(color.getOriginalInput()).toBe(cssColor);
		});
	});




	it('should supports css colors', function() {
		var cssColors = [
			'red',
			'#ffffff',
			'ffffff',
			'#ff000000',
			'rgb (255, 0, 0)',
			'rgb 255 0 0',
			'rgba (255, 0, 0, 1)',
			'rgba 255, 0, 0, 1',
			'rgba 255, 0, 0, 1',
			'hsl(0, 100%, 50%)',
			'hsl 0 100% 50%',
			'hsla(0, 100%, 50%, 1)',
			'hsla 0 100% 50%, 1',
			'hsv(0, 100%, 100%)',
			'hsv 0 100% 100%'
		];
		var formats = [
			'rgb',
			'prgb',
			'hex',
			'hex3',
			'hex4',
			'hex8',
			'name',
			'hsl',
			'hsv'
		];
		_.forEach(formats, function(format) {
			_.forEach(cssColors, function(cssColor) {
				var formattedString;
				var color = new MbColor(cssColor, {
					format: format
				});
				if (format === "rgb") {
					formattedString = color.toRgbString();
				}
				if (format === "prgb") {
					formattedString = color.toPercentageRgbString();
				}
				if (format === "hex" || format === "hex6") {
					formattedString = color.toHexString();
				}
				if (format === "hex3") {
					formattedString = color.toHexString(true);
				}
				if (format === "hex4") {
					formattedString = color.toHex8String(true);
				}
				if (format === "hex8") {
					formattedString = color.toHex8String();
				}
				if (format === "name") {
					formattedString = color.toName();
				}
				if (format === "hsl") {
					formattedString = color.toHslString();
				}
				if (format === "hsv") {
					formattedString = color.toHsvString();
				}
				expect(color.isValid()).toBe(true);
				expect(color.getFormat()).toBe(format);
				expect(color.toString(format)).toBe(formattedString);

			});
		});
	});
});
