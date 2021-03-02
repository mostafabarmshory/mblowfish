/**
 * @ngdoc directive
 * @name mbColors
 * @module material.components.colors
 *
 * @restrict A
 *
 * @description
 * `mbColors` directive will apply the theme-based color expression as RGBA CSS style values.
 *
 *   The format will be similar to the colors defined in the Sass files:
 *
 *   ## `[?theme]-[palette]-[?hue]-[?opacity]`
 *   - [theme]    - default value is the default theme
 *   - [palette]  - can be either palette name or primary/accent/warn/background
 *   - [hue]      - default is 500 (hue-x can be used with primary/accent/warn/background)
 *   - [opacity]  - default is 1
 *
 *
 *   > `?` indicates optional parameter
 *
 * @usage
 * <hljs lang="html">
 *   <div mb-colors="{background: 'myTheme-accent-900-0.43'}">
 *     <div mb-colors="{color: 'red-A100', 'border-color': 'primary-600'}">
 *       <span>Color demo</span>
 *     </div>
 *   </div>
 * </hljs>
 *
 * The `mbColors` directive will automatically watch for changes in the expression if it recognizes
 * an interpolation expression or a function. For performance options, you can use `::` prefix to
 * the `mb-colors` expression to indicate a one-time data binding.
 *
 * <hljs lang="html">
 *   <md-card mb-colors="::{background: '{{theme}}-primary-700'}">
 *   </md-card>
 * </hljs>

@ngInject
 */
export default  function($mbColors, $mdUtil, $log, $parse) {
	var STATIC_COLOR_EXPRESSION = /^{((\s|,)*?["'a-zA-Z-]+?\s*?:\s*?('|")[a-zA-Z0-9-.]*('|"))+\s*}$/;
	return {
		restrict: 'A',
		require: ['^?mdTheme'],
		compile: function(tElem, tAttrs) {
			var shouldWatch = shouldColorsWatch();

			return function(scope, element, attrs, ctrl) {
				var mdThemeController = ctrl[0];

				var lastColors = {};

				/**
				 * @param {string=} theme
				 * @return {Object} colors found in the specified theme
				 */
				var parseColors = function(theme) {
					if (typeof theme !== 'string') {
						theme = '';
					}

					if (!attrs.mbColors) {
						attrs.mbColors = '{}';
					}

					/**
					 * Json.parse() does not work because the keys are not quoted;
					 * use $parse to convert to a hash map
					 */
					var colors = $parse(attrs.mbColors)(scope);

					/**
					 * If mdTheme is defined higher up the DOM tree,
					 * we add mdTheme's theme to the colors which don't specify a theme.
					 *
					 * @example
					 * <hljs lang="html">
					 *   <div md-theme="myTheme">
					 *     <div mb-colors="{background: 'primary-600'}">
					 *       <span mb-colors="{background: 'mySecondTheme-accent-200'}">Color demo</span>
					 *     </div>
					 *   </div>
					 * </hljs>
					 *
					 * 'primary-600' will be changed to 'myTheme-primary-600',
					 * but 'mySecondTheme-accent-200' will not be changed since it has a theme defined.
					 */
					if (mdThemeController) {
						Object.keys(colors).forEach(function(prop) {
							var color = colors[prop];
							if (!$mbColors.hasTheme(color)) {
								colors[prop] = (theme || mdThemeController.$mdTheme) + '-' + color;
							}
						});
					}

					cleanElement(colors);

					return colors;
				};

				/**
				 * @param {Object} colors
				 */
				var cleanElement = function(colors) {
					if (!angular.equals(colors, lastColors)) {
						var keys = Object.keys(lastColors);

						if (lastColors.background && !keys.color) {
							keys.push('color');
						}

						keys.forEach(function(key) {
							element.css(key, '');
						});
					}

					lastColors = colors;
				};

				/**
				 * Registering for mgTheme changes and asking mdTheme controller run our callback whenever
				 * a theme changes.
				 */
				var unregisterChanges = angular.noop;

				if (mdThemeController) {
					unregisterChanges = mdThemeController.registerChanges(function(theme) {
						$mbColors.applyThemeColors(element, parseColors(theme));
					});
				}

				scope.$on('$destroy', function() {
					unregisterChanges();
				});

				try {
					if (shouldWatch) {
						scope.$watch(parseColors, angular.bind(this,
							$mbColors.applyThemeColors, element
						), true);
					}
					else {
						$mbColors.applyThemeColors(element, parseColors());
					}

				}
				catch (e) {
					$log.error(e.message);
				}

			};

			/**
			 * @return {boolean}
			 */
			function shouldColorsWatch() {
				// Simulate 1x binding and mark mbColorsWatch == false
				var rawColorExpression = tAttrs.mbColors;
				var bindOnce = rawColorExpression.indexOf('::') > -1;
				var isStatic = bindOnce ? true : STATIC_COLOR_EXPRESSION.test(tAttrs.mbColors);

				// Remove it for the postLink...
				tAttrs.mbColors = rawColorExpression.replace('::', '');

				var hasWatchAttr = angular.isDefined(tAttrs.mbColorsWatch);

				return (bindOnce || isStatic) ? false :
					hasWatchAttr ? $mdUtil.parseAttributeBoolean(tAttrs.mbColorsWatch) : true;
			}
		}
	};
}



