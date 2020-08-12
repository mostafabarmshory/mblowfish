/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateMissingTranslationHandlerLog
 * @requires $log
 *
 * @description
 * Uses angular's `$log` service to give a warning when trying to translate a
 * translation id which doesn't exist.
 *
 * @returns {function} Handler function
 */
mblowfish.factory('$mbTranslateMissingTranslationHandlerStorage', function($mbStorage) {
	'ngInject';
	return function(translationId) {
		if (_.isUndefined($mbStorage['missing-translation'])) {
			$mbStorage['missing-translation'] = {};
		}
		$mbStorage['missing-translation'][translationId] = translationId;
	};
});

