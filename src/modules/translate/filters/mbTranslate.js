
/**
@ngdoc filter
@name pascalprecht.translate.filter:translate
@requires $parse
@requires pascalprecht.translate.$mbTranslate
@function

@description
Uses `$mbTranslate` service to translate contents. Accepts interpolate parameters
to pass dynamized values though translation.

@param {string} translationId A translation id to be translated.
@param {*=} interpolateParams Optional object literal (as hash or string) to pass values into translation.

@returns {string} Translated text.

@example
<example module="ngView">
 <file name="index.html">
   <div ng-controller="TranslateCtrl">

     <pre>{{ 'TRANSLATION_ID' | translate }}</pre>
     <pre>{{ translationId | translate }}</pre>
     <pre>{{ 'WITH_VALUES' | translate:'{value: 5}' }}</pre>
     <pre>{{ 'WITH_VALUES' | translate:values }}</pre>

   </div>
 </file>
 <file name="script.js">
   angular.module('ngView', ['pascalprecht.translate'])

   .config(function ($mbTranslateProvider) {

     $mbTranslateProvider.translations('en', {
       'TRANSLATION_ID': 'Hello there!',
       'WITH_VALUES': 'The following value is dynamic: {{value}}'
     });
     $mbTranslateProvider.preferredLanguage('en');

   });

   angular.module('ngView').controller('TranslateCtrl', function ($scope) {
     $scope.translationId = 'TRANSLATION_ID';

     $scope.values = {
       value: 78
     };
   });
 </file>
</example>

@ngInject
 */
function mbTranslate($parse, $mbTranslate) {

	var translateFilter = function(translationId, interpolateParams, interpolation, forceLanguage) {
		if (!angular.isObject(interpolateParams)) {
			var ctx = this || {
				'__SCOPE_IS_NOT_AVAILABLE': 'More info at https://github.com/angular/angular.js/commit/8863b9d04c722b278fa93c5d66ad1e578ad6eb1f'
			};
			interpolateParams = $parse(interpolateParams)(ctx);
		}

		return $mbTranslate.instant(translationId, interpolateParams, interpolation, forceLanguage);
	};

	if ($mbTranslate.statefulFilter()) {
		translateFilter.$stateful = true;
	}

	return translateFilter;
}

export default mbTranslate;
