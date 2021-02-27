
/**

@ngInject
 */
function mblowfishPrepareTranslateRun($mbTranslate, $mbSettings) {

	var key = $mbSettings.get(SETTING_LOCAL_LANGUAGE, $mbTranslate.storageKey()),
		storage = $mbTranslate.storage();

	var fallbackFromIncorrectStorageValue = function() {
		var preferred = $mbTranslate.preferredLanguage();
		if (angular.isString(preferred)) {
			$mbTranslate.use(preferred);
			// $mbTranslate.use() will also remember the language.
			// So, we don't need to call storage.put() here.
		} else {
			storage.put(key, $mbTranslate.use());
		}
	};

	fallbackFromIncorrectStorageValue.displayName = 'fallbackFromIncorrectStorageValue';

	if (storage) {
		if (!storage.get(key)) {
			fallbackFromIncorrectStorageValue();
		} else {
			$mbTranslate.use(storage.get(key))['catch'](fallbackFromIncorrectStorageValue);
		}
	} else if (angular.isString($mbTranslate.preferredLanguage())) {
		$mbTranslate.use($mbTranslate.preferredLanguage());
	}
}

export default mblowfishPrepareTranslateRun;