



/**
 @ngdoc object
 @name $mbTranslateSanitization
 @requires $injector
 @requires $mbLog
	
 @description
 Sanitizes interpolation parameters and translated texts.
	
	
	
 There are many sanitization method and you are free to add a new one. 
Following strategies are built-in:

 <dl>
   <dt>sanitize</dt><dd>Sanitizes HTML in the translation text using $sanitize</dd>
   <dt>escape</dt><dd>Escapes HTML in the translation</dd>
   <dt>sanitizeParameters</dt><dd>Sanitizes HTML in the values of the interpolation parameters using $sanitize</dd>
   <dt>escapeParameters</dt><dd>Escapes HTML in the values of the interpolation parameters</dd>
   <dt>escaped</dt><dd>Support legacy strategy name 'escaped' for backwards compatibility (will be removed in 3.0)</dd>
 </dl>
 */

/**
 Definition of a sanitization strategy function
 @callback StrategyFunction
 @param {string|object} value - value to be sanitized (either a string or an interpolated value map)
 @param {string} mode - either 'text' for a string (translation) or 'params' for the interpolated params
 @return {string|object}
 */

function mbTranslateSanitization() {

	//-------------------------------------------------------------------------
	// Services and factories
	//-------------------------------------------------------------------------
	var provider;
	var service;

	var $sanitize;
	var $sce;
	var $mbLog;


	//-------------------------------------------------------------------------
	// Services and factories
	//-------------------------------------------------------------------------
	// TODO: change to either 'sanitize', 'escape' or ['sanitize', 'escapeParameters'] in 3.0.
	var hasConfiguredStrategy = false;
	var currentStrategy = null;
	var strategies;
	var cachedStrategyMap = {};



	//-------------------------------------------------------------------------
	// Functions
	//-------------------------------------------------------------------------
	strategies = {
		sanitize: function(value, mode/*, context*/) {
			if (mode === 'text') {
				value = htmlSanitizeValue(value);
			}
			return value;
		},
		escape: function(value, mode/*, context*/) {
			if (mode === 'text') {
				value = htmlEscapeValue(value);
			}
			return value;
		},
		sanitizeParameters: function(value, mode/*, context*/) {
			if (mode === 'params') {
				value = mapInterpolationParameters(value, htmlSanitizeValue);
			}
			return value;
		},
		escapeParameters: function(value, mode/*, context*/) {
			if (mode === 'params') {
				value = mapInterpolationParameters(value, htmlEscapeValue);
			}
			return value;
		},
		sce: function(value, mode, context) {
			if (mode === 'text') {
				value = htmlTrustValue(value);
			} else if (mode === 'params') {
				if (context !== 'filter') {
					// do html escape in filter context #1101
					value = mapInterpolationParameters(value, htmlEscapeValue);
				}
			}
			return value;
		},
		sceParameters: function(value, mode/*, context*/) {
			if (mode === 'params') {
				value = mapInterpolationParameters(value, htmlTrustValue);
			}
			return value;
		}
	};

	/*
	Converts a value to map of values
	*/
	function mapInterpolationParameters(value, iteratee, stack) {
		if (angular.isDate(value)) {
			return value;
		} else if (angular.isObject(value)) {
			var result = angular.isArray(value) ? [] : {};

			if (!stack) {
				stack = [];
			} else {
				if (stack.indexOf(value) > -1) {
					throw new Error('$mbTranslateSanitization: Error cannot interpolate parameter due recursive object');
				}
			}

			stack.push(value);
			angular.forEach(value, function(propertyValue, propertyKey) {

				/* Skipping function properties. */
				if (angular.isFunction(propertyValue)) {
					return;
				}

				result[propertyKey] = mapInterpolationParameters(propertyValue, iteratee, stack);
			});
			stack.splice(-1, 1); // remove last

			return result;
		} else if (angular.isNumber(value)) {
			return value;
		} else if (value === true || value === false) {
			return value;
		} else if (!angular.isUndefined(value) && value !== null) {
			return iteratee(value);
		} else {
			return value;
		}
	};

	function htmlEscapeValue(value) {
		var element = angular.element('<div></div>');
		element.text(value); // not chainable, see #1044
		return element.html();
	}

	function htmlSanitizeValue(value) {
		if (!$sanitize) {
			throw new Error('Cannot find $sanitize service.');
		}
		return $sanitize(value);
	}

	function htmlTrustValue(value) {
		if (!$sce) {
			throw new Error('Cannot find $sce service.');
		}
		return $sce.trustAsHtml(value);
	}

	/**
	 @ngdoc function
	 @name addStrategy
	 @methodOf $mbTranslateSanitizationProvider
	
	 @description
	 Adds a sanitization strategy to the list of known strategies.
	
	 @param {string} strategyName - unique key for a strategy
	 @param {StrategyFunction} strategyFunction - strategy function
	 @returns {object} this
	 */
	function addStrategy(strategyName, strategyFunction) {
		strategies[strategyName] = strategyFunction;
		return provider;
	}

	/**
	 @ngdoc function
	 @name $mbTranslateSanitizationProvider#removeStrategy
	 @methodOf $mbTranslateSanitizationProvider
	
	 @description
	 Removes a sanitization strategy from the list of known strategies.
	
	 @param {string} strategyName - unique key for a strategy
	 @returns {object} this
	 */
	function removeStrategy(strategyName) {
		delete strategies[strategyName];
		return provider;
	}

	function useStrategy(strategy) {
		hasConfiguredStrategy = true;
		currentStrategy = strategy;
	}


	/**
	 @ngdoc function
	 @name sanitize
	 @methodOf $mbTranslateSanitization
	
	 @description
	 Sanitizes a value.
	
	 @param {string|object} value The value which should be sanitized.
	 @param {string} mode The current sanitization mode, either 'params' or 'text'.
	 @param {string|StrategyFunction|array} [strategy] Optional custom strategy which should be used instead of the currently selected strategy.
	 @param {string} [context] The context of this call: filter, service. Default is service
	 @returns {string|object} sanitized value
	 */
	function sanitize(value, mode, strategy, context) {
		if (!currentStrategy) {
			$mbLog.warn('No sanitization strategy has been configured.');
			hasShownNoStrategyConfiguredWarning = true;
		}

		if (!strategy && strategy !== null) {
			strategy = currentStrategy;
		}

		if (!strategy) {
			return value;
		}

		if (!context) {
			context = 'service';
		}

		var selectedStrategies = angular.isArray(strategy) ? strategy : [strategy];
		return applyStrategies(value, mode, context, selectedStrategies);
	}


	function applyStrategies(value, mode, context, selectedStrategies) {
		angular.forEach(selectedStrategies, function(selectedStrategy) {
			if (angular.isFunction(selectedStrategy)) {
				value = selectedStrategy(value, mode, context);
			} else if (angular.isFunction(strategies[selectedStrategy])) {
				value = strategies[selectedStrategy](value, mode, context);
			} else if (angular.isString(strategies[selectedStrategy])) {
				if (!cachedStrategyMap[strategies[selectedStrategy]]) {
					try {
						cachedStrategyMap[strategies[selectedStrategy]] = $injector.get(strategies[selectedStrategy]);
					} catch (e) {
						cachedStrategyMap[strategies[selectedStrategy]] = function() { };
						throw new Error('$mbTranslateSanitization: Unknown sanitization strategy: \'' + selectedStrategy + '\'');
					}
				}
				value = cachedStrategyMap[strategies[selectedStrategy]](value, mode, context);
			} else {
				throw new Error('Unknown sanitization strategy: \'' + selectedStrategy + '\'');
			}
		});
		return value;
	}

	//-------------------------------------------------------------------------------------------
	// End
	//-------------------------------------------------------------------------------------------
	service = {
		/**
		@ngdoc function
		@name useStrategy
		@methodOf $mbTranslateSanitization
		
		@description
		Selects a sanitization strategy. When an array is provided the strategies will be executed in order.
		
		@param {string|StrategyFunction|array} strategy The sanitization strategy / strategies which should be used. Either a name of an existing strategy, a custom strategy function, or an array consisting of multiple names and / or custom functions.
		 */
		useStrategy: function() {
			useStrategy(strategy);
			return service;
		},
		sanitize: sanitize,
	};
	provider = {
		$get: function($injector) {
			'ngInject';
			if ($injector.has('$sanitize')) {
				$sanitize = $injector.get('$sanitize');
			}
			if ($injector.has('$sce')) {
				$sce = $injector.get('$sce');
			}
			if ($injector.has('$mbLog')) {
				$mbLog = $injector.get('$mbLog');
			}
			return service;
		},
		addStrategy: addStrategy,
		removeStrategy: removeStrategy,

		/**
		 @ngdoc function
		 @name useStrategy
		 @methodOf $mbTranslateSanitizationProvider
		
		 @description
		 Selects a sanitization strategy. When an array is provided the strategies will be executed in order.
		
		 @param {string|StrategyFunction|array} strategy The sanitization strategy / strategies which should be used. Either a name of an existing strategy, a custom strategy function, or an array consisting of multiple names and / or custom functions.
		 @returns {object} this
		 */
		useStrategy: function(strategy) {
			useStrategy(strategy);
			return provider;
		}
	};
	return provider;
}

export default mbTranslateSanitization;
