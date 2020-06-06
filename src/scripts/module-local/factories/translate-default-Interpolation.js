
/**
@ngdoc object
@name $mbTranslateDefaultInterpolation
@requires $interpolate

@description
Uses angular's `$interpolate` services to interpolate strings against some values.

Be aware to configure a proper sanitization strategy.

See also:
* {@link $mbTranslateSanitization}

@return {object} $mbTranslateDefaultInterpolation Interpolator service
 */
mblowfish.factory('$mbTranslateDefaultInterpolation', function($interpolate, $mbTranslateSanitization) {

	var $mbTranslateInterpolator = {};
	var $locale;
	var $identifier = 'default';

	/**
	 @ngdoc function
	 @name pascalprecht.translate.$mbTranslateDefaultInterpolation#setLocale
	 @methodOf pascalprecht.translate.$mbTranslateDefaultInterpolation
	 
	 @description
	 Sets current locale (this is currently not use in this interpolation).
	 
	 @param {string} locale Language key or locale.
	 */
	$mbTranslateInterpolator.setLocale = function(locale) {
		$locale = locale;
	};

	/**
	 @ngdoc function
	 @name pascalprecht.translate.$mbTranslateDefaultInterpolation#getInterpolationIdentifier
	 @methodOf pascalprecht.translate.$mbTranslateDefaultInterpolation
	 
	 @description
	 Returns an identifier for this interpolation service.
	 
	 @returns {string} $identifier
	 */
	$mbTranslateInterpolator.getInterpolationIdentifier = function() {
		return $identifier;
	};

	/**
	 * @deprecated will be removed in 3.0
	 * @see {@link pascalprecht.translate.$mbTranslateSanitization}
	 */
	$mbTranslateInterpolator.useSanitizeValueStrategy = function(value) {
		$mbTranslateSanitization.useStrategy(value);
		return this;
	};

	/**
	 @ngdoc function
	 @name pascalprecht.translate.$mbTranslateDefaultInterpolation#interpolate
	 @methodOf pascalprecht.translate.$mbTranslateDefaultInterpolation
	
	 @description
	 Interpolates given value agains given interpolate params using angulars
	 `$interpolate` service.
	
	 Since AngularJS 1.5, `value` must not be a string but can be anything input.
	
	 @param {string} value translation
	 @param {object} [interpolationParams={}] interpolation params
	 @param {string} [context=undefined] current context (filter, directive, service)
	 @param {string} [sanitizeStrategy=undefined] sanitize strategy (use default unless set)
	 @param {string} translationId current translationId
	
	 @returns {string} interpolated string
	 */
	$mbTranslateInterpolator.interpolate = function(value, interpolationParams, context, sanitizeStrategy, translationId) { // jshint ignore:line
		interpolationParams = interpolationParams || {};
		interpolationParams = $mbTranslateSanitization.sanitize(interpolationParams, 'params', sanitizeStrategy, context);

		var interpolatedText;
		if (angular.isNumber(value)) {
			// numbers are safe
			interpolatedText = '' + value;
		} else if (angular.isString(value)) {
			// strings must be interpolated (that's the job here)
			interpolatedText = $interpolate(value)(interpolationParams);
			interpolatedText = $mbTranslateSanitization.sanitize(interpolatedText, 'text', sanitizeStrategy, context);
		} else {
			// neither a number or a string, cant interpolate => empty string
			interpolatedText = '';
		}

		return interpolatedText;
	};

	return $mbTranslateInterpolator;
});
