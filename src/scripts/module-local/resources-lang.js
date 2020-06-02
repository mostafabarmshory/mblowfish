///*
// * Copyright (c) 2015-2025 Phoinex Scholars Co. http://dpq.co.ir
// * 
// * Permission is hereby granted, free of charge, to any person obtaining a copy
// * of this software and associated documentation files (the "Software"), to deal
// * in the Software without restriction, including without limitation the rights
// * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// * copies of the Software, and to permit persons to whom the Software is
// * furnished to do so, subject to the following conditions:
// * 
// * The above copyright notice and this permission notice shall be included in all
// * copies or substantial portions of the Software.
// * 
// * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// * SOFTWARE.
// */
//'use strict';
//
///*
// * Adds language resources
// * 
// */
//angular.module('mblowfish-core').run(function($language, 
//		/* angularjs */ $rootScope, $timeout, $q, $http,
//		/* am-wb-core */ $mbResource) {
//
//	var languages = [
//		{
//			key: 'ab',
//			title: 'Abkhaz'
//		},
//		{
//			key: 'aa',
//			title: 'Afar'
//		},
//		{
//			key: 'af',
//			title: 'Afrikaans'
//		},
//		{
//			key: 'ak',
//			title: 'Akan'
//		},
//		{
//			key: 'sq',
//			title: 'Albanian'
//		},
//		{
//			key: 'am',
//			title: 'Amharic'
//		},
//		{
//			key: 'ar',
//			title: 'Arabic'
//		},
//		{
//			key: 'an',
//			title: 'Aragonese'
//		},
//		{
//			key: 'hy',
//			title: 'Armenian'
//		},
//		{
//			key: 'as',
//			title: 'Assamese'
//		},
//		{
//			key: 'av',
//			title: 'Avaric'
//		},
//		{
//			key: 'ae',
//			title: 'Avestan'
//		},
//		{
//			key: 'ay',
//			title: 'Aymara'
//		},
//		{
//			key: 'az',
//			title: 'Azerbaijani'
//		},
//		{
//			key: 'bm',
//			title: 'Bambara'
//		},
//		{
//			key: 'ba',
//			title: 'Bashkir'
//		},
//		{
//			key: 'eu',
//			title: 'Basque'
//		},
//		{
//			key: 'be',
//			title: 'Belarusian'
//		},
//		{
//			key: 'bn',
//			title: 'Bengali; Bangla'
//		},
//		{
//			key: 'bh',
//			title: 'Bihari'
//		},
//		{
//			key: 'bi',
//			title: 'Bislama'
//		},
//		{
//			key: 'bs',
//			title: 'Bosnian'
//		},
//		{
//			key: 'br',
//			title: 'Breton'
//		},
//		{
//			key: 'bg',
//			title: 'Bulgarian'
//		},
//		{
//			key: 'my',
//			title: 'Burmese'
//		},
//		{
//			key: 'ca',
//			title: 'Catalan; Valencian'
//		},
//		{
//			key: 'ch',
//			title: 'Chamorro'
//		},
//		{
//			key: 'ce',
//			title: 'Chechen'
//		},
//		{
//			key: 'ny',
//			title: 'Chichewa; Chewa; Nyanja'
//		},
//		{
//			key: 'zh',
//			title: 'Chinese'
//		},
//		{
//			key: 'cv',
//			title: 'Chuvash'
//		},
//		{
//			key: 'kw',
//			title: 'Cornish'
//		},
//		{
//			key: 'co',
//			title: 'Corsican'
//		},
//		{
//			key: 'cr',
//			title: 'Cree'
//		},
//		{
//			key: 'hr',
//			title: 'Croatian'
//		},
//		{
//			key: 'cs',
//			title: 'Czech'
//		},
//		{
//			key: 'da',
//			title: 'Danish'
//		},
//		{
//			key: 'dv',
//			title: 'Divehi; Dhivehi; Maldivian;'
//		},
//		{
//			key: 'nl',
//			title: 'Dutch'
//		},
//		{
//			key: 'dz',
//			title: 'Dzongkha'
//		},
//		{
//			key: 'en',
//			title: 'English'
//		},
//		{
//			key: 'eo',
//			title: 'Esperanto'
//		},
//		{
//			key: 'et',
//			title: 'Estonian'
//		},
//		{
//			key: 'ee',
//			title: 'Ewe'
//		},
//		{
//			key: 'fo',
//			title: 'Faroese'
//		},
//		{
//			key: 'fj',
//			title: 'Fijian'
//		},
//		{
//			key: 'fi',
//			title: 'Finnish'
//		},
//		{
//			key: 'fr',
//			title: 'French'
//		},
//		{
//			key: 'ff',
//			title: 'Fula; Fulah; Pulaar; Pular'
//		},
//		{
//			key: 'gl',
//			title: 'Galician'
//		},
//		{
//			key: 'ka',
//			title: 'Georgian'
//		},
//		{
//			key: 'de',
//			title: 'German'
//		},
//		{
//			key: 'el',
//			title: 'Greek, Modern'
//		},
//		{
//			key: 'gn',
//			title: 'GuaranÃ­'
//		},
//		{
//			key: 'gu',
//			title: 'Gujarati'
//		},
//		{
//			key: 'ht',
//			title: 'Haitian; Haitian Creole'
//		},
//		{
//			key: 'ha',
//			title: 'Hausa'
//		},
//		{
//			key: 'he',
//			title: 'Hebrew (modern)'
//		},
//		{
//			key: 'hz',
//			title: 'Herero'
//		},
//		{
//			key: 'hi',
//			title: 'Hindi'
//		},
//		{
//			key: 'ho',
//			title: 'Hiri Motu'
//		},
//		{
//			key: 'hu',
//			title: 'Hungarian'
//		},
//		{
//			key: 'ia',
//			title: 'Interlingua'
//		},
//		{
//			key: 'id',
//			title: 'Indonesian'
//		},
//		{
//			key: 'ie',
//			title: 'Interlingue'
//		},
//		{
//			key: 'ga',
//			title: 'Irish'
//		},
//		{
//			key: 'ig',
//			title: 'Igbo'
//		},
//		{
//			key: 'ik',
//			title: 'Inupiaq'
//		},
//		{
//			key: 'io',
//			title: 'Ido'
//		},
//		{
//			key: 'is',
//			title: 'Icelandic'
//		},
//		{
//			key: 'it',
//			title: 'Italian'
//		},
//		{
//			key: 'iu',
//			title: 'Inuktitut'
//		},
//		{
//			key: 'ja',
//			title: 'Japanese'
//		},
//		{
//			key: 'jv',
//			title: 'Javanese'
//		},
//		{
//			key: 'kl',
//			title: 'Kalaallisut, Greenlandic'
//		},
//		{
//			key: 'kn',
//			title: 'Kannada'
//		},
//		{
//			key: 'kr',
//			title: 'Kanuri'
//		},
//		{
//			key: 'ks',
//			title: 'Kashmiri'
//		},
//		{
//			key: 'kk',
//			title: 'Kazakh'
//		},
//		{
//			key: 'km',
//			title: 'Khmer'
//		},
//		{
//			key: 'ki',
//			title: 'Kikuyu, Gikuyu'
//		},
//		{
//			key: 'rw',
//			title: 'Kinyarwanda'
//		},
//		{
//			key: 'ky',
//			title: 'Kyrgyz'
//		},
//		{
//			key: 'kv',
//			title: 'Komi'
//		},
//		{
//			key: 'kg',
//			title: 'Kongo'
//		},
//		{
//			key: 'ko',
//			title: 'Korean'
//		},
//		{
//			key: 'ku',
//			title: 'Kurdish'
//		},
//		{
//			key: 'kj',
//			title: 'Kwanyama, Kuanyama'
//		},
//		{
//			key: 'la',
//			title: 'Latin'
//		},
//		{
//			key: 'lb',
//			title: 'Luxembourgish, Letzeburgesch'
//		},
//		{
//			key: 'lg',
//			title: 'Ganda'
//		},
//		{
//			key: 'li',
//			title: 'Limburgish, Limburgan, Limburger'
//		},
//		{
//			key: 'ln',
//			title: 'Lingala'
//		},
//		{
//			key: 'lo',
//			title: 'Lao'
//		},
//		{
//			key: 'lt',
//			title: 'Lithuanian'
//		},
//		{
//			key: 'lu',
//			title: 'Luba-Katanga'
//		},
//		{
//			key: 'lv',
//			title: 'Latvian'
//		},
//		{
//			key: 'gv',
//			title: 'Manx'
//		},
//		{
//			key: 'mk',
//			title: 'Macedonian'
//		},
//		{
//			key: 'mg',
//			title: 'Malagasy'
//		},
//		{
//			key: 'ms',
//			title: 'Malay'
//		},
//		{
//			key: 'ml',
//			title: 'Malayalam'
//		},
//		{
//			key: 'mt',
//			title: 'Maltese'
//		},
//		{
//			key: 'mi',
//			title: 'MÄori'
//		},
//		{
//			key: 'mr',
//			title: 'Marathi (MarÄá¹­hÄ«)'
//		},
//		{
//			key: 'mh',
//			title: 'Marshallese'
//		},
//		{
//			key: 'mn',
//			title: 'Mongolian'
//		},
//		{
//			key: 'na',
//			title: 'Nauru'
//		},
//		{
//			key: 'nv',
//			title: 'Navajo, Navaho'
//		},
//		{
//			key: 'nb',
//			title: 'Norwegian BokmÃ¥l'
//		},
//		{
//			key: 'nd',
//			title: 'North Ndebele'
//		},
//		{
//			key: 'ne',
//			title: 'Nepali'
//		},
//		{
//			key: 'ng',
//			title: 'Ndonga'
//		},
//		{
//			key: 'nn',
//			title: 'Norwegian Nynorsk'
//		},
//		{
//			key: 'no',
//			title: 'Norwegian'
//		},
//		{
//			key: 'ii',
//			title: 'Nuosu'
//		},
//		{
//			key: 'nr',
//			title: 'South Ndebele'
//		},
//		{
//			key: 'oc',
//			title: 'Occitan'
//		},
//		{
//			key: 'oj',
//			title: 'Ojibwe, Ojibwa'
//		},
//		{
//			key: 'cu',
//			title: 'Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic'
//		},
//		{
//			key: 'om',
//			title: 'Oromo'
//		},
//		{
//			key: 'or',
//			title: 'Oriya'
//		},
//		{
//			key: 'os',
//			title: 'Ossetian, Ossetic'
//		},
//		{
//			key: 'pa',
//			title: 'Panjabi, Punjabi'
//		},
//		{
//			key: 'pi',
//			title: 'PÄli'
//		},
//		{
//			key: 'fa',
//			title: 'Persian (Farsi)'
//		},
//		{
//			key: 'pl',
//			title: 'Polish'
//		},
//		{
//			key: 'ps',
//			title: 'Pashto, Pushto'
//		},
//		{
//			key: 'pt',
//			title: 'Portuguese'
//		},
//		{
//			key: 'qu',
//			title: 'Quechua'
//		},
//		{
//			key: 'rm',
//			title: 'Romansh'
//		},
//		{
//			key: 'rn',
//			title: 'Kirundi'
//		},
//		{
//			key: 'ro',
//			title: 'Romanian, [])'
//		},
//		{
//			key: 'ru',
//			title: 'Russian'
//		},
//		{
//			key: 'sa',
//			title: 'Sanskrit (Saá¹ská¹›ta)'
//		},
//		{
//			key: 'sc',
//			title: 'Sardinian'
//		},
//		{
//			key: 'sd',
//			title: 'Sindhi'
//		},
//		{
//			key: 'se',
//			title: 'Northern Sami'
//		},
//		{
//			key: 'sm',
//			title: 'Samoan'
//		},
//		{
//			key: 'sg',
//			title: 'Sango'
//		},
//		{
//			key: 'sr',
//			title: 'Serbian'
//		},
//		{
//			key: 'gd',
//			title: 'Scottish Gaelic; Gaelic'
//		},
//		{
//			key: 'sn',
//			title: 'Shona'
//		},
//		{
//			key: 'si',
//			title: 'Sinhala, Sinhalese'
//		},
//		{
//			key: 'sk',
//			title: 'Slovak'
//		},
//		{
//			key: 'sl',
//			title: 'Slovene'
//		},
//		{
//			key: 'so',
//			title: 'Somali'
//		},
//		{
//			key: 'st',
//			title: 'Southern Sotho'
//		},
//		{
//			key: 'az',
//			title: 'South Azerbaijani'
//		},
//		{
//			key: 'es',
//			title: 'Spanish; Castilian'
//		},
//		{
//			key: 'su',
//			title: 'Sundanese'
//		},
//		{
//			key: 'sw',
//			title: 'Swahili'
//		},
//		{
//			key: 'ss',
//			title: 'Swati'
//		},
//		{
//			key: 'sv',
//			title: 'Swedish'
//		},
//		{
//			key: 'ta',
//			title: 'Tamil'
//		},
//		{
//			key: 'te',
//			title: 'Telugu'
//		},
//		{
//			key: 'tg',
//			title: 'Tajik'
//		},
//		{
//			key: 'th',
//			title: 'Thai'
//		},
//		{
//			key: 'ti',
//			title: 'Tigrinya'
//		},
//		{
//			key: 'bo',
//			title: 'Tibetan Standard, Tibetan, Central'
//		},
//		{
//			key: 'tk',
//			title: 'Turkmen'
//		},
//		{
//			key: 'tl',
//			title: 'Tagalog'
//		},
//		{
//			key: 'tn',
//			title: 'Tswana'
//		},
//		{
//			key: 'to',
//			title: 'Tonga (Tonga Islands)'
//		},
//		{
//			key: 'tr',
//			title: 'Turkish'
//		},
//		{
//			key: 'ts',
//			title: 'Tsonga'
//		},
//		{
//			key: 'tt',
//			title: 'Tatar'
//		},
//		{
//			key: 'tw',
//			title: 'Twi'
//		},
//		{
//			key: 'ty',
//			title: 'Tahitian'
//		},
//		{
//			key: 'ug',
//			title: 'Uyghur, Uighur'
//		},
//		{
//			key: 'uk',
//			title: 'Ukrainian'
//		},
//		{
//			key: 'ur',
//			title: 'Urdu'
//		},
//		{
//			key: 'uz',
//			title: 'Uzbek'
//		},
//		{
//			key: 've',
//			title: 'Venda'
//		},
//		{
//			key: 'vi',
//			title: 'Vietnamese'
//		},
//		{
//			key: 'vo',
//			title: 'VolapÃ¼k'
//		},
//		{
//			key: 'wa',
//			title: 'Walloon'
//		},
//		{
//			key: 'cy',
//			title: 'Welsh'
//		},
//		{
//			key: 'wo',
//			title: 'Wolof'
//		},
//		{
//			key: 'fy',
//			title: 'Western Frisian'
//		},
//		{
//			key: 'xh',
//			title: 'Xhosa'
//		},
//		{
//			key: 'yi',
//			title: 'Yiddish'
//		},
//		{
//			key: 'yo',
//			title: 'Yoruba'
//		},
//		{
//			key: 'za',
//			title: 'Zhuang, Chuang'
//		},
//		{
//			key: 'zu',
//			title: 'Zulu'
//		}
//		];
//
//	/**
//	 * Create filter function for a query string
//	 */
//	function createFilterFor(query) {
//		var lowercaseQuery = query.toLowerCase();
//
//		return function filterFn(language) {
//			return (language.title.indexOf(lowercaseQuery) >= 0) ||
//			(language.key.indexOf(lowercaseQuery) >= 0);
//		};
//
//	}
//
//	/**
//	 * @ngdoc Resources
//	 * @name Custom Language
//	 * @description Create a custom language and return the result
//	 *
//	 * A custom language is a key, title, and map
//	 */
//	$mbResource.newPage({
//		label: 'Custom',
//		type: 'language',
//		templateUrl: 'views/resources/mb-language-custome.html',
//		/*
//		 * @ngInject
//		 */
//		controller: function ($scope) {
//			$scope.language = $scope.value;
//
//			this.querySearch = function(query){
//				var results = query ? languages.filter(createFilterFor(query)) : languages;
//				var deferred = $q.defer();
//				$timeout(function () { 
//					deferred.resolve(results); 
//				}, Math.random() * 100, false);
//				return deferred.promise;
//			};
//
//			$scope.$watch('language', function(lang){
//				$scope.$parent.setValue(lang);
//			});
//		},
//		controllerAs: 'resourceCtrl',
//		priority: 8,
//		tags: ['/app/languages']
//	});
//
//	/**
//	 * @ngdoc Resources
//	 * @name Remote Languages
//	 * @description Create a custom language and return the result
//	 *
//	 * A custom language is a key, title, and map
//	 */
//	$mbResource.newPage({
//		label: 'Remote',
//		type: 'language-viraweb123',
//		templateUrl: 'views/resources/mb-language-list.html',
//		/*
//		 * @ngInject
//		 */
//		controller: function ($scope) {
//			$http.get('resources/common-languages.json')
//			.then(function(res){
//				$scope.languages = res.data;
//			});
//
//			this.setLanguage = function(lang){
//				$scope.$parent.setValue(lang);
//			};
//
//		},
//		controllerAs: 'resourceCtrl',
//		priority: 8,
//		tags: ['/app/languages']
//	});
//
//
//	/**
//	 * @ngdoc Resources
//	 * @name Remote Languages
//	 * @description Create a custom language and return the result
//	 *
//	 * A custom language is a key, title, and map
//	 */
//	$mbResource.newPage({
//		label: 'Upload',
//		type: 'language-upload',
//		templateUrl: 'views/resources/mb-language-upload.html',
//		/*
//		 * @ngInject
//		 */
//		controller: function ($scope) {
//			$http.get('resources/common-languages.json')
//			.then(function(res){
//				$scope.languages = res.data;
//			});
//
//			this.setLanguage = function(lang){
//				$scope.$parent.setValue(lang);
//			};
//
//			var ctrl = this;
//			$scope.$watch('files.length',function(files){
//				if(!$scope.files || $scope.files.length <= 0){
//					return;
//				}
//				var reader = new FileReader();
//				reader.onload = function (event) {
//					var lang = JSON.parse(event.target.result);
//					ctrl.setLanguage(lang);
//				};
//				reader.readAsText($scope.files[0].lfFile);
//			});
//
//
//		},
//		controllerAs: 'resourceCtrl',
//		priority: 8,
//		tags: ['/app/languages']
//	});
//});
