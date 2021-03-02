
/**
@ngdoc service
@name $mbColors
@module ui

@description
By default, defining a theme does not make its colors available for applying to non AngularJS
Material elements. The `$mbColors` service is used by the `mb-color` directive to convert a
set of color expressions to RGBA values and then apply those values to the element as CSS
property values.

@usage
Getting a color based on a theme

 <hljs lang="js">
   angular.controller('myCtrl', function ($mbColors) {
     var color = $mbColors.getThemeColor('myTheme-primary-900-0.5');
     ...
   });
 </hljs>

Applying a color from a palette to an element
<hljs lang="js">
  app.directive('myDirective', function($mbColors) {
    return {
      ...
      link: function (scope, elem) {
        $mbColors.applyThemeColors(elem, {color: 'red-A200-0.2'});
      }
   }
  });
</hljs>


@ngInject
 */
function mbColors($mdTheming, $mdUtil, $log) {
	var colorPalettes = null;
	colorPalettes = colorPalettes || Object.keys($mdTheming.PALETTES);

	// Publish service instance
	return {
		applyThemeColors: applyThemeColors,
		getThemeColor: getThemeColor,
		hasTheme: hasTheme
	};

	// ********************************************
	// Internal Methods
	// ********************************************

    /**
     * @ngdoc method
     * @name $mbColors#applyThemeColors
     *
     * @description
     * Lookup a set of colors by hue, theme, and palette, then apply those colors
     * with the provided opacity (via `rgba()`) to the specified CSS property.
     *
     * @param {angular.element} element the element to apply the styles to
     * @param {Object} colorExpression Keys are CSS properties and values are strings representing
     * the `theme-palette-hue-opacity` of the desired color. For example:
     * `{'color': 'red-A200-0.3', 'background-color': 'myTheme-primary-700-0.8'}`. Theme, hue, and
     * opacity are optional.
     */
	function applyThemeColors(element, colorExpression) {
		try {
			if (colorExpression) {
				// Assign the calculate RGBA color values directly as inline CSS
				element.css(interpolateColors(colorExpression));
			}
		} catch (e) {
			$log.error(e.message);
		}
	}

    /**
     * @ngdoc method
     * @name $mbColors#getThemeColor
     *
     * @description
     * Get a parsed RGBA color using a string representing the `theme-palette-hue-opacity` of the
     * desired color.
     *
     * @param {string} expression color expression like `'red-A200-0.3'` or
     *  `'myTheme-primary-700-0.8'`. Theme, hue, and opacity are optional.
     * @returns {string} a CSS color value like `rgba(211, 47, 47, 0.8)`
     */
	function getThemeColor(expression) {
		var color = extractColorOptions(expression);

		return parseColor(color);
	}

    /**
     * Return the parsed color
     * @param {{hue: *, theme: any, palette: *, opacity: (*|string|number)}} color hash map of color
     *  definitions
     * @param {boolean=} contrast whether use contrast color for foreground. Defaults to false.
     * @returns {string} rgba color string
     */
	function parseColor(color, contrast) {
		contrast = contrast || false;
		var rgbValues = $mdTheming.PALETTES[color.palette][color.hue];

		rgbValues = contrast ? rgbValues.contrast : rgbValues.value;

		return $mdUtil.supplant('rgba({0}, {1}, {2}, {3})',
			[rgbValues[0], rgbValues[1], rgbValues[2], rgbValues[3] || color.opacity]
		);
	}

    /**
     * Convert the color expression into an object with scope-interpolated values
     * Then calculate the rgba() values based on the theme color parts
     * @param {Object} themeColors json object, keys are css properties and values are string of
     * the wanted color, for example: `{color: 'red-A200-0.3'}`.
     * @return {Object} Hashmap of CSS properties with associated `rgba()` string values
     */
	function interpolateColors(themeColors) {
		var rgbColors = {};

		var hasColorProperty = themeColors.hasOwnProperty('color');

		angular.forEach(themeColors, function(value, key) {
			var color = extractColorOptions(value);
			var hasBackground = key.indexOf('background') > -1;

			rgbColors[key] = parseColor(color);
			if (hasBackground && !hasColorProperty) {
				rgbColors.color = parseColor(color, true);
			}
		});

		return rgbColors;
	}

    /**
     * Check if expression has defined theme
     * For instance:
     *   'myTheme-primary' => true
     *   'red-800' => false
     * @param {string} expression color expression like 'red-800', 'red-A200-0.3',
     *   'myTheme-primary', or 'myTheme-primary-400'
     * @return {boolean} true if the expression has a theme part, false otherwise.
     */
	function hasTheme(expression) {
		return angular.isDefined($mdTheming.THEMES[expression.split('-')[0]]);
	}

    /**
     * For the evaluated expression, extract the color parts into a hash map
     * @param {string} expression color expression like 'red-800', 'red-A200-0.3',
     *   'myTheme-primary', or 'myTheme-primary-400'
     * @returns {{hue: *, theme: any, palette: *, opacity: (*|string|number)}}
     */
	function extractColorOptions(expression) {
		var parts = expression.split('-');
		var hasTheme = angular.isDefined($mdTheming.THEMES[parts[0]]);
		var theme = hasTheme ? parts.splice(0, 1)[0] : $mdTheming.defaultTheme();

		return {
			theme: theme,
			palette: extractPalette(parts, theme),
			hue: extractHue(parts, theme),
			opacity: parts[2] || 1
		};
	}

    /**
     * Calculate the theme palette name
     * @param {Array} parts
     * @param {string} theme name
     * @return {string}
     */
	function extractPalette(parts, theme) {
		// If the next section is one of the palettes we assume it's a two word palette
		// Two word palette can be also written in camelCase, forming camelCase to dash-case

		var isTwoWord = parts.length > 1 && colorPalettes.indexOf(parts[1]) !== -1;
		var palette = parts[0].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

		if (isTwoWord) palette = parts[0] + '-' + parts.splice(1, 1);

		if (colorPalettes.indexOf(palette) === -1) {
			// If the palette is not in the palette list it's one of primary/accent/warn/background
			var scheme = $mdTheming.THEMES[theme].colors[palette];
			if (!scheme) {
				throw new Error($mdUtil.supplant(
					'mbColors: couldn\'t find \'{palette}\' in the palettes.',
					{ palette: palette }));
			}
			palette = scheme.name;
		}

		return palette;
	}

    /**
     * @param {Array} parts
     * @param {string} theme name
     * @return {*}
     */
	function extractHue(parts, theme) {
		var themeColors = $mdTheming.THEMES[theme].colors;

		if (parts[1] === 'hue') {
			var hueNumber = parseInt(parts.splice(2, 1)[0], 10);

			if (hueNumber < 1 || hueNumber > 3) {
				throw new Error($mdUtil.supplant(
					'mbColors: \'hue-{hueNumber}\' is not a valid hue, can be only \'hue-1\', \'hue-2\' and \'hue-3\'',
					{ hueNumber: hueNumber }));
			}
			parts[1] = 'hue-' + hueNumber;

			if (!(parts[0] in themeColors)) {
				throw new Error($mdUtil.supplant(
					'mbColors: \'hue-x\' can only be used with [{availableThemes}], but was used with \'{usedTheme}\'',
					{
						availableThemes: Object.keys(themeColors).join(', '),
						usedTheme: parts[0]
					}));
			}

			return themeColors[parts[0]].hues[parts[1]];
		}

		return parts[1] || themeColors[parts[0] in themeColors ? parts[0] : 'primary'].hues['default'];
	}
}


export default mbColors;