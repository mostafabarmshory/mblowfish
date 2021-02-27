

/**
 * @ngdoc object
 * @name $mbTranslate
 * @requires $interpolate
 * @requires $mbLog
 * @requires $rootScope
 * @requires $q
 *
 * @description
 * The `$mbTranslate` service is the actual core of angular-translate. It expects a translation id
 * and optional interpolate parameters to translate contents.
 *
 * <pre>
 *  $mbTranslate('HEADLINE_TEXT').then(function (translation) {
 *    $scope.translatedText = translation;
 *  });
 * </pre>
 *
 * @param {string|array} translationId A token which represents a translation id
 *                                     This can be optionally an array of translation ids which
 *                                     results that the function returns an object where each key
 *                                     is the translation id and the value the translation.
 * @param {object=} [interpolateParams={}] An object hash for dynamic values
 * @param {string=} [interpolationId=undefined] The id of the interpolation to use (use default unless set via useInterpolation())
 * @param {string=} [defaultTranslationText=undefined] the optional default translation text that is written as
 *                                        as default text in case it is not found in any configured language
 * @param {string=} [forceLanguage=false] A language to be used instead of the current language
 * @param {string=} [sanitizeStrategy=undefined] force sanitize strategy for this call instead of using the configured one (use default unless set)
 * @returns {object} promise
 */
