
/**
@ngdoc directive
@name mb-translate-namespace
@restrict A

@description
Translates given translation id either through attribute or DOM content.
Internally it uses `translate` filter to translate translation id. It is possible to
pass an optional `mb-translate-values` object literal as string into translation id.

@param {string=} translate namespace name which could be either string or interpolated string.

@example
   <example module="ngView">
    <file name="index.html">
      <div mb-translate-namespace="CONTENT">

        <div>
            <h1 translate>.HEADERS.TITLE</h1>
            <h1 translate>.HEADERS.WELCOME</h1>
        </div>

        <div mb-translate-namespace=".HEADERS">
            <h1 translate>.TITLE</h1>
            <h1 translate>.WELCOME</h1>
        </div>

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($mbTranslateProvider) {

        $mbTranslateProvider.translations('en',{
          'TRANSLATION_ID': 'Hello there!',
          'CONTENT': {
            'HEADERS': {
                TITLE: 'Title'
            }
          },
          'CONTENT.HEADERS.WELCOME': 'Welcome'
        }).preferredLanguage('en');

      });

    </file>
   </example>

@ngInject 
 */
export default function translateNamespaceDirective() {

	/**
	 Returns the scope's namespace.
	 @private
	 @param scope
	 @returns {string}
	 */
	function _getTranslateNamespace(scope) {
		if (scope.translateNamespace) {
			return scope.translateNamespace;
		}
		if (scope.$parent) {
			return _getTranslateNamespace(scope.$parent);
		}
	}

	function compileFn() {
		return {
			pre: function(scope, iElement, iAttrs) {
				scope.translateNamespace = _getTranslateNamespace(scope);

				if (scope.translateNamespace && iAttrs.translateNamespace.charAt(0) === '.') {
					scope.translateNamespace += iAttrs.translateNamespace;
				} else {
					scope.translateNamespace = iAttrs.translateNamespace;
				}
			}
		};
	}

	return {
		restrict: 'A',
		scope: true,
		compile: compileFn
	};
}

