/*
 * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * @ngdoc controller
 * @name MbLanguagesCtrl
 * @description Mange list of languages
 * 
 * Manages list of languages
 * 
 */
mblowfish.controller('MbLanguagesCtrl', function(
	$rootScope, $language, $mbNavigator, FileSaver,
		/* AngularJS */ $window,
		/* am-wb     */ $mbResource) {

	this.selectedLanguage = null;

	/**
	 * Set current language of app
	 * 
	 * @memberof MbLanguagesCtrl
	 * @param {object} lang - Key of the language
	 * @return {promise} to change language
	 */
	this.setLanguage = function(lang) {
		this.selectedLanguage = lang;
		this.selectedLanguage.map = this.selectedLanguage.map || {};
		this.addMissedWord();
	};

	/**
	 * Adds new language to app configuration
	 * 
	 * @memberof MbLanguagesCtrl
	 * @return {promise} to add language
	 */
	this.addLanguage = function($event) {
		$mbResource.get('/app/languages', {
			// TODO:,
			targetEvent: $event
		}).then(function(language) {
			language.map = language.map || {};
			return $language.newLanguage(language);
		});
	};

	/**
	 * Remove language form application
	 * 
	 * @memberof MbLanguagesCtrl
	 * @param {object} lang - The Language
	 * @return {promise} to delete language
	 */
	this.deleteLanguage = function(lang) {
		var ctrl = this;
		$window.confirm('Delete the language?').then(function() {
			return $language.deleteLanguage(lang);
		}).then(function() {
			if (angular.equals(ctrl.selectedLanguage, lang)) {
				ctrl.selectedLanguage = null;
			}
		});
	};

	/**
	 * Adds a word to the current language map
	 * 
	 * @memberof MbLanguagesCtrl
	 */
	this.addWord = function() {
		var ctrl = this;
		return $mbNavigator.openDialog({
			templateUrl: 'views/dialogs/mbl-add-word.html',

		})//
			.then(function(word) {
				ctrl.selectedLanguage.map[word.key] = ctrl.selectedLanguage.map[word.key] || word.translate || word.key;
			});
	};

	/**
	 * Remove the key from current language map
	 * 
	 * @memberof MbLanguagesCtrl
	 */
	this.deleteWord = function(key) {
		delete this.selectedLanguage.map[key];
	};


	/**
	 * Adds all missed keywords to the current language
	 * 
	 * @memberof MbLanguagesCtrl
	 */
	this.addMissedWord = function() {
		var mids = $rootScope.__app.settings.languageMissIds;
		var ctrl = this;
		_.forEach(mids, function(id) {
			ctrl.selectedLanguage.map[id] = ctrl.selectedLanguage.map[id] || id;
		});
	}

	/**
	 * Download the language
	 * 
	 * @memberof MbLanguagesCtrl
	 * @param {object} lang - The Language
	 */
	this.saveAs = function(lang) {
		var MIME_WB = 'application/weburger+json;charset=utf-8';

		// save  result
		var dataString = JSON.stringify(lang);
		var data = new Blob([dataString], {
			type: MIME_WB
		});
		return FileSaver.saveAs(data, 'language.json');
	};

});