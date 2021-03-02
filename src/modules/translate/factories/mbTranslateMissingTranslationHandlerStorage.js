/**
@ngdoc object
@name pascalprecht.translate.$translateMissingTranslationHandlerLog
@requires $mbLog

@description
Uses angular's `$mbLog` service to give a warning when trying to translate a
translation id which doesn't exist.

@returns {function} Handler function

@ngInject
 */
export default function($mbStorage) {
	return function(translationId) {
		if (_.isUndefined($mbStorage['missing-translation'])) {
			$mbStorage['missing-translation'] = {};
		}
		$mbStorage['missing-translation'][translationId] = translationId;
	};
}

