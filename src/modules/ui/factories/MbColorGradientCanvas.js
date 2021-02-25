mblowfish.factory('MbColorGradientCanvas', function() {

	var canvasTypes = {
		hue: {
			getColorByPoint: function(x, y) {
				var imageData = this.getImageData(x, y);
				this.setMarkerCenter(y);

				var hsl = new MbColor({ r: imageData[0], g: imageData[1], b: imageData[2] });
				return hsl.toHsl().h;
			},
			draw: function() {
				this.$element.css({ 'height': this.height + 'px' });

				this.canvas.height = this.height;
				this.canvas.width = this.height;

				// Create gradient
				var hueGrd = this.context.createLinearGradient(90, 0.000, 90, this.height);

				// Add colors
				hueGrd.addColorStop(0.01, 'rgba(255, 0, 0, 1.000)');
				hueGrd.addColorStop(0.167, 'rgba(255, 0, 255, 1.000)');
				hueGrd.addColorStop(0.333, 'rgba(0, 0, 255, 1.000)');
				hueGrd.addColorStop(0.500, 'rgba(0, 255, 255, 1.000)');
				hueGrd.addColorStop(0.666, 'rgba(0, 255, 0, 1.000)');
				hueGrd.addColorStop(0.828, 'rgba(255, 255, 0, 1.000)');
				hueGrd.addColorStop(0.999, 'rgba(255, 0, 0, 1.000)');

				// Fill with gradient
				this.context.fillStyle = hueGrd;
				this.context.fillRect(0, 0, this.canvas.width, this.height);
			}
		},
		alpha: {
			getColorByPoint: function(x, y) {
				var imageData = this.getImageData(x, y);
				this.setMarkerCenter(y);

				return imageData[3] / 255;
			},
			draw: function() {
				this.$element.css({ 'height': this.height + 'px' });

				this.canvas.height = this.height;
				this.canvas.width = this.height;

				// Create gradient
				var hueGrd = this.context.createLinearGradient(90, 0.000, 90, this.height);

				// Add colors
				hueGrd.addColorStop(0.01, 'rgba(' + this.currentColor.r + ',' + this.currentColor.g + ',' + this.currentColor.b + ', 1.000)');
				hueGrd.addColorStop(0.99, 'rgba(' + this.currentColor.r + ',' + this.currentColor.g + ',' + this.currentColor.b + ', 0.000)');

				// Fill with gradient
				this.context.fillStyle = hueGrd;
				this.context.fillRect(-1, -1, this.canvas.width + 2, this.height + 2);
			},
			extra: function() {
				this.$scope.$on('mbColorPicker:spectrumColorChange', angular.bind(this, function(e, args) {
					this.currentColor = args.color;
					this.draw();
				}));
			}
		},
		spectrum: {
			getColorByPoint: function(x, y) {

				var imageData = this.getImageData(x, y);
				this.setMarkerCenter(x, y);

				return {
					r: imageData[0],
					g: imageData[1],
					b: imageData[2]
				};
			},
			draw: function() {
				this.canvas.height = this.height;
				this.canvas.width = this.height;
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

				// Odd bug prevented selecting min, max ranges from all gradients.
				// Start at 0.01, end at 0.99 and stretch it to 1px larger in each direction

				// White gradient
				var whiteGrd = this.context.createLinearGradient(0, 0, this.canvas.width, 0);


				whiteGrd.addColorStop(0.01, 'rgba(255, 255, 255, 1.000)');
				whiteGrd.addColorStop(0.99, 'rgba(255, 255, 255, 0.000)');

				// Black Gradient
				var blackGrd = this.context.createLinearGradient(0, 0, 0, this.canvas.height);


				blackGrd.addColorStop(0.01, 'rgba(0, 0, 0, 0.000)');
				blackGrd.addColorStop(0.99, 'rgba(0, 0, 0, 1.000)');

				// Fill with solid
				this.context.fillStyle = 'hsl( ' + this.currentHue + ', 100%, 50%)';
				this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

				// Fill with white
				// Odd bug prevented selecting min, max ranges from all gradients
				this.context.fillStyle = whiteGrd;
				this.context.fillRect(-1, -1, this.canvas.width + 2, this.canvas.height + 2);

				// Fill with black
				// Odd bug prevented selecting min, max ranges from all gradients
				this.context.fillStyle = blackGrd;
				this.context.fillRect(-1, -1, this.canvas.width + 2, this.canvas.height + 2);
			},
			extra: function() {
				this.$scope.$on('mbColorPicker:spectrumHueChange', angular.bind(this, function(e, args) {
					this.currentHue = args.hue;
					this.draw();
					var markerPos = this.getMarkerCenter();
					var color = this.getColorByPoint(markerPos.x, markerPos.y);
					this.setColor(color);

				}));
			}
		}

	};


	function GradientCanvas(type, restrictX) {

		this.type = type;
		this.restrictX = restrictX;
		this.offset = {
			x: null,
			y: null
		};
		this.height = 255;

		this.$scope = null;
		this.$element = null;

		this.get = angular.bind(this, function($temp_scope, $temp_element/*, $temp_attrs*/) {
			////////////////////////////
			// Variables
			////////////////////////////

			this.$scope = $temp_scope;
			this.$element = $temp_element;


			this.canvas = this.$element.children()[0];
			this.marker = this.$element.children()[1];
			this.context = this.canvas.getContext('2d');
			this.currentColor = this.$scope.color.toRgb();
			this.currentHue = this.$scope.color.toHsv().h;
			////////////////////////////
			// Watchers, Observes, Events
			////////////////////////////

			//$scope.$watch( function() { return color.getRgb(); }, hslObserver, true );


			this.$element.on('touchstart mousedown', angular.bind(this, this.onMouseDown));
			this.$scope.$on('mbColorPicker:colorSet', angular.bind(this, this.onColorSet));
			if (this.extra) {
				this.extra();
			}
			////////////////////////////
			// init
			////////////////////////////

			this.draw();
		});

		//return angular.bind( this, this.get );

	}

	GradientCanvas.prototype.$window = angular.element(window);

	GradientCanvas.prototype.getColorByMouse = function(e) {

		var te = e.touches && e.touches[0];

		var pageX = te && te.pageX || e.pageX;
		var pageY = te && te.pageY || e.pageY;

		var x = Math.round(pageX - this.offset.x);
		var y = Math.round(pageY - this.offset.y);

		return this.getColorByPoint(x, y);
	};

	GradientCanvas.prototype.setMarkerCenter = function(x, y) {
		var xOffset = -1 * this.marker.offsetWidth / 2;
		var yOffset = -1 * this.marker.offsetHeight / 2;
		var xAdjusted, xFinal, yAdjusted, yFinal;

		if (y === undefined) {
			yAdjusted = x + yOffset;
			yFinal = Math.round(Math.max(Math.min(this.height - 1 + yOffset, yAdjusted), yOffset));

			xFinal = 0;
		} else {
			xAdjusted = x + xOffset;
			yAdjusted = y + yOffset;

			xFinal = Math.floor(Math.max(Math.min(this.height + xOffset, xAdjusted), xOffset));
			yFinal = Math.floor(Math.max(Math.min(this.height + yOffset, yAdjusted), yOffset));
			// Debug output
			// console.log( "Raw: ", x+','+y, "Adjusted: ", xAdjusted + ',' + yAdjusted, "Final: ", xFinal + ',' + yFinal );
		}



		angular.element(this.marker).css({ 'left': xFinal + 'px' });
		angular.element(this.marker).css({ 'top': yFinal + 'px' });
	};

	GradientCanvas.prototype.getMarkerCenter = function() {
		var returnObj = {
			x: this.marker.offsetLeft + (Math.floor(this.marker.offsetWidth / 2)),
			y: this.marker.offsetTop + (Math.floor(this.marker.offsetHeight / 2))
		};
		return returnObj;
	};

	GradientCanvas.prototype.getImageData = function(x, y) {
		x = Math.max(0, Math.min(x, this.canvas.width - 1));
		y = Math.max(0, Math.min(y, this.canvas.height - 1));

		var imageData = this.context.getImageData(x, y, 1, 1).data;
		return imageData;
	};

	GradientCanvas.prototype.onMouseDown = function(e) {
		// Prevent highlighting
		e.preventDefault();
		e.stopImmediatePropagation();

		this.$scope.previewUnfocus();

		this.$element.css({ 'cursor': 'none' });

		this.offset.x = this.canvas.getBoundingClientRect().left;
		this.offset.y = this.canvas.getBoundingClientRect().top;

		var fn = angular.bind(this, function(e) {
			switch (this.type) {
				case 'hue':
					var hue = this.getColorByMouse(e);
					this.$scope.$broadcast('mbColorPicker:spectrumHueChange', { hue: hue });
					break;
				case 'alpha':
					var alpha = this.getColorByMouse(e);
					this.$scope.color.setAlpha(alpha);
					this.$scope.alpha = alpha;
					this.$scope.$apply();
					break;
				case 'spectrum':
					var color = this.getColorByMouse(e);
					this.setColor(color);
					break;
			}
		});

		this.$window.on('touchmove mousemove', fn);
		this.$window.one('touchend mouseup', angular.bind(this, function(/*e*/) {
			this.$window.off('touchmove mousemove', fn);
			this.$element.css({ 'cursor': 'crosshair' });
		}));

		// Set the color
		fn(e);
	};

	GradientCanvas.prototype.setColor = function(color) {

		this.$scope.color._r = color.r;
		this.$scope.color._g = color.g;
		this.$scope.color._b = color.b;
		this.$scope.$apply();
		this.$scope.$broadcast('mbColorPicker:spectrumColorChange', { color: color });
	};

	GradientCanvas.prototype.onColorSet = function(e, args) {
		var hsv;
		switch (this.type) {
			case 'hue': {
				hsv = this.$scope.color.toHsv();
				this.setMarkerCenter(this.canvas.height - (this.canvas.height * (hsv.h / 360)));
				break;
			}
			case 'alpha': {
				this.currentColor = args.color.toRgb();
				this.draw();

				var alpha = args.color.getAlpha();
				var pos = this.canvas.height - (this.canvas.height * alpha);

				this.setMarkerCenter(pos);
				break;
			}
			case 'spectrum': {
				hsv = args.color.toHsv();
				this.currentHue = hsv.h;
				this.draw();

				var posX = this.canvas.width * hsv.s;
				var posY = this.canvas.height - (this.canvas.height * hsv.v);

				this.setMarkerCenter(posX, posY);
				break;
			}
		}

	};





	return function gradientCanvas(type) {
		var canvas = new GradientCanvas(type, type !== 'spectrum');
		canvas = angular.merge(canvas, canvasTypes[type]);
		return {
			template: '<canvas width="100%" height="100%"></canvas><div class="mb-color-picker-marker"></div>',
			link: canvas.get,
			controller: function() {
				//	console.log( "mbColorPickerAlpha Controller", Date.now() - dateClick );
			}
		};
	};
});