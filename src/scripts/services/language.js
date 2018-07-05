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
'use strict';

angular.module('mblowfish-core')

/**
 * @ngdoc Services
 * @name $language
 * @description 
 * Manages languages of the application.
 * This service provide functionality to switch between multiple languages.
 * Also provides functionlity to manage languages (add, remove or edit translations).
 * 
 */
.service('$language', function($rootScope, $q, $navigator, $translate, $app) {

	/**
	 * Returns language determined by given key.
	 * 
	 * @memberof $language
	 * @param {string} language key - Key of the language
	 * @return {object}  Returns language with given key. 
	 * Returns 'undefined' if language does not exist or is not loaded yet.
	 */
	function language(key) {
		var languages = $rootScope.app.config.languages;
		if(!languages || !languages.length){
			return undefined;
		}
		for(var i=0; i<languages.length; i++){			
			if(languages[i].key === key){
				return languages[i];
			}
		}
		return undefined;
	}

	/**
	 * Returns list of defined and loaded languages.
	 * It returns a promise of an object which field 'items' of the object is an array of languages.
	 * 
	 * @memberof $language
	 * @return {promise<Array>} of languages
	 */
	function languages() {
		return $app.config('languages')//
		.then(function(langs){
			var res = {items : langs || []};
			return res;
		});
//		return $q.resolve({
//			items : $rootScope.app.config.languages || []
//		});
	}

	/**
	 * Adds a new language
	 * 
	 * @param {object} lang - Object contain information of a language.
	 * 		A language object would contain following properties:
	 * 
	 * 		- key: a key to determin language (for example fa, en and so on)
	 * 		- title: title for language (for example Persian, English, ...)
	 * 		- dir: direction of language ('ltr' or 'rtl')
	 * 		- map: translation table of language contains some key-values. 
	 * 
	 * @memberof $language
	 */
	function newLanguage(lang) {
		if(!$rootScope.app.user.owner){
			return $q.reject('not allowed');
		}
		if(!$rootScope.app.config.languages){
			$rootScope.app.config.languages = [];
		}
		$rootScope.app.config.languages.push(lang);
		$translate.refresh(lang.key);
		return $q.resolve(lang);
	}

	/**
	 * Delete a language
	 * 
	 * @memberof $language
	 * @param {object|string} lang - The Language to delete or key of language to delete
	 * @return {promise} promise of deleted language
	 */
	function deleteLanguage(lang){
		if(!$rootScope.app.user.owner){
			return $q.reject('not allowed');
		}
		var languages = $rootScope.app.config.langauges;
		if(!languages || !languages.length){
			return $q.reject('Not found');
		}
		var index = -1;
		if(angular.isString(lang)){
			// lang is key of language
			for(var i=0 ; i<langauges.length; i++){				
				if(langauges[i].key === lang){
					index = i;
					break;
				}
			}
		}else{			
			index = languages.indexOf(lang);
		}
		
	    if (index !== -1) {
	    	languages.splice(index, 1);
	    	return $q.resolve(lang);
	    }
    	return $q.reject('Not found');
	}

	/**
	 * Returns the language key of language that is currently loaded asynchronously.
	 * 
	 * @memberof $language
	 * @return {string} language key
	 */
	function proposedLanguage() {
		return $translate.proposedLanguage();
	}

	/**
	 * Tells angular-translate which language to use by given language key. This 
	 * method is used to change language at runtime. It also takes care of 
	 * storing the language key in a configured store to let your app remember 
	 * the choosed language.
	 *
	 * When trying to 'use' a language which isn't available it tries to load it 
	 * asynchronously with registered loaders.
	 * 
	 * Returns promise object with loaded language file data or string of the 
	 * currently used language.
	 * 
	 * If no or a falsy key is given it returns the currently used language key. 
	 * The returned string will be undefined if setting up $translate hasn't 
	 * finished.
	 * 
	 * @memberof $language
	 * @param {string} key - Feature description.Language key
	 * @return {Promise} Promise with loaded language data or the language key if a falsy param was given.
	 * 
	 */
	function use(key) {
		if(!key){
			return $translate.use();
		}
		if(!language(key)){
			$translate.refresh(key);
		}
		return $translate.use(key);
	}
	/*
	 * Service struct
	 */
	return {
		language : language,
		languages : languages,
		newLanguage : newLanguage,
		deleteLanguage: deleteLanguage,
		proposedLanguage : proposedLanguage,
		use: use
	};
});