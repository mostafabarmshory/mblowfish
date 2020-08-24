/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

mblowfish
	.config(function($mbPreferencesProvider, $mdDateLocaleProvider, $mbResourceProvider) {
		// Format and parse dates based on moment's 'L'-format
		// 'L'-format may later be changed
		$mdDateLocaleProvider.parseDate = function(dateString) {
			var m = moment(dateString, 'L', true);
			return m.isValid() ? m.toDate() : new Date(NaN);
		};

		$mdDateLocaleProvider.formatDate = function(date) {
			var m = moment(date);
			return m.isValid() ? m.format('L') : '';
		};
		///*
		//		// Pages
		//		$mbPreferencesProvider
		//			.addPage('brand', {
		//				title: 'Branding',
		//				icon: 'copyright',
		//				templateUrl: 'views/preferences/mb-brand.html',
		//				// controller : 'settingsBrandCtrl',
		//				controllerAs: 'ctrl'
		//			});*/


		$mbResourceProvider
			.addPage('language', {
				label: 'Custom',
				templateUrl: 'views/resources/mb-language-custome.html',
				controller: 'MbLocalResourceLanguageCustomCtrl',
				controllerAs: 'resourceCtrl',
				tags: ['/app/languages', 'language']
			})
			.addPage('language.viraweb123', {
				label: 'Common',
				templateUrl: 'views/resources/mb-language-list.html',
				controller: 'MbLocalResourceLanguageCommonCtrl',
				controllerAs: 'resourceCtrl',
				tags: ['/app/languages', 'language']
			})
			.addPage('language.upload', {
				label: 'Upload',
				templateUrl: 'views/resources/mb-language-upload.html',
				controller: 'MbLocalResourceLanguageUploadCtrl',
				controllerAs: 'resourceCtrl',
				tags: ['/app/languages', 'language']
			});
	})
	.run(function runTranslate($mbTranslate, $mbSettings) {

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
	});



/**
 * Returns the scope's namespace.
 * @private
 * @param scope
 * @returns {string}
 */
function getTranslateNamespace(scope) {
	'use strict';
	if (scope.translateNamespace) {
		return scope.translateNamespace;
	}
	if (scope.$parent) {
		return getTranslateNamespace(scope.$parent);
	}
}

function watchAttribute(scope, attribute, valueCallback, changeCallback) {
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