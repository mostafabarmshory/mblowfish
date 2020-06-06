/**
@ngdoc directive
@name mb-translate-language
@restrict A

@description
Forces the language to the directives in the underlying scope.

@param {string=} translate language that will be negotiated.

@example
   <example module="ngView">
    <file name="index.html">
      <div>

        <div>
            <h1 translate>HELLO</h1>
        </div>

        <div mb-translate-language="de">
            <h1 translate>HELLO</h1>
        </div>

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($mbTranslateProvider) {

        $mbTranslateProvider
          .translations('en',{
            'HELLO': 'Hello world!'
          })
          .translations('de',{
            'HELLO': 'Hallo Welt!'
          })
          .preferredLanguage('en');

      });

    </file>
   </example>
 */
mblowfish.directive('mbTranslateLanguage', function() {

	function compileFn() {
		return function linkFn(scope, iElement, iAttrs) {

			iAttrs.$observe('mbTranslateLanguage', function(newTranslateLanguage) {
				scope.translateLanguage = newTranslateLanguage;
			});

			scope.$watch('mbTranslateLanguage', function() {
				scope.$broadcast('mbTranslateLanguageChanged');
			});
		};
	}

	return {
		restrict: 'A',
		scope: true,
		compile: compileFn
	};
});