function mbTranslate() {
	//----------------------------------------------------------------
	// Services
	//----------------------------------------------------------------

	var provider;
	var service;

	var $rootScope;
	var $q;
	var injector;

	var indexOf = _.indexOf;
	var trim = _.trim;
	var toLowerCase = _.lowerCase;


	//----------------------------------------------------------------
	// Variables
	//----------------------------------------------------------------

	var $translationTable = {},
		$preferredLanguage,
		$availableLanguageKeys = [],
		$languageKeyAliases,
		$fallbackLanguage,
		$fallbackWasString,
		$uses,
		$nextLang,
		$storageFactory,
		$storageKey = 'NG_TRANSLATE_LANG_KEY',
		$storagePrefix,
		$missingTranslationHandlerFactory,
		$interpolationFactory,
		$interpolatorFactories = [],
		$loaderFactory,
		$cloakClassName = 'mb-translate-cloak',
		$loaderOptions,
		$notFoundIndicatorLeft,
		$notFoundIndicatorRight,
		$postCompilingEnabled = false,
		$forceAsyncReloadEnabled = false,
		$nestedObjectDelimeter = '.',
		$isReady = false,
		$keepContent = false,
		loaderCache,
		directivePriority = 0,
		statefulFilter = true,
		postProcessFn,
		uniformLanguageTagResolver = 'default';



	var Storage,
		defaultInterpolator,
		pendingLoader = false,
		interpolatorHashMap = {},
		langPromises = {},
		fallbackIndex,
		startFallbackIteration;

	var $onReadyDeferred;


	var languageTagResolver = {
		'default': function(tag) {
			return (tag || '').split('-').join('_');
		},
		java: function(tag) {
			var temp = (tag || '').split('-').join('_');
			var parts = temp.split('_');
			return parts.length > 1 ? (parts[0].toLowerCase() + '_' + parts[1].toUpperCase()) : temp;
		},
		bcp47: function(tag) {
			var temp = (tag || '').split('_').join('-');
			var parts = temp.split('-');
			switch (parts.length) {
				case 1: // language only
					parts[0] = parts[0].toLowerCase();
					break;
				case 2: // language-script or language-region
					parts[0] = parts[0].toLowerCase();
					if (parts[1].length === 4) { // parts[1] is script
						parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
					} else { // parts[1] is region
						parts[1] = parts[1].toUpperCase();
					}
					break;
				case 3: // language-script-region
					parts[0] = parts[0].toLowerCase();
					parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
					parts[2] = parts[2].toUpperCase();
					break;
				default:
					return temp;
			}

			return parts.join('-');
		},
		'iso639-1': function(tag) {
			var temp = (tag || '').split('_').join('-');
			var parts = temp.split('-');
			return parts[0].toLowerCase();
		}
	};

	//----------------------------------------------------------------
	// functions
	//----------------------------------------------------------------

	// tries to determine the browsers language
	function getFirstBrowserLanguage() {

		// internal purpose only
		if (angular.isFunction(pascalprechtTranslateOverrider.getLocale)) {
			return pascalprechtTranslateOverrider.getLocale();
		}

		var nav = $windowProvider.$get().navigator,
			browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
			i,
			language;

		// support for HTML 5.1 "navigator.languages"
		if (angular.isArray(nav.languages)) {
			for (i = 0; i < nav.languages.length; i++) {
				language = nav.languages[i];
				if (language && language.length) {
					return language;
				}
			}
		}

		// support for other well known properties in browsers
		for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
			language = nav[browserLanguagePropertyKeys[i]];
			if (language && language.length) {
				return language;
			}
		}

		return null;
	}


	// tries to determine the browsers locale
	function getLocale() {
		var locale = getFirstBrowserLanguage() || '';
		if (languageTagResolver[uniformLanguageTagResolver]) {
			locale = languageTagResolver[uniformLanguageTagResolver](locale);
		}
		return locale;
	}

	function negotiateLocale(preferred) {
		if (!preferred) {
			return;
		}

		var avail = [],
			locale = toLowerCase(preferred),
			i = 0,
			n = $availableLanguageKeys.length;

		for (; i < n; i++) {
			avail.push(toLowerCase($availableLanguageKeys[i]));
		}

		// Check for an exact match in our list of available keys
		i = indexOf(avail, locale);
		if (i > -1) {
			return $availableLanguageKeys[i];
		}

		if ($languageKeyAliases) {
			var alias;
			for (var langKeyAlias in $languageKeyAliases) {
				if ($languageKeyAliases.hasOwnProperty(langKeyAlias)) {
					var hasWildcardKey = false;
					var hasExactKey = Object.prototype.hasOwnProperty.call($languageKeyAliases, langKeyAlias) &&
						toLowerCase(langKeyAlias) === toLowerCase(preferred);

					if (langKeyAlias.slice(-1) === '*') {
						hasWildcardKey = toLowerCase(langKeyAlias.slice(0, -1)) === toLowerCase(preferred.slice(0, langKeyAlias.length - 1));
					}
					if (hasExactKey || hasWildcardKey) {
						alias = $languageKeyAliases[langKeyAlias];
						if (indexOf(avail, toLowerCase(alias)) > -1) {
							return alias;
						}
					}
				}
			}
		}

		// Check for a language code without region
		var parts = preferred.split('_');

		if (parts.length > 1 && indexOf(avail, toLowerCase(parts[0])) > -1) {
			return parts[0];
		}

		// If everything fails, return undefined.
		//		return;
	}

	/**
	 * @ngdoc function
	 * @name translations
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Registers a new translation table for specific language key.
	 *
	 * To register a translation table for specific language, pass a defined language
	 * key as first parameter.
	 *
	 * <pre>
	 *  // register translation table for language: 'de_DE'
	 *  $mbTranslateProvider.translations('de_DE', {
	 *    'GREETING': 'Hallo Welt!'
	 *  });
	 *
	 *  // register another one
	 *  $mbTranslateProvider.translations('en_US', {
	 *    'GREETING': 'Hello world!'
	 *  });
	 * </pre>
	 *
	 * When registering multiple translation tables for for the same language key,
	 * the actual translation table gets extended. This allows you to define module
	 * specific translation which only get added, once a specific module is loaded in
	 * your app.
	 *
	 * Invoking this method with no arguments returns the translation table which was
	 * registered with no language key. Invoking it with a language key returns the
	 * related translation table.
	 *
	 * @param {string} langKey A language key.
	 * @param {object} translationTable A plain old JavaScript object that represents a translation table.
	 *
	 */
	function translations(langKey, translationTable) {
		if (!langKey && !translationTable) {
			return $translationTable;
		}

		if (langKey && !translationTable) {
			if (angular.isString(langKey)) {
				return $translationTable[langKey];
			}
		} else {
			if (!angular.isObject($translationTable[langKey])) {
				$translationTable[langKey] = {};
			}
			angular.extend($translationTable[langKey], flatObject(translationTable));
		}
		return provider;
	};


	/**
	 @ngdoc function
	 @name cloakClassName
	 @methodOf $mbTranslateProvider
	 
	 @description
	 
	 Let's you change the class name for `mb-translate-cloak` directive.
	 Default class name is `mb-translate-cloak`.
	 
	 @param {string} name mb-translate-cloak class name
	 */

	/**
	@ngdoc function
	@name nestedObjectDelimeter
	@methodOf $mbTranslateProvider
	
	@description
	
	Let's you change the delimiter for namespaced translations.
	Default delimiter is `.`.
	
	@param {string} delimiter namespace separator
	 */

	/**
	 * @name flatObject
	 * @private
	 *
	 * @description
	 * Flats an object. This function is used to flatten given translation data with
	 * namespaces, so they are later accessible via dot notation.
	 */
	function flatObject(data, path, result, prevKey) {
		var key, keyWithPath, keyWithShortPath, val;

		if (!path) {
			path = [];
		}
		if (!result) {
			result = {};
		}
		for (key in data) {
			if (!Object.prototype.hasOwnProperty.call(data, key)) {
				continue;
			}
			val = data[key];
			if (angular.isObject(val)) {
				flatObject(val, path.concat(key), result, key);
			} else {
				keyWithPath = path.length ? ('' + path.join($nestedObjectDelimeter) + $nestedObjectDelimeter + key) : key;
				if (path.length && key === prevKey) {
					// Create shortcut path (foo.bar == foo.bar.bar)
					keyWithShortPath = '' + path.join($nestedObjectDelimeter);
					// Link it to original path
					result[keyWithShortPath] = '@:' + keyWithPath;
				}
				result[keyWithPath] = val;
			}
		}
		return result;
	}

	/**
	@ngdoc function
	@name addInterpolation
	@methodOf $mbTranslateProvider
	
	@description
	Adds interpolation services to angular-translate, so it can manage them.
	
	@param {object} factory Interpolation service factory
	 */
	function addInterpolation(factory) {
		$interpolatorFactories.push(factory);
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useMessageFormatInterpolation
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use interpolation functionality of messageformat.js.
	 * This is useful when having high level pluralization and gender selection.
	 */
	function useMessageFormatInterpolation() {
		return this.useInterpolation('$mbTranslateMessageFormatInterpolation');
	};

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useInterpolation
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate which interpolation style to use as default, application-wide.
	 * Simply pass a factory/service name. The interpolation service has to implement
	 * the correct interface.
	 *
	 * @param {string} factory Interpolation service name.
	 */
	function useInterpolation(factory) {
		$interpolationFactory = factory;
		return provider;
	};

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useSanitizeStrategy
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Simply sets a sanitation strategy type.
	 *
	 * @param {string} value Strategy type.
	 */
	function useSanitizeValueStrategy(value) {
		$mbTranslateSanitizationProvider.useStrategy(value);
		return provider;
	};

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#preferredLanguage
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells the module which of the registered translation tables to use for translation
	 * at initial startup by passing a language key. Similar to `$mbTranslateProvider#use`
	 * only that it says which language to **prefer**.
	 * It is recommended to call this after {@link $mbTranslate#fallbackLanguage fallbackLanguage()}.
	 *
	 * @param {string} langKey A language key.
	 */
	function preferredLanguage(langKey) {
		if (langKey) {
			setupPreferredLanguage(langKey);
			return provider;
		}
		return $preferredLanguage;
	}

	function setupPreferredLanguage(langKey) {
		if (langKey) {
			$preferredLanguage = langKey;
		}
		return $preferredLanguage;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#translationNotFoundIndicator
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Sets an indicator which is used when a translation isn't found. E.g. when
	 * setting the indicator as 'X' and one tries to translate a translation id
	 * called `NOT_FOUND`, this will result in `X NOT_FOUND X`.
	 *
	 * Internally this methods sets a left indicator and a right indicator using
	 * `$mbTranslateProvider.translationNotFoundIndicatorLeft()` and
	 * `$mbTranslateProvider.translationNotFoundIndicatorRight()`.
	 *
	 * **Note**: These methods automatically add a whitespace between the indicators
	 * and the translation id.
	 *
	 * @param {string} indicator An indicator, could be any string.
	 */
	function translationNotFoundIndicator(indicator) {
		this.translationNotFoundIndicatorLeft(indicator);
		this.translationNotFoundIndicatorRight(indicator);
		return this;
	}

	/**
	 * ngdoc function
	 * @name $mbTranslateProvider#translationNotFoundIndicatorLeft
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Sets an indicator which is used when a translation isn't found left to the
	 * translation id.
	 *
	 * @param {string} indicator An indicator.
	 */
	function translationNotFoundIndicatorLeft(indicator) {
		if (!indicator) {
			return $notFoundIndicatorLeft;
		}
		$notFoundIndicatorLeft = indicator;
		return provider;
	}

	/**
	 * ngdoc function
	 * @name $mbTranslateProvider#translationNotFoundIndicatorLeft
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Sets an indicator which is used when a translation isn't found right to the
	 * translation id.
	 *
	 * @param {string} indicator An indicator.
	 */
	function translationNotFoundIndicatorRight(indicator) {
		if (!indicator) {
			return $notFoundIndicatorRight;
		}
		$notFoundIndicatorRight = indicator;
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name fallbackLanguage
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells the module which of the registered translation tables to use when missing translations
	 * at initial startup by passing a language key. Similar to `$mbTranslateProvider#use`
	 * only that it says which language to **fallback**.
	 *
	 * @param {string||array} langKey A language key.
	 *
	 */


	function fallbackStack(langKey) {
		if (langKey) {
			if (angular.isString(langKey)) {
				$fallbackWasString = true;
				$fallbackLanguage = [langKey];
			} else if (angular.isArray(langKey)) {
				$fallbackWasString = false;
				$fallbackLanguage = langKey;
			}
			if (angular.isString($preferredLanguage) && indexOf($fallbackLanguage, $preferredLanguage) < 0) {
				$fallbackLanguage.push($preferredLanguage);
			}

			return provider;
		} else {
			if ($fallbackWasString) {
				return $fallbackLanguage[0];
			} else {
				return $fallbackLanguage;
			}
		}
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#use
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Set which translation table to use for translation by given language key. When
	 * trying to 'use' a language which isn't provided, it'll throw an error.
	 *
	 * You actually don't have to use this method since `$mbTranslateProvider#preferredLanguage`
	 * does the job too.
	 *
	 * @param {string} langKey A language key.
	 */

	/**
	 * @ngdoc function
	 * @name resolveClientLocale
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * This returns the current browser/client's language key. The result is processed with the configured uniform tag resolver.
	 *
	 * @returns {string} the current client/browser language key
	 */
	/**
	 * @ngdoc function
	 * @name resolveClientLocale
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * This returns the current browser/client's language key. The result is processed with the configured uniform tag resolver.
	 *
	 * @returns {string} the current client/browser language key
	 */
	function resolveClientLocale() {
		return getLocale();
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#storageKey
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells the module which key must represent the choosed language by a user in the storage.
	 *
	 * @param {string} key A key for the storage.
	 */


	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useUrlLoader
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use `$mbTranslateUrlLoader` extension service as loader.
	 *
	 * @param {string} url Url
	 * @param {Object=} options Optional configuration object
	 */
	function useUrlLoader(urlPath, options) {
		this.useLoader('$mbTranslateUrlLoader', angular.extend({
			url: urlPath
		}, options));
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useStaticFilesLoader
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use `$mbTranslateStaticFilesLoader` extension service as loader.
	 *
	 * @param {Object=} options Optional configuration object
	 */
	function useStaticFilesLoader(options) {
		useLoader('$mbTranslateStaticFilesLoader', options);
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useLoader
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use any other service as loader.
	 *
	 * @param {string} loaderFactory Factory name to use
	 * @param {Object=} options Optional configuration object
	 */
	function useLoader(loaderFactory, options) {
		$loaderFactory = loaderFactory;
		$loaderOptions = options || {};
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useLocalStorage
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use `$mbTranslateLocalStorage` service as storage layer.
	 *
	 */
	function useLocalStorage() {
		useStorage('$mbTranslateLocalStorage');
		return provider
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useCookieStorage
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use `$mbTranslateCookieStorage` service as storage layer.
	 */
	function useCookieStorage() {
		useStorage('$mbTranslateCookieStorage');
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useStorage
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use custom service as storage layer.
	 */
	function useStorage(storageFactory) {
		$storageFactory = storageFactory;
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#storagePrefix
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Sets prefix for storage key.
	 *
	 * @param {string} prefix Storage key prefix
	 */
	function storagePrefix(prefix) {
		if (!prefix) {
			return prefix;
		}
		$storagePrefix = prefix;
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useMissingTranslationHandlerLog
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to use built-in log handler when trying to translate
	 * a translation Id which doesn't exist.
	 *
	 * This is actually a shortcut method for `useMissingTranslationHandler()`.
	 *
	 */
	function useMissingTranslationHandlerLog() {
		return this.useMissingTranslationHandler('$mbTranslateMissingTranslationHandlerLog');
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useMissingTranslationHandler
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Expects a factory name which later gets instantiated with `injector`.
	 * This method can be used to tell angular-translate to use a custom
	 * missingTranslationHandler. Just build a factory which returns a function
	 * and expects a translation id as argument.
	 *
	 * Example:
	 * <pre>
	 *  app.config(function ($mbTranslateProvider) {
	 *    $mbTranslateProvider.useMissingTranslationHandler('customHandler');
	 *  });
	 *
	 *  app.factory('customHandler', function (dep1, dep2) {
	 *    return function (translationId) {
	 *      // something with translationId and dep1 and dep2
	 *    };
	 *  });
	 * </pre>
	 *
	 * @param {string} factory Factory name
	 */
	function useMissingTranslationHandler(factory) {
		$missingTranslationHandlerFactory = factory;
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#usePostCompiling
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * If post compiling is enabled, all translated values will be processed
	 * again with AngularJS' $compile.
	 *
	 * Example:
	 * <pre>
	 *  app.config(function ($mbTranslateProvider) {
	 *    $mbTranslateProvider.usePostCompiling(true);
	 *  });
	 * </pre>
	 *
	 * @param {string} factory Factory name
	 */
	function usePostCompiling(value) {
		$postCompilingEnabled = !(!value);
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#forceAsyncReload
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * If force async reload is enabled, async loader will always be called
	 * even if $translationTable already contains the language key, adding
	 * possible new entries to the $translationTable.
	 *
	 * Example:
	 * <pre>
	 *  app.config(function ($mbTranslateProvider) {
	 *    $mbTranslateProvider.forceAsyncReload(true);
	 *  });
	 * </pre>
	 *
	 * @param {boolean} value - valid values are true or false
	 */
	function forceAsyncReload(value) {
		$forceAsyncReloadEnabled = !(!value);
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#uniformLanguageTag
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate which language tag should be used as a result when determining
	 * the current browser language.
	 *
	 * This setting must be set before invoking {@link $mbTranslateProvider#methods_determinePreferredLanguage determinePreferredLanguage()}.
	 *
	 * <pre>
	 * $mbTranslateProvider
	 *   .uniformLanguageTag('bcp47')
	 *   .determinePreferredLanguage()
	 * </pre>
	 *
	 * The resolver currently supports:
	 * * default
	 *     (traditionally: hyphens will be converted into underscores, i.e. en-US => en_US)
	 *     en-US => en_US
	 *     en_US => en_US
	 *     en-us => en_us
	 * * java
	 *     like default, but the second part will be always in uppercase
	 *     en-US => en_US
	 *     en_US => en_US
	 *     en-us => en_US
	 * * BCP 47 (RFC 4646 & 4647)
	 *     EN => en
	 *     en-US => en-US
	 *     en_US => en-US
	 *     en-us => en-US
	 *     sr-latn => sr-Latn
	 *     sr-latn-rs => sr-Latn-RS
	 *
	 * See also:
	 * * http://en.wikipedia.org/wiki/IETF_language_tag
	 * * http://www.w3.org/International/core/langtags/
	 * * http://tools.ietf.org/html/bcp47
	 *
	 * @param {string|object} options - options (or standard)
	 * @param {string} options.standard - valid values are 'default', 'bcp47', 'java'
	 */
	function uniformLanguageTag(options) {

		if (!options) {
			options = {};
		} else if (angular.isString(options)) {
			options = {
				standard: options
			};
		}

		uniformLanguageTagResolver = options.standard;

		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#determinePreferredLanguage
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Tells angular-translate to try to determine on its own which language key
	 * to set as preferred language. When `fn` is given, angular-translate uses it
	 * to determine a language key, otherwise it uses the built-in `getLocale()`
	 * method.
	 *
	 * The `getLocale()` returns a language key in the format `[lang]_[country]` or
	 * `[lang]` depending on what the browser provides.
	 *
	 * Use this method at your own risk, since not all browsers return a valid
	 * locale (see {@link $mbTranslateProvider#methods_uniformLanguageTag uniformLanguageTag()}).
	 *
	 * @param {Function=} fn Function to determine a browser's locale
	 */
	function determinePreferredLanguage(fn) {

		var locale = (fn && angular.isFunction(fn)) ? fn() : getLocale();

		if (!$availableLanguageKeys.length) {
			$preferredLanguage = locale;
		} else {
			$preferredLanguage = negotiateLocale(locale) || locale;
		}

		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#registerAvailableLanguageKeys
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Registers a set of language keys the app will work with. Use this method in
	 * combination with
	 * {@link $mbTranslateProvider#determinePreferredLanguage determinePreferredLanguage}.
	 * When available languages keys are registered, angular-translate
	 * tries to find the best fitting language key depending on the browsers locale,
	 * considering your language key convention.
	 *
	 * @param {object} languageKeys Array of language keys the your app will use
	 * @param {object=} aliases Alias map.
	 */
	function registerAvailableLanguageKeys(languageKeys, aliases) {
		$availableLanguageKeys = languageKeys;
		if (aliases) {
			$languageKeyAliases = aliases;
		}
		provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#useLoaderCache
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Registers a cache for internal $http based loaders.
	 * {@link $translationCache $translationCache}.
	 * When false the cache will be disabled (default). When true or undefined
	 * the cache will be a default (see $cacheFactory). When an object it will
	 * be treat as a cache object itself: the usage is $http({cache: cache})
	 *
	 * @param {object} cache boolean, string or cache-object
	 */
	function useLoaderCache(flag) {
		if (flag === false) {
			// disable cache
			loaderCache = undefined;
		} else if (flag === true) {
			// enable cache using AJS defaults
			loaderCache = true;
		} else if (typeof (flag) === 'undefined') {
			// enable cache using default
			loaderCache = '$translationCache';
		} else if (flag) {
			// enable cache using given one (see $cacheFactory)
			loaderCache = flag;
		}
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name directivePriority
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Sets the default priority of the translate directive. The standard value is `0`.
	 * Calling this function without an argument will return the current value.
	 *
	 * @param {number} priority for the translate-directive
	 */
	function setDirectivePriority(priority) {
		// setter with chaining
		directivePriority = priority;
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name statefulFilter
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * Since AngularJS 1.3, filters which are not stateless (depending at the scope)
	 * have to explicit define this behavior.
	 * Sets whether the translate filter should be stateful or stateless. The standard value is `true`
	 * meaning being stateful.
	 * Calling this function without an argument will return the current value.
	 *
	 * @param {boolean} state - defines the state of the filter
	 */
	function setStatefulFilter(state) {
		if (state === undefined) {
			// getter
			return statefulFilter;
		} else {
			// setter with chaining
			statefulFilter = state;
			return service;
		}
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#postProcess
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * The post processor will be intercept right after the translation result. It can modify the result.
	 *
	 * @param {object} fn Function or service name (string) to be called after the translation value has been set / resolved. The function itself will enrich every value being processed and then continue the normal resolver process
	 */
	function postProcess(fn) {
		if (fn) {
			postProcessFn = fn;
		} else {
			postProcessFn = undefined;
		}
		return provider;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslateProvider#keepContent
	 * @methodOf $mbTranslateProvider
	 *
	 * @description
	 * If keepContent is set to true than translate directive will always use innerHTML
	 * as a default translation
	 *
	 * Example:
	 * <pre>
	 *  app.config(function ($mbTranslateProvider) {
	 *    $mbTranslateProvider.keepContent(true);
	 *  });
	 * </pre>
	 *
	 * @param {boolean} value - valid values are true or false
	 */
	function keepContent(value) {
		$keepContent = !(!value);
		return provider;
	}



	/**
	 * @name applyNotFoundIndicators
	 * @private
	 *
	 * @description
	 * Applies not fount indicators to given translation id, if needed.
	 * This function gets only executed, if a translation id doesn't exist,
	 * which is why a translation id is expected as argument.
	 *
	 * @param {string} translationId Translation id.
	 * @returns {string} Same as given translation id but applied with not found
	 * indicators.
	 */
	function applyNotFoundIndicators(translationId) {
		// applying notFoundIndicators
		if ($notFoundIndicatorLeft) {
			translationId = [$notFoundIndicatorLeft, translationId].join(' ');
		}
		if ($notFoundIndicatorRight) {
			translationId = [translationId, $notFoundIndicatorRight].join(' ');
		}
		return translationId;
	}

	/**
	 * @name useLanguage
	 * @private
	 *
	 * @description
	 * Makes actual use of a language by setting a given language key as used
	 * language and informs registered interpolators to also use the given
	 * key as locale.
	 *
	 * @param {string} key Locale key.
	 */
	function useLanguage(key) {
		$uses = key;

		// make sure to store new language key before triggering success event
		if ($storageFactory) {
			Storage.put($mbTranslate.storageKey(), $uses);
		}

		$rootScope.$emit('$mbTranslateChangeSuccess', { language: key });

		// inform default interpolator
		defaultInterpolator.setLocale($uses);

		// inform all others too!
		angular.forEach(interpolatorHashMap, function(interpolator, id) {
			interpolatorHashMap[id].setLocale($uses);
		});
		$rootScope.$emit('$mbTranslateChangeEnd', { language: key });
	}

	/**
	 * @name loadAsync
	 * @private
	 *
	 * @description
	 * Kicks off registered async loader using `injector` and applies existing
	 * loader options. When resolved, it updates translation tables accordingly
	 * or rejects with given language key.
	 *
	 * @param {string} key Language key.
	 * @return {Promise} A promise.
	 */
	function loadAsync(key) {
		if (!key) {
			throw 'No language key specified for loading.';
		}

		var deferred = $q.defer();

		$rootScope.$emit('$mbTranslateLoadingStart', { language: key });
		pendingLoader = true;

		var cache = loaderCache;
		if (typeof (cache) === 'string') {
			// getting on-demand instance of loader
			cache = injector.get(cache);
		}

		var loaderOptions = angular.extend({}, $loaderOptions, {
			key: key,
			$http: angular.extend({}, {
				cache: cache
			}, $loaderOptions.$http)
		});

		var onLoaderSuccess = function(data) {
			var translationTable = {};
			$rootScope.$emit('$mbTranslateLoadingSuccess', { language: key });

			if (angular.isArray(data)) {
				angular.forEach(data, function(table) {
					angular.extend(translationTable, flatObject(table));
				});
			} else {
				angular.extend(translationTable, flatObject(data));
			}
			pendingLoader = false;
			deferred.resolve({
				key: key,
				table: translationTable
			});
			$rootScope.$emit('$mbTranslateLoadingEnd', { language: key });
		};

		var onLoaderError = function(key) {
			$rootScope.$emit('$mbTranslateLoadingError', { language: key });
			deferred.reject(key);
			$rootScope.$emit('$mbTranslateLoadingEnd', { language: key });
		};

		injector.get($loaderFactory)(loaderOptions)
			.then(onLoaderSuccess, onLoaderError);

		return deferred.promise;
	}

	/**
	 * @name getTranslationTable
	 * @private
	 *
	 * @description
	 * Returns a promise that resolves to the translation table
	 * or is rejected if an error occurred.
	 *
	 * @param langKey
	 * @returns {Q.promise}
	 */
	function getTranslationTable(langKey) {
		var deferred = $q.defer();
		if (Object.prototype.hasOwnProperty.call($translationTable, langKey)) {
			deferred.resolve($translationTable[langKey]);
		} else if (langPromises[langKey]) {
			langPromises[langKey].then(function(data) {
				translations(data.key, data.table);
				deferred.resolve(data.table);
			}, deferred.reject);
		} else {
			deferred.reject();
		}
		return deferred.promise;
	}

	/**
	 * @name getFallbackTranslation
	 * @private
	 *
	 * @description
	 * Returns a promise that will resolve to the translation
	 * or be rejected if no translation was found for the language.
	 * This function is currently only used for fallback language translation.
	 *
	 * @param langKey The language to translate to.
	 * @param translationId
	 * @param interpolateParams
	 * @param Interpolator
	 * @param sanitizeStrategy
	 * @returns {Q.promise}
	 */
	function getFallbackTranslation(langKey, translationId, interpolateParams, Interpolator, sanitizeStrategy) {
		var deferred = $q.defer();
		getTranslationTable(langKey).then(function(translationTable) {
			if (Object.prototype.hasOwnProperty.call(translationTable, translationId) && translationTable[translationId] !== null) {
				Interpolator.setLocale(langKey);
				var translation = translationTable[translationId];
				if (translation.substr(0, 2) === '@:') {
					getFallbackTranslation(langKey, translation.substr(2), interpolateParams, Interpolator, sanitizeStrategy)
						.then(deferred.resolve, deferred.reject);
				} else {
					var interpolatedValue = Interpolator.interpolate(translationTable[translationId], interpolateParams, 'service', sanitizeStrategy, translationId);
					interpolatedValue = applyPostProcessing(translationId, translationTable[translationId], interpolatedValue, interpolateParams, langKey);

					deferred.resolve(interpolatedValue);

				}
				Interpolator.setLocale($uses);
			} else {
				deferred.reject();
			}
		}, deferred.reject);

		return deferred.promise;
	}

	/**
	 * @name getFallbackTranslationInstant
	 * @private
	 *
	 * @description
	 * Returns a translation
	 * This function is currently only used for fallback language translation.
	 *
	 * @param langKey The language to translate to.
	 * @param translationId
	 * @param interpolateParams
	 * @param Interpolator
	 * @param sanitizeStrategy sanitize strategy override
	 *
	 * @returns {string} translation
	 */
	function getFallbackTranslationInstant(langKey, translationId, interpolateParams, Interpolator, sanitizeStrategy) {
		var result, translationTable = $translationTable[langKey];

		if (translationTable && Object.prototype.hasOwnProperty.call(translationTable, translationId) && translationTable[translationId] !== null) {
			Interpolator.setLocale(langKey);
			result = Interpolator.interpolate(translationTable[translationId], interpolateParams, 'filter', sanitizeStrategy, translationId);
			result = applyPostProcessing(translationId, translationTable[translationId], result, interpolateParams, langKey, sanitizeStrategy);
			// workaround for TrustedValueHolderType
			if (!angular.isString(result) && angular.isFunction(result.$$unwrapTrustedValue)) {
				var result2 = result.$$unwrapTrustedValue();
				if (result2.substr(0, 2) === '@:') {
					return getFallbackTranslationInstant(langKey, result2.substr(2), interpolateParams, Interpolator, sanitizeStrategy);
				}
			} else if (result.substr(0, 2) === '@:') {
				return getFallbackTranslationInstant(langKey, result.substr(2), interpolateParams, Interpolator, sanitizeStrategy);
			}
			Interpolator.setLocale($uses);
		}

		return result;
	}


	/**
	 * @name translateByHandler
	 * @private
	 *
	 * Translate by missing translation handler.
	 *
	 * @param translationId
	 * @param interpolateParams
	 * @param defaultTranslationText
	 * @param sanitizeStrategy sanitize strategy override
	 *
	 * @returns translation created by $missingTranslationHandler or translationId is $missingTranslationHandler is
	 * absent
	 */
	function translateByHandler(translationId, interpolateParams, defaultTranslationText, sanitizeStrategy) {
		// If we have a handler factory - we might also call it here to determine if it provides
		// a default text for a translationid that can't be found anywhere in our tables
		if ($missingTranslationHandlerFactory) {
			return injector.get($missingTranslationHandlerFactory)(translationId, $uses, interpolateParams, defaultTranslationText, sanitizeStrategy);
		} else {
			return translationId;
		}
	}

	/**
	 * @name resolveForFallbackLanguage
	 * @private
	 *
	 * Recursive helper function for fallbackTranslation that will sequentially look
	 * for a translation in the fallbackLanguages starting with fallbackLanguageIndex.
	 *
	 * @param fallbackLanguageIndex
	 * @param translationId
	 * @param interpolateParams
	 * @param Interpolator
	 * @param defaultTranslationText
	 * @param sanitizeStrategy
	 * @returns {Q.promise} Promise that will resolve to the translation.
	 */
	function resolveForFallbackLanguage(fallbackLanguageIndex, translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy) {
		var deferred = $q.defer();

		if (fallbackLanguageIndex < $fallbackLanguage.length) {
			var langKey = $fallbackLanguage[fallbackLanguageIndex];
			getFallbackTranslation(langKey, translationId, interpolateParams, Interpolator, sanitizeStrategy).then(
				function(data) {
					deferred.resolve(data);
				},
				function() {
					// Look in the next fallback language for a translation.
					// It delays the resolving by passing another promise to resolve.
					return resolveForFallbackLanguage(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy).then(deferred.resolve, deferred.reject);
				}
			);
		} else {
			// No translation found in any fallback language
			// if a default translation text is set in the directive, then return this as a result
			if (defaultTranslationText) {
				deferred.resolve(defaultTranslationText);
			} else {
				var missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, defaultTranslationText);

				// if no default translation is set and an error handler is defined, send it to the handler
				// and then return the result if it isn't undefined
				if ($missingTranslationHandlerFactory && missingTranslationHandlerTranslation) {
					deferred.resolve(missingTranslationHandlerTranslation);
				} else {
					deferred.reject(applyNotFoundIndicators(translationId));
				}
			}
		}
		return deferred.promise;
	}

	/**
	 * @name resolveForFallbackLanguageInstant
	 * @private
	 *
	 * Recursive helper function for fallbackTranslation that will sequentially look
	 * for a translation in the fallbackLanguages starting with fallbackLanguageIndex.
	 *
	 * @param fallbackLanguageIndex
	 * @param translationId
	 * @param interpolateParams
	 * @param Interpolator
	 * @param sanitizeStrategy
	 * @returns {string} translation
	 */
	function resolveForFallbackLanguageInstant(fallbackLanguageIndex, translationId, interpolateParams, Interpolator, sanitizeStrategy) {
		var result;

		if (fallbackLanguageIndex < $fallbackLanguage.length) {
			var langKey = $fallbackLanguage[fallbackLanguageIndex];
			result = getFallbackTranslationInstant(langKey, translationId, interpolateParams, Interpolator, sanitizeStrategy);
			if (!result && result !== '') {
				result = resolveForFallbackLanguageInstant(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator);
			}
		}
		return result;
	}

	/**
	 * Translates with the usage of the fallback languages.
	 *
	 * @param translationId
	 * @param interpolateParams
	 * @param Interpolator
	 * @param defaultTranslationText
	 * @param sanitizeStrategy
	 * @returns {Q.promise} Promise, that resolves to the translation.
	 */
	function fallbackTranslation(translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy) {
		// Start with the fallbackLanguage with index 0
		return resolveForFallbackLanguage((startFallbackIteration > 0 ? startFallbackIteration : fallbackIndex), translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy);
	}

	/**
	 * Translates with the usage of the fallback languages.
	 *
	 * @param translationId
	 * @param interpolateParams
	 * @param Interpolator
	 * @param sanitizeStrategy
	 * @returns {String} translation
	 */
	function fallbackTranslationInstant(translationId, interpolateParams, Interpolator, sanitizeStrategy) {
		// Start with the fallbackLanguage with index 0
		return resolveForFallbackLanguageInstant((startFallbackIteration > 0 ? startFallbackIteration : fallbackIndex), translationId, interpolateParams, Interpolator, sanitizeStrategy);
	};

	function determineTranslation(translationId, interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy) {

		var deferred = $q.defer();

		var table = uses ? $translationTable[uses] : $translationTable,
			Interpolator = (interpolationId) ? interpolatorHashMap[interpolationId] : defaultInterpolator;

		// if the translation id exists, we can just interpolate it
		if (table && Object.prototype.hasOwnProperty.call(table, translationId) && table[translationId] !== null) {
			var translation = table[translationId];

			// If using link, rerun $mbTranslate with linked translationId and return it
			if (translation.substr(0, 2) === '@:') {

				$mbTranslate(translation.substr(2), interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy)
					.then(deferred.resolve, deferred.reject);
			} else {
				//
				var resolvedTranslation = Interpolator.interpolate(translation, interpolateParams, 'service', sanitizeStrategy, translationId);
				resolvedTranslation = applyPostProcessing(translationId, translation, resolvedTranslation, interpolateParams, uses);
				deferred.resolve(resolvedTranslation);
			}
		} else {
			var missingTranslationHandlerTranslation;
			// for logging purposes only (as in $mbTranslateMissingTranslationHandlerLog), value is not returned to promise
			if ($missingTranslationHandlerFactory && !pendingLoader) {
				missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, defaultTranslationText);
			}

			// since we couldn't translate the inital requested translation id,
			// we try it now with one or more fallback languages, if fallback language(s) is
			// configured.
			if (uses && $fallbackLanguage && $fallbackLanguage.length) {
				fallbackTranslation(translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy)
					.then(function(translation) {
						deferred.resolve(translation);
					}, function(_translationId) {
						deferred.reject(applyNotFoundIndicators(_translationId));
					});
			} else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
				// looks like the requested translation id doesn't exists.
				// Now, if there is a registered handler for missing translations and no
				// asyncLoader is pending, we execute the handler
				if (defaultTranslationText) {
					deferred.resolve(defaultTranslationText);
				} else {
					deferred.resolve(missingTranslationHandlerTranslation);
				}
			} else {
				if (defaultTranslationText) {
					deferred.resolve(defaultTranslationText);
				} else {
					deferred.reject(applyNotFoundIndicators(translationId));
				}
			}
		}
		return deferred.promise;
	}

	function determineTranslationInstant(translationId, interpolateParams, interpolationId, uses, sanitizeStrategy) {

		var result, table = uses ? $translationTable[uses] : $translationTable,
			Interpolator = defaultInterpolator;

		// if the interpolation id exists use custom interpolator
		if (interpolatorHashMap && Object.prototype.hasOwnProperty.call(interpolatorHashMap, interpolationId)) {
			Interpolator = interpolatorHashMap[interpolationId];
		}

		// if the translation id exists, we can just interpolate it
		if (table && Object.prototype.hasOwnProperty.call(table, translationId) && table[translationId] !== null) {
			var translation = table[translationId];

			// If using link, rerun $mbTranslate with linked translationId and return it
			if (translation.substr(0, 2) === '@:') {
				result = determineTranslationInstant(translation.substr(2), interpolateParams, interpolationId, uses, sanitizeStrategy);
			} else {
				result = Interpolator.interpolate(translation, interpolateParams, 'filter', sanitizeStrategy, translationId);
				result = applyPostProcessing(translationId, translation, result, interpolateParams, uses, sanitizeStrategy);
			}
		} else {
			var missingTranslationHandlerTranslation;
			// for logging purposes only (as in $mbTranslateMissingTranslationHandlerLog), value is not returned to promise
			if ($missingTranslationHandlerFactory && !pendingLoader) {
				missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, sanitizeStrategy);
			}

			// since we couldn't translate the inital requested translation id,
			// we try it now with one or more fallback languages, if fallback language(s) is
			// configured.
			if (uses && $fallbackLanguage && $fallbackLanguage.length) {
				fallbackIndex = 0;
				result = fallbackTranslationInstant(translationId, interpolateParams, Interpolator, sanitizeStrategy);
			} else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
				// looks like the requested translation id doesn't exists.
				// Now, if there is a registered handler for missing translations and no
				// asyncLoader is pending, we execute the handler
				result = missingTranslationHandlerTranslation;
			} else {
				result = applyNotFoundIndicators(translationId);
			}
		}

		return result;
	}

	function clearNextLangAndPromise(key) {
		if ($nextLang === key) {
			$nextLang = undefined;
		}
		langPromises[key] = undefined;
	}

	function applyPostProcessing(translationId, translation, resolvedTranslation, interpolateParams, uses, sanitizeStrategy) {
		var fn = postProcessFn;

		if (fn) {

			if (typeof (fn) === 'string') {
				// getting on-demand instance
				fn = injector.get(fn);
			}
			if (fn) {
				return fn(translationId, translation, resolvedTranslation, interpolateParams, uses, sanitizeStrategy);
			}
		}

		return resolvedTranslation;
	}

	function loadTranslationsIfMissing(key) {
		if (!$translationTable[key] && $loaderFactory && !langPromises[key]) {
			langPromises[key] = loadAsync(key).then(function(translation) {
				translations(translation.key, translation.table);
				return translation;
			});
		}
	}


	/**
	 * @ngdoc function
	 * @name $mbTranslate#getAvailableLanguageKeys
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * This function simply returns the registered language keys being defined before in the config phase
	 * With this, an application can use the array to provide a language selection dropdown or similar
	 * without any additional effort
	 *
	 * @returns {object} returns the list of possibly registered language keys and mapping or null if not defined
	 */
	function getAvailableLanguageKeys() {
		if ($availableLanguageKeys.length > 0) {
			return $availableLanguageKeys;
		}
		return null;
	}



	/**
	 * @ngdoc function
	 * @name getTranslationTable
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns translation table by the given language key.
	 *
	 * Unless a language is provided it returns a translation table of the current one.
	 * Note: If translation dictionary is currently downloading or in progress
	 * it will return null.
	 *
	 * @param {string} langKey A token which represents a translation id
	 *
	 * @return {object} a copy of angular-translate $translationTable
	 */
	function getTranslationTable(langKey) {
		langKey = langKey || use();
		if (langKey && $translationTable[langKey]) {
			return angular.copy($translationTable[langKey]);
		}
		//			return null;
	}



	/**
	 * @ngdoc function
	 * @name preferredLanguage
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns the language key for the preferred language.
	 *
	 * @param {string} langKey language String or Array to be used as preferredLanguage (changing at runtime)
	 *
	 * @return {string} preferred language key
	 */

	/**
	 * @ngdoc function
	 * @name loakClassName
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns the configured class name for `mb-translate-cloak` directive.
	 *
	 * @return {string} cloakClassName
	 */
	function cloakClassName() {
		return $cloakClassName;
	}

	/**
	 * @ngdoc function
	 * @name nestedObjectDelimeter
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns the configured delimiter for nested namespaces.
	 *
	 * @return {string} nestedObjectDelimeter
	 */
	function nestedObjectDelimeter() {
		return $nestedObjectDelimeter;
	}

	/**
	 @ngdoc function
	 @name fallbackLanguage
	 @methodOf $mbTranslate
	 
	 @description
	 Returns the language key for the fallback languages or sets a new fallback stack.
	 It is recommended to call this before {@link $mbTranslateProvider#preferredLanguage preferredLanguage()}.
	 
	 @param {string=} langKey language String or Array of fallback languages to be used (to change stack at runtime)
	 
	 @return {string||array} fallback language key
	 */
	function fallbackLanguage(langKey) {
		if (langKey !== undefined && langKey !== null) {
			fallbackStack(langKey);

			// as we might have an async loader initiated and a new translation language might have been defined
			// we need to add the promise to the stack also. So - iterate.
			if ($loaderFactory) {
				if ($fallbackLanguage && $fallbackLanguage.length) {
					for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
						if (!langPromises[$fallbackLanguage[i]]) {
							langPromises[$fallbackLanguage[i]] = loadAsync($fallbackLanguage[i]);
						}
					}
				}
			}
			$mbTranslate.use($mbTranslate.use());
		}
		if ($fallbackWasString) {
			return $fallbackLanguage[0];
		} else {
			return $fallbackLanguage;
		}
	}

	/**
	 @ngdoc function
	 @name useFallbackLanguage
	 @methodOf $mbTranslate
	 
	 @description
	 Sets the first key of the fallback language stack to be used for translation.
	 Therefore all languages in the fallback array BEFORE this key will be skipped!
	 
	 @param {string=} langKey Contains the langKey the iteration shall start with. Set to false if you want to
	 get back to the whole stack
	 */
	function useFallbackLanguage(langKey) {
		if (langKey !== undefined && langKey !== null) {
			if (!langKey) {
				startFallbackIteration = 0;
			} else {
				var langKeyPosition = indexOf($fallbackLanguage, langKey);
				if (langKeyPosition > -1) {
					startFallbackIteration = langKeyPosition;
				}
			}
		}
	}

	/**
	@ngdoc function
	@name $mbTranslate#proposedLanguage
	@methodOf $mbTranslate
	
	@description
	Returns the language key of language that is currently loaded asynchronously.
	
	@return {string} language key
	 */
	function proposedLanguage() {
		return $nextLang;
	}

	/**
	@ngdoc function
	@name $mbTranslate#storage
	@methodOf $mbTranslate
	
	@description
	Returns registered storage.
	
	@return {object} Storage
	 */
	function storage() {
		return Storage;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#negotiateLocale
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns a language key based on available languages and language aliases. If a
	 * language key cannot be resolved, returns undefined.
	 *
	 * If no or a falsy key is given, returns undefined.
	 *
	 * @param {string} [key] Language key
	 * @return {string|undefined} Language key or undefined if no language key is found.
	 */

	/**
	@ngdoc function
	@name use
	@methodOf $mbTranslate
	
	@description
	Tells angular-translate which language to use by given language key. This method is
	used to change language at runtime. It also takes care of storing the language
	key in a configured store to let your app remember the choosed language.
	
	When trying to 'use' a language which isn't available it tries to load it
	asynchronously with registered loaders.
	
	Returns promise object with loaded language file data or string of the currently used language.
	
	If no or a falsy key is given it returns the currently used language key.
	The returned string will be ```undefined``` if setting up $mbTranslate hasn't finished.
	
	@example
	$mbTranslate.use("en_US").then(function(data){
	  $scope.text = $mbTranslate("HELLO");
	});
	
	@param {string=} key Language key
	@return {object|string} Promise with loaded language data or the language key if a falsy param was given.
	 */
	function use(key) {
		if (!key) {
			return $uses;
		}

		var deferred = $q.defer();
		deferred.promise.then(null, angular.noop); // AJS "Possibly unhandled rejection"

		$rootScope.$emit('$mbTranslateChangeStart', { language: key });

		// Try to get the aliased language key
		var aliasedKey = negotiateLocale(key);
		// Ensure only registered language keys will be loaded
		if ($availableLanguageKeys.length > 0 && !aliasedKey) {
			return $q.reject(key);
		}

		if (aliasedKey) {
			key = aliasedKey;
		}

		// if there isn't a translation table for the language we've requested,
		// we load it asynchronously
		$nextLang = key;
		if (($forceAsyncReloadEnabled || !$translationTable[key]) && $loaderFactory && !langPromises[key]) {
			langPromises[key] = loadAsync(key).then(function(translation) {
				translations(translation.key, translation.table);
				deferred.resolve(translation.key);
				if ($nextLang === key) {
					useLanguage(translation.key);
				}
				return translation;
			}, function(key) {
				$rootScope.$emit('$mbTranslateChangeError', { language: key });
				deferred.reject(key);
				$rootScope.$emit('$mbTranslateChangeEnd', { language: key });
				return $q.reject(key);
			});
			langPromises[key]['finally'](function() {
				clearNextLangAndPromise(key);
			})['catch'](angular.noop); // we don't care about errors (clearing)
		} else if (langPromises[key]) {
			// we are already loading this asynchronously
			// resolve our new deferred when the old langPromise is resolved
			langPromises[key].then(function(translation) {
				if ($nextLang === translation.key) {
					useLanguage(translation.key);
				}
				deferred.resolve(translation.key);
				return translation;
			}, function(key) {
				// find first available fallback language if that request has failed
				if (!$uses && $fallbackLanguage && $fallbackLanguage.length > 0 && $fallbackLanguage[0] !== key) {
					return $mbTranslate.use($fallbackLanguage[0]).then(deferred.resolve, deferred.reject);
				} else {
					return deferred.reject(key);
				}
			});
		} else {
			deferred.resolve(key);
			useLanguage(key);
		}

		return deferred.promise;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#resolveClientLocale
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * This returns the current browser/client's language key. The result is processed with the configured uniform tag resolver.
	 *
	 * @returns {string} the current client/browser language key
	 */
	//	function resolveClientLocale() {
	//		return getLocale();
	//	}

	/**
	 * @ngdoc function
	 * @name storageKey
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns the key for the storage.
	 *
	 * @return {string} storage key
	 */
	//		function storageKey() {
	//			return storageKey();
	//		}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#isPostCompilingEnabled
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns whether post compiling is enabled or not
	 *
	 * @return {bool} storage key
	 */
	function isPostCompilingEnabled() {
		return $postCompilingEnabled;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#isForceAsyncReloadEnabled
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns whether force async reload is enabled or not
	 *
	 * @return {boolean} forceAsyncReload value
	 */
	function isForceAsyncReloadEnabled() {
		return $forceAsyncReloadEnabled;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#isKeepContent
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns whether keepContent or not
	 *
	 * @return {boolean} keepContent value
	 */
	function isKeepContent() {
		return $keepContent;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#refresh
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Refreshes a translation table pointed by the given langKey. If langKey is not specified,
	 * the module will drop all existent translation tables and load new version of those which
	 * are currently in use.
	 *
	 * Refresh means that the module will drop target translation table and try to load it again.
	 *
	 * In case there are no loaders registered the refresh() method will throw an Error.
	 *
	 * If the module is able to refresh translation tables refresh() method will broadcast
	 * $mbTranslateRefreshStart and $mbTranslateRefreshEnd events.
	 *
	 * @example
	 * // this will drop all currently existent translation tables and reload those which are
	 * // currently in use
	 * $mbTranslate.refresh();
	 * // this will refresh a translation table for the en_US language
	 * $mbTranslate.refresh('en_US');
	 *
	 * @param {string} langKey A language key of the table, which has to be refreshed
	 *
	 * @return {promise} Promise, which will be resolved in case a translation tables refreshing
	 * process is finished successfully, and reject if not.
	 */
	function refresh(langKey) {
		if (!$loaderFactory) {
			throw new Error('Couldn\'t refresh translation table, no loader registered!');
		}

		$rootScope.$emit('$mbTranslateRefreshStart', { language: langKey });

		var deferred = $q.defer(), updatedLanguages = {};

		//private helper
		function loadNewData(languageKey) {
			var promise = loadAsync(languageKey);
			//update the load promise cache for this language
			langPromises[languageKey] = promise;
			//register a data handler for the promise
			promise.then(function(data) {
				//clear the cache for this language
				$translationTable[languageKey] = {};
				//add the new data for this language
				translations(languageKey, data.table);
				//track that we updated this language
				updatedLanguages[languageKey] = true;
			},
				//handle rejection to appease the $q validation
				angular.noop);
			return promise;
		}

		//set up post-processing
		deferred.promise.then(
			function() {
				for (var key in $translationTable) {
					if ($translationTable.hasOwnProperty(key)) {
						//delete cache entries that were not updated
						if (!(key in updatedLanguages)) {
							delete $translationTable[key];
						}
					}
				}
				if ($uses) {
					useLanguage($uses);
				}
			},
			//handle rejection to appease the $q validation
			angular.noop
		)['finally'](
			function() {
				$rootScope.$emit('$mbTranslateRefreshEnd', { language: langKey });
			}
		);

		if (!langKey) {
			// if there's no language key specified we refresh ALL THE THINGS!
			var languagesToReload = $fallbackLanguage && $fallbackLanguage.slice() || [];
			if ($uses && languagesToReload.indexOf($uses) === -1) {
				languagesToReload.push($uses);
			}
			$q.all(languagesToReload.map(loadNewData)).then(deferred.resolve, deferred.reject);

		} else if ($translationTable[langKey]) {
			//just refresh the specified language cache
			loadNewData(langKey).then(deferred.resolve, deferred.reject);

		} else {
			deferred.reject();
		}

		return deferred.promise;
	};

	/**
	 * @ngdoc function
	 * @name instant
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns a translation instantly from the internal state of loaded translation. All rules
	 * regarding the current language, the preferred language of even fallback languages will be
	 * used except any promise handling. If a language was not found, an asynchronous loading
	 * will be invoked in the background.
	 *
	 * @param {string|array} translationId A token which represents a translation id
	 *                                     This can be optionally an array of translation ids which
	 *                                     results that the function's promise returns an object where
	 *                                     each key is the translation id and the value the translation.
	 * @param {object=} [interpolateParams={}] Params
	 * @param {string=} [interpolationId=undefined] The id of the interpolation to use (use default unless set via useInterpolation())
	 * @param {string=} [forceLanguage=false] A language to be used instead of the current language
	 * @param {string=} [sanitizeStrategy=undefined] force sanitize strategy for this call instead of using the configured one (use default unless set)
	 *
	 * @return {string|object} translation
	 */
	function instant(translationId, interpolateParams, interpolationId, forceLanguage, sanitizeStrategy) {

		// we don't want to re-negotiate $uses
		var uses = (forceLanguage && forceLanguage !== $uses) ? // we don't want to re-negotiate $uses
			(negotiateLocale(forceLanguage) || forceLanguage) : $uses;

		// Detect undefined and null values to shorten the execution and prevent exceptions
		if (translationId === null || angular.isUndefined(translationId)) {
			return translationId;
		}

		// Check forceLanguage is present
		if (forceLanguage) {
			loadTranslationsIfMissing(forceLanguage);
		}

		// Duck detection: If the first argument is an array, a bunch of translations was requested.
		// The result is an object.
		if (angular.isArray(translationId)) {
			var results = {};
			for (var i = 0, c = translationId.length; i < c; i++) {
				results[translationId[i]] = $mbTranslate.instant(translationId[i], interpolateParams, interpolationId, forceLanguage, sanitizeStrategy);
			}
			return results;
		}

		// We discarded unacceptable values. So we just need to verify if translationId is empty String
		if (angular.isString(translationId) && translationId.length < 1) {
			return translationId;
		}

		// trim off any whitespace
		if (translationId) {
			translationId = trim(translationId);
		}

		var result, possibleLangKeys = [];
		if ($preferredLanguage) {
			possibleLangKeys.push($preferredLanguage);
		}
		if (uses) {
			possibleLangKeys.push(uses);
		}
		if ($fallbackLanguage && $fallbackLanguage.length) {
			possibleLangKeys = possibleLangKeys.concat($fallbackLanguage);
		}
		for (var j = 0, d = possibleLangKeys.length; j < d; j++) {
			var possibleLangKey = possibleLangKeys[j];
			if ($translationTable[possibleLangKey]) {
				if (typeof $translationTable[possibleLangKey][translationId] !== 'undefined') {
					result = determineTranslationInstant(translationId, interpolateParams, interpolationId, uses, sanitizeStrategy);
				}
			}
			if (typeof result !== 'undefined') {
				break;
			}
		}

		if (!result && result !== '') {
			if ($notFoundIndicatorLeft || $notFoundIndicatorRight) {
				result = applyNotFoundIndicators(translationId);
			} else {
				// Return translation of default interpolator if not found anything.
				result = defaultInterpolator.interpolate(translationId, interpolateParams, 'filter', sanitizeStrategy);

				// looks like the requested translation id doesn't exists.
				// Now, if there is a registered handler for missing translations and no
				// asyncLoader is pending, we execute the handler
				var missingTranslationHandlerTranslation;
				if ($missingTranslationHandlerFactory && !pendingLoader) {
					missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, sanitizeStrategy);
				}

				if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
					result = missingTranslationHandlerTranslation;
				}
			}
		}

		return result;
	};

	/**
	 * @ngdoc function
	 * @name $mbTranslate#loaderCache
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns the defined loaderCache.
	 *
	 * @return {boolean|string|object} current value of loaderCache
	 */
	function loaderCache() {
		return loaderCache;
	}

	// internal purpose only
	function getDirectivePriority() {
		return directivePriority;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#isReady
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Returns whether the service is "ready" to translate (i.e. loading 1st language).
	 *
	 * See also {@link $mbTranslate#methods_onReady onReady()}.
	 *
	 * @return {boolean} current value of ready
	 */
	function isReady() {
		return $isReady;
	}

	/**
	 * @ngdoc function
	 * @name $mbTranslate#onReady
	 * @methodOf $mbTranslate
	 *
	 * @description
	 * Calls the function provided or resolved the returned promise after the service is "ready" to translate (i.e. loading 1st language).
	 *
	 * See also {@link $mbTranslate#methods_isReady isReady()}.
	 *
	 * @param {Function=} fn Function to invoke when service is ready
	 * @return {object} Promise resolved when service is ready
	 */
	function onReady(fn) {
		var deferred = $q.defer();
		if (angular.isFunction(fn)) {
			deferred.promise.then(fn);
		}
		if ($isReady) {
			deferred.resolve();
		} else {
			$onReadyDeferred.promise.then(deferred.resolve);
		}
		return deferred.promise;
	}


	//-----------------------------------------------------------------------------
	// End
	//-----------------------------------------------------------------------------

	service = function(translationId, interpolateParams, interpolationId, defaultTranslationText, forceLanguage, sanitizeStrategy) {
		if (!$uses && $preferredLanguage) {
			$uses = $preferredLanguage;
		}
		var uses = (forceLanguage && forceLanguage !== $uses) ? // we don't want to re-negotiate $uses
			(negotiateLocale(forceLanguage) || forceLanguage) : $uses;

		// Check forceLanguage is present
		if (forceLanguage) {
			loadTranslationsIfMissing(forceLanguage);
		}

		// Duck detection: If the first argument is an array, a bunch of translations was requested.
		// The result is an object.
		if (angular.isArray(translationId)) {
			// Inspired by Q.allSettled by Kris Kowal
			// https://github.com/kriskowal/q/blob/b0fa72980717dc202ffc3cbf03b936e10ebbb9d7/q.js#L1553-1563
			// This transforms all promises regardless resolved or rejected
			var translateAll = function(translationIds) {
				var results = {}; // storing the actual results
				var promises = []; // promises to wait for
				// Wraps the promise a) being always resolved and b) storing the link id->value
				var translate = function(translationId) {
					var deferred = $q.defer();
					var regardless = function(value) {
						results[translationId] = value;
						deferred.resolve([translationId, value]);
					};
					// we don't care whether the promise was resolved or rejected; just store the values
					$mbTranslate(translationId, interpolateParams, interpolationId, defaultTranslationText, forceLanguage, sanitizeStrategy).then(regardless, regardless);
					return deferred.promise;
				};
				for (var i = 0, c = translationIds.length; i < c; i++) {
					promises.push(translate(translationIds[i]));
				}
				// wait for all (including storing to results)
				return $q.all(promises).then(function() {
					// return the results
					return results;
				});
			};
			return translateAll(translationId);
		}

		var deferred = $q.defer();

		// trim off any whitespace
		if (translationId) {
			translationId = trim(translationId);
		}

		var promiseToWaitFor = (function() {
			var promise = langPromises[uses] || langPromises[$preferredLanguage];

			fallbackIndex = 0;

			if ($storageFactory && !promise) {
				// looks like there's no pending promise for $preferredLanguage or
				// $uses. Maybe there's one pending for a language that comes from
				// storage.
				var langKey = Storage.get($storageKey);
				promise = langPromises[langKey];

				if ($fallbackLanguage && $fallbackLanguage.length) {
					var index = indexOf($fallbackLanguage, langKey);
					// maybe the language from storage is also defined as fallback language
					// we increase the fallback language index to not search in that language
					// as fallback, since it's probably the first used language
					// in that case the index starts after the first element
					fallbackIndex = (index === 0) ? 1 : 0;

					// but we can make sure to ALWAYS fallback to preferred language at least
					if (indexOf($fallbackLanguage, $preferredLanguage) < 0) {
						$fallbackLanguage.push($preferredLanguage);
					}
				}
			}
			return promise;
		}());

		if (!promiseToWaitFor) {
			// no promise to wait for? okay. Then there's no loader registered
			// nor is a one pending for language that comes from storage.
			// We can just translate.
			determineTranslation(translationId, interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy).then(deferred.resolve, deferred.reject);
		} else {
			var promiseResolved = function() {
				// $uses may have changed while waiting
				if (!forceLanguage) {
					uses = $uses;
				}
				determineTranslation(translationId, interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy).then(deferred.resolve, deferred.reject);
			};
			promiseToWaitFor['finally'](promiseResolved)['catch'](angular.noop); // we don't care about errors here, already handled
		}
		return deferred.promise;
	};

	service = _.assign(service, {
		setupPreferredLanguage: setupPreferredLanguage,
		preferredLanguage: function() {
			return $preferredLanguage;
		},
		cloakClassName: cloakClassName,
		nestedObjectDelimeter: nestedObjectDelimeter,
		fallbackLanguage: fallbackLanguage,
		useFallbackLanguage: useFallbackLanguage,
		proposedLanguage: proposedLanguage,
		storage: storage,
		negotiateLocale: negotiateLocale,
		use: use,
		storageKey: function() {
			if ($storagePrefix) {
				return $storagePrefix + $storageKey;
			}
			return $storageKey;
		},
		resolveClientLocale: resolveClientLocale,
		isPostCompilingEnabled: isPostCompilingEnabled,
		isForceAsyncReloadEnabled: isForceAsyncReloadEnabled,
		isKeepContent: isKeepContent,
		refresh: refresh,
		instant: instant,
		loaderCache: loaderCache,
		statefulFilter: setStatefulFilter,
		getDirectivePriority: getDirectivePriority,
		isReady: isReady,
		onReady: onReady,
		getAvailableLanguageKeys: getAvailableLanguageKeys,
		getTranslationTable: getTranslationTable,
	});
	provider = {
		$get: function($injector) {
			injector = $injector;
			defaultInterpolator = injector.get($interpolationFactory || '$mbTranslateDefaultInterpolation');
			$q = injector.get('$q');
			$rootScope = injector.get('$rootScope');


			$onReadyDeferred = $q.defer();
			$onReadyDeferred.promise.then(function() {
				$isReady = true;
			});
			if ($storageFactory) {
				Storage = injector.get($storageFactory);

				if (!Storage.get || !Storage.put) {
					throw new Error('Couldn\'t use storage \'' + $storageFactory + '\', missing get() or put() method!');
				}
			}

			// if we have additional interpolations that were added via
			// $mbTranslateProvider.addInterpolation(), we have to map'em
			if ($interpolatorFactories.length) {
				angular.forEach($interpolatorFactories, function(interpolatorFactory) {
					var interpolator = injector.get(interpolatorFactory);
					// setting initial locale for each interpolation service
					interpolator.setLocale($preferredLanguage || $uses);
					// make'em recognizable through id
					interpolatorHashMap[interpolator.getInterpolationIdentifier()] = interpolator;
				});
			}

			// Whenever $mbTranslateReady is being fired, this will ensure the state of $isReady
			var globalOnReadyListener = $rootScope.$on('$mbTranslateReady', function() {
				$onReadyDeferred.resolve();
				globalOnReadyListener(); // one time only
				globalOnReadyListener = null;
			});
			var globalOnChangeListener = $rootScope.$on('$mbTranslateChangeEnd', function() {
				$onReadyDeferred.resolve();
				globalOnChangeListener(); // one time only
				globalOnChangeListener = null;
			});

			if ($loaderFactory) {
				// If at least one async loader is defined and there are no
				// (default) translations available we should try to load them.
				if (angular.equals($translationTable, {})) {
					if (service.use()) {
						service.use(service.use());
					}
				}
				// Also, if there are any fallback language registered, we start
				// loading them asynchronously as soon as we can.
				if ($fallbackLanguage && $fallbackLanguage.length) {
					var processAsyncResult = function(translation) {
						translations(translation.key, translation.table);
						$rootScope.$emit('$mbTranslateChangeEnd', { language: translation.key });
						return translation;
					};
					for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
						var fallbackLanguageId = $fallbackLanguage[i];
						if ($forceAsyncReloadEnabled || !$translationTable[fallbackLanguageId]) {
							langPromises[fallbackLanguageId] = loadAsync(fallbackLanguageId).then(processAsyncResult);
						}
					}
				}
			} else {
				$rootScope.$emit('$mbTranslateReady', { language: service.use() });
			}
			return service;
		},
		translations: translations,
		cloakClassName: function(name) {
			$cloakClassName = name;
			return provider;
		},
		nestedObjectDelimeter: function(delimiter) {
			$nestedObjectDelimeter = delimiter;
			return provider;
		},
		addInterpolation: addInterpolation,
		useMessageFormatInterpolation: useMessageFormatInterpolation,
		useInterpolation: useInterpolation,
		useSanitizeValueStrategy: useSanitizeValueStrategy,
		preferredLanguage: preferredLanguage,
		translationNotFoundIndicator: translationNotFoundIndicator,
		translationNotFoundIndicatorLeft: translationNotFoundIndicatorLeft,
		translationNotFoundIndicatorRight: translationNotFoundIndicatorRight,
		resolveClientLocale: resolveClientLocale,
		fallbackLanguage: function(langKey) {
			fallbackStack(langKey);
			return provider;
		},
		fallbackStack: fallbackStack,
		use: function(langKey) {
			if (!$translationTable[langKey] && (!$loaderFactory)) {
				// only throw an error, when not loading translation data asynchronously
				throw new Error('$mbTranslateProvider couldn\'t find translationTable for langKey: \'' + langKey + '\'');
			}
			$uses = langKey;
			return provider;
		},
		storageKey: function(key) {
			$storageKey = key;
			return provider;
		},
		useLoader: useLoader,
		useUrlLoader: useUrlLoader,
		useStaticFilesLoader: useStaticFilesLoader,
		useLocalStorage: useLocalStorage,
		useCookieStorage: useCookieStorage,
		useStorage: useStorage,
		storagePrefix: storagePrefix,
		useMissingTranslationHandlerLog: useMissingTranslationHandlerLog,
		useMissingTranslationHandler: useMissingTranslationHandler,
		usePostCompiling: usePostCompiling,
		forceAsyncReload: forceAsyncReload,
		uniformLanguageTag: uniformLanguageTag,
		determinePreferredLanguage: determinePreferredLanguage,
		registerAvailableLanguageKeys: registerAvailableLanguageKeys,
		useLoaderCache: useLoaderCache,
		setDirectivePriority: setDirectivePriority,
		statefulFilter: function(state) {
			// setter with chaining
			statefulFilter = state;
			return provider;
		},
		postProcess: postProcess,
		keepContent: keepContent
	};
	return provider;
}

export default mbTranslate;
