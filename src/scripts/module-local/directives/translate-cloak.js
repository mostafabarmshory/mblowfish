
/**
@ngdoc directive
@name mb-translate-cloak
@requires $mbTranslate
@restrict A

$description
Adds a `mb-translate-cloak` class name to the given element where this directive
is applied initially and removes it, once a loader has finished loading.

This directive can be used to prevent initial flickering when loading translation
data asynchronously.

The class name is defined in
{@link pascalprecht.translate.$mbTranslateProvider#cloakClassName $mbTranslate.cloakClassName()}.

@param {string=} mb-translate-cloak If a translationId is provided, it will be used for showing
                                 or hiding the cloak. Basically it relies on the translation
                                 resolve.
 */
mblowfish.directive('mbTranslateCloak', function($mbTranslate, $rootScope) {

	function compileFn(tElement) {
		function applyCloak(element) {
			element.addClass($mbTranslate.cloakClassName());
		}
		function removeCloak(element) {
			element.removeClass($mbTranslate.cloakClassName());
		}
		applyCloak(tElement);

		return function linkFn(scope, iElement, iAttr) {
			//Create bound functions that incorporate the active DOM element.
			var iRemoveCloak = removeCloak.bind(this, iElement), iApplyCloak = applyCloak.bind(this, iElement);
			if (iAttr.translateCloak && iAttr.translateCloak.length) {
				// Register a watcher for the defined translation allowing a fine tuned cloak
				iAttr.$observe('mbTranslateCloak', function(translationId) {
					$mbTranslate(translationId).then(iRemoveCloak, iApplyCloak);
				});
				$rootScope.$on('$mbTranslateChangeSuccess', function() {
					$mbTranslate(iAttr.translateCloak).then(iRemoveCloak, iApplyCloak);
				});
			} else {
				$mbTranslate.onReady(iRemoveCloak);
			}
		};
	}

	return {
		compile: compileFn
	};
});

