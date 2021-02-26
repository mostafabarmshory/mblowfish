

/**
 * Returns the scope's namespace.
 * @private
 * @param scope
 * @returns {string}
 */
export function getTranslateNamespace(scope) {
	'use strict';
	if (scope.translateNamespace) {
		return scope.translateNamespace;
	}
	if (scope.$parent) {
		return getTranslateNamespace(scope.$parent);
	}
}

export function watchAttribute(scope, attribute, valueCallback, changeCallback) {
	'use strict';
	if (!attribute) {
		return;
	}
	if (attribute.substr(0, 2) === '::') {
		attribute = attribute.substr(2);
	} else {
		scope.$watch(attribute, function(newValue) {
			valueCallback(newValue);
			changeCallback();
		}, true);
	}
	valueCallback(scope.$eval(attribute));
}

export default {
	getTranslateNamespace: getTranslateNamespace,
	watchAttribute: watchAttribute
};