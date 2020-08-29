/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateMissingTranslationHandlerLog
 * @requires $mbLog
 *
 * @description
 * Uses angular's `$mbLog` service to give a warning when trying to translate a
 * translation id which doesn't exist.
 *
 * @returns {function} Handler function
 */
mblowfish.factory('$mbTranslateMissingTranslationHandlerLog', function($mbLog) {
	'ngInject';
	return function(translationId) {
		$mbLog.warn('Translation for "' + translationId + '" doesn\'t exist');
	};
});

