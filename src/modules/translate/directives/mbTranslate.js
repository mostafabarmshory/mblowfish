
import {getTranslateNamespace} from '../utils';
/**
@ngdoc directive
@name pascalprecht.translate.directive:translate
@requires $interpolate,
@requires $compile,
@requires $parse,
@requires $rootScope
@restrict AE

@description
Translates given translation id either through attribute or DOM content.
Internally it uses $mbTranslate service to translate the translation id. It possible to
pass an optional `mb-translate-values` object literal as string into translation id.

@param {string=} mb-translate Translation id which could be either string or interpolated string.
@param {string=} mb-translate-values Values to pass into translation id. Can be passed as object literal string or interpolated object.
@param {string=} mb-mb-translate-attr-ATTR translate Translation id and put it into ATTR attribute.
@param {string=} mb-translate-default will be used unless translation was successful
@param {string=} mb-translate-sanitize-strategy defines locally sanitize strategy
@param {boolean=} mb-translate-compile (default true if present) defines locally activation of {@link pascalprecht.translate.$mbTranslateProvider#methods_usePostCompiling}
@param {boolean=} mb-translate-keep-content (default true if present) defines that in case a KEY could not be translated, that the existing content is left in the innerHTML}

@example
   <example module="ngView">
    <file name="index.html">
      <div ng-controller="TranslateCtrl">

        <pre mb-translate="TRANSLATION_ID"></pre>
        <pre mb-translate>TRANSLATION_ID</pre>
        <pre mb-translate mb-mb-translate-attr-title="TRANSLATION_ID"></pre>
        <pre mb-translate="{{translationId}}"></pre>
        <pre mb-translate>{{translationId}}</pre>
        <pre mb-translate="WITH_VALUES" mb-translate-values="{value: 5}"></pre>
        <pre mb-translate mb-translate-values="{value: 5}">WITH_VALUES</pre>
        <pre mb-translate="WITH_VALUES" mb-translate-values="{{values}}"></pre>
        <pre mb-translate mb-translate-values="{{values}}">WITH_VALUES</pre>
        <pre mb-translate mb-mb-translate-attr-title="WITH_VALUES" mb-translate-values="{{values}}"></pre>
        <pre mb-translate="WITH_CAMEL_CASE_KEY" mb-translate-value-camel-case-key="Hi"></pre>

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($mbTranslateProvider) {

        $mbTranslateProvider.translations('en',{
          'TRANSLATION_ID': 'Hello there!',
          'WITH_VALUES': 'The following value is dynamic: {{value}}',
          'WITH_CAMEL_CASE_KEY': 'The interpolation key is camel cased: {{camelCaseKey}}'
        }).preferredLanguage('en');

      });

      angular.module('ngView').controller('TranslateCtrl', function ($scope) {
        $scope.translationId = 'TRANSLATION_ID';

        $scope.values = {
          value: 78
        };
      });
    </file>
    <file name="scenario.js">
      it('should translate', function () {
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';

          element = $compile('<p mb-translate="TRANSLATION_ID"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p mb-translate="{{translationId}}"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p mb-translate>TRANSLATION_ID</p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p mb-translate>{{translationId}}</p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p mb-translate mb-mb-translate-attr-title="TRANSLATION_ID"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.attr('title')).toBe('Hello there!');

          element = $compile('<p mb-translate="WITH_CAMEL_CASE_KEY" mb-translate-value-camel-case-key="Hello"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('The interpolation key is camel cased: Hello');
        });
      });
    </file>
   </example>

@ngInject
 */
export default function($mbTranslate, $interpolate, $compile, $parse, $rootScope) {

	/**
	@name trim
	@private
	
	@description
	trim polyfill
	
	@returns {string} The string stripped of whitespace from both ends
	 */
	function trim() {
		return this.toString().replace(/^\s+|\s+$/g, '');
	};

	/**
	@name lowercase
	@private
	
	@description
	Return the lowercase string only if the type is string
	
	@returns {string} The string all in lowercase
	 */
	var lowercase = function(string) {
		return angular.isString(string) ? string.toLowerCase() : string;
	};

	function compileFn(tElement, tAttr) {

		var translateValuesExist = (tAttr.translateValues) ?
			tAttr.translateValues : undefined;

		var translateInterpolation = (tAttr.translateInterpolation) ?
			tAttr.translateInterpolation : undefined;

		var translateSanitizeStrategyExist = (tAttr.translateSanitizeStrategy) ?
			tAttr.translateSanitizeStrategy : undefined;

		var translateValueExist = tElement[0].outerHTML.match(/mb-translate-value-+/i);

		var interpolateRegExp = '^(.*)(' + $interpolate.startSymbol() + '.*' + $interpolate.endSymbol() + ')(.*)',
			watcherRegExp = '^(.*)' + $interpolate.startSymbol() + '(.*)' + $interpolate.endSymbol() + '(.*)';

		return function linkFn(scope, iElement, iAttr) {

			scope.interpolateParams = {};
			scope.preText = '';
			scope.postText = '';
			scope.translateNamespace = getTranslateNamespace(scope);
			var translationIds = {};

			function initInterpolationParams(interpolateParams, iAttr, tAttr) {
				// initial setup
				if (iAttr.translateValues) {
					angular.extend(interpolateParams, $parse(iAttr.translateValues)(scope.$parent));
				}
				// initially fetch all attributes if existing and fill the params
				if (translateValueExist) {
					for (var attr in tAttr) {
						if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
							var attributeName = lowercase(attr.substr(14, 1)) + attr.substr(15);
							interpolateParams[attributeName] = tAttr[attr];
						}
					}
				}
			}

			// Ensures any change of the attribute "translate" containing the id will
			// be re-stored to the scope's "translationId".
			// If the attribute has no content, the element's text value (white spaces trimmed off) will be used.
			var observeElementTranslation = function(translationId) {

				// Remove any old watcher
				if (angular.isFunction(observeElementTranslation._unwatchOld)) {
					observeElementTranslation._unwatchOld();
					observeElementTranslation._unwatchOld = undefined;
				}

				if (angular.equals(translationId, '') || !angular.isDefined(translationId)) {
					var iElementText = trim.apply(iElement.text());

					// Resolve translation id by inner html if required
					var interpolateMatches = iElementText.match(interpolateRegExp);
					// Interpolate translation id if required
					if (angular.isArray(interpolateMatches)) {
						scope.preText = interpolateMatches[1];
						scope.postText = interpolateMatches[3];
						translationIds.translate = $interpolate(interpolateMatches[2])(scope.$parent);
						var watcherMatches = iElementText.match(watcherRegExp);
						if (angular.isArray(watcherMatches) && watcherMatches[2] && watcherMatches[2].length) {
							observeElementTranslation._unwatchOld = scope.$watch(watcherMatches[2], function(newValue) {
								translationIds.translate = newValue;
								updateTranslations();
							});
						}
					} else {
						// do not assigne the translation id if it is empty.
						translationIds.translate = !iElementText ? undefined : iElementText;
					}
				} else {
					translationIds.translate = translationId;
				}
				updateTranslations();
			};

			function observeAttributeTranslation(translateAttr) {
				iAttr.$observe(translateAttr, function(translationId) {
					translationIds[translateAttr] = translationId;
					updateTranslations();
				});
			};

			// initial setup with values
			initInterpolationParams(scope.interpolateParams, iAttr, tAttr);

			var firstAttributeChangedEvent = true;
			iAttr.$observe('translate', function(translationId) {
				if (typeof translationId === 'undefined') {
					// case of element "<translate>xyz</translate>"
					observeElementTranslation('');
				} else {
					// case of regular attribute
					if (translationId !== '' || !firstAttributeChangedEvent) {
						translationIds.translate = translationId;
						updateTranslations();
					}
				}
				firstAttributeChangedEvent = false;
			});

			for (var translateAttr in iAttr) {
				if (iAttr.hasOwnProperty(translateAttr) && translateAttr.substr(0, 13) === 'translateAttr' && translateAttr.length > 13) {
					observeAttributeTranslation(translateAttr);
				}
			}

			iAttr.$observe('translateDefault', function(value) {
				scope.defaultText = value;
				updateTranslations();
			});

			if (translateSanitizeStrategyExist) {
				iAttr.$observe('translateSanitizeStrategy', function(value) {
					scope.sanitizeStrategy = $parse(value)(scope.$parent);
					updateTranslations();
				});
			}

			if (translateValuesExist) {
				iAttr.$observe('translateValues', function(interpolateParams) {
					if (interpolateParams) {
						scope.$parent.$watch(function() {
							angular.extend(scope.interpolateParams, $parse(interpolateParams)(scope.$parent));
						});
					}
				});
			}

			if (translateValueExist) {
				var observeValueAttribute = function(attrName) {
					iAttr.$observe(attrName, function(value) {
						var attributeName = lowercase(attrName.substr(14, 1)) + attrName.substr(15);
						scope.interpolateParams[attributeName] = value;
					});
				};
				for (var attr in iAttr) {
					if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
						observeValueAttribute(attr);
					}
				}
			}

			// Master update function
			var updateTranslations = function() {
				for (var key in translationIds) {
					if (translationIds.hasOwnProperty(key) && translationIds[key] !== undefined) {
						updateTranslation(key, translationIds[key], scope, scope.interpolateParams, scope.defaultText, scope.translateNamespace);
					}
				}
			};

			// Put translation processing function outside loop
			var updateTranslation = function(translateAttr, translationId, scope, interpolateParams, defaultTranslationText, translateNamespace) {
				if (translationId) {
					// if translation id starts with '.' and translateNamespace given, prepend namespace
					if (translateNamespace && translationId.charAt(0) === '.') {
						translationId = translateNamespace + translationId;
					}

					$mbTranslate(translationId, interpolateParams, translateInterpolation, defaultTranslationText, scope.translateLanguage, scope.sanitizeStrategy)
						.then(function(translation) {
							applyTranslation(translation, scope, true, translateAttr);
						}, function(translationId) {
							applyTranslation(translationId, scope, false, translateAttr);
						});
				} else {
					// as an empty string cannot be translated, we can solve this using successful=false
					applyTranslation(translationId, scope, false, translateAttr);
				}
			};

			var applyTranslation = function(value, scope, successful, translateAttr) {
				if (!successful) {
					if (typeof scope.defaultText !== 'undefined') {
						value = scope.defaultText;
					}
				}
				if (translateAttr === 'translate') {
					// default translate into innerHTML
					if (successful || (!successful && !$mbTranslate.isKeepContent() && typeof iAttr.translateKeepContent === 'undefined')) {
						iElement.empty().append(scope.preText + value + scope.postText);
					}
					var globallyEnabled = $mbTranslate.isPostCompilingEnabled();
					var locallyDefined = typeof tAttr.translateCompile !== 'undefined';
					var locallyEnabled = locallyDefined && tAttr.translateCompile !== 'false';
					if ((globallyEnabled && !locallyDefined) || locallyEnabled) {
						$compile(iElement.contents())(scope);
					}
				} else {
					// translate attribute
					var attributeName = iAttr.$attr[translateAttr];
					if (attributeName.substr(0, 5) === 'data-') {
						// ensure html5 data prefix is stripped
						attributeName = attributeName.substr(5);
					}
					attributeName = attributeName.substr(15);
					iElement.attr(attributeName, value);
				}
			};

			if (translateValuesExist || translateValueExist || iAttr.translateDefault) {
				scope.$watch('interpolateParams', updateTranslations, true);
			}

			// Replaced watcher on translateLanguage with event listener
			scope.$on('translateLanguageChanged', updateTranslations);

			// Ensures the text will be refreshed after the current language was changed
			// w/ $mbTranslate.use(...)
			var unbind = $rootScope.$on('$mbTranslateChangeSuccess', updateTranslations);

			// ensure translation will be looked up at least one
			if (iElement.text().length) {
				if (iAttr.translate) {
					observeElementTranslation(iAttr.translate);
				} else {
					observeElementTranslation('');
				}
			} else if (iAttr.translate) {
				// ensure attribute will be not skipped
				observeElementTranslation(iAttr.translate);
			}
			updateTranslations();
			scope.$on('$destroy', unbind);
		};
	}

	return {
		restrict: 'AE',
		scope: true,
		priority: $mbTranslate.getDirectivePriority(),
		compile: compileFn
	};
}

