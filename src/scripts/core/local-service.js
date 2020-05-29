/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 weburger
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

/**
 * @ngdoc Services
 * @name $mbLocal
 * @description manage localization of widgets
 * 
 * Deprecated : use $window
 */
angular.module('mblowfish-core').provider('$mbLocal', function() {

	//---------------------------------------
	// Services
	//---------------------------------------
	var provider;
	var service;
	var rootScope;


	//---------------------------------------
	// variables
	//---------------------------------------
	var defaultDateFormat = 'jYYYY-jMM-jDD';
	var defaultDateTimeFormat = 'jYYYY-jMM-jDD hh:mm:ss';


	//---------------------------------------
	// functions
	//---------------------------------------
	/**
	 * Gets current data of the system.
	 * 
	 * @memberof $mbLocal
	 */
	function getDate() {
		return new Date();
	};


	function formatDateInternal(inputDate, format) {
		if (!inputDate) {
			return '';
		}
		try {
			if ($rootScope.app.calendar !== 'Jalaali') {
				format = format.replace('j', '');
			}
			var date = moment //
				.utc(inputDate) //
				.local();
			return date.format(format);
		} catch (ex) {
			return '-' + ex.message;
		}
	}
	/**
	 * Formats the input date based on the format
	 * 
	 * NOTE: default format is 'YYYY-MM-DD hh:mm:ss'
	 * 
	 * @params data {String | Date} to format
	 * @params format {String} of the output
	 * @memberof $mbLocal
	 */
	function formatDate(inputDate, format) {
		return formatDateInternal(inputDate, format ||
			$rootScope.app.setting.dateFormat ||
			$rootScope.app.config.dateFormat ||
			defaultDateFormat);
	};

	/**
	 * Formats the input date based on the format
	 * 
	 * NOTE: default format is 'YYYY-MM-DD hh:mm:ss'
	 * 
	 * @params data {String | Date} to format
	 * @params format {String} of the output
	 * @memberof $mbLocal
	 */
	function formatDateTime(inputDate, format) {
		return formatDateInternal(inputDate, format ||
			$rootScope.app.setting.dateFormatTime ||
			$rootScope.app.config.dateFormatTime ||
			defaultDateTimeFormat);
	};
	/**
	 * Get currency of the system
	 * 
	 * @return currency ISO code
	 * @memberof $mbLocal
	 */
	function getCurrency() {
		return this.currency || 'USD';
	};

	/**
	 * Sets currency of the system
	 * 
	 * @param currency {String} ISO code
	 * @memberof $mbLocal
	 */
	function setCurrency(currency) {
		this.currency = currency;
	};

	/**
	 * Get language of the system
	 * 
	 * @return language ISO code
	 * @memberof $mbLocal
	 */
	function getLanguage() {
		return $rootScope.app.language;
	};

	/**
	 * Sets language of the system
	 * 
	 * @params language {String} ISO code
	 * @memberof $mbLocal
	 */
	function setLanguage(language) {
		this.language = language;
	};


	function setApplicationDirection(dir) {
		$rootScope.__app.dir = dir;
	}

	function setApplicationLanguage(key) {
		if ($rootScope.__app.state !== 'ready') {
			return;
		}
		// 0- set app local
		$rootScope.__app.language = key;
		// 1- change language
		$translate.use(key);
		// 2- chnage date format
		// Change moment's locale so the 'L'-format is adjusted.
		// For example the 'L'-format is DD-MM-YYYY for Dutch
		moment.loadPersian();
		moment.locale(key);
		// Set month and week names for the general $mdDateLocale service
		var localeDate = moment.localeData();
		$mdDateLocale.months = localeDate._months;
		$mdDateLocale.shortMonths = localeDate._monthsShort;
		$mdDateLocale.days = localeDate._weekdays;
		$mdDateLocale.shortDays = localeDate._weekdaysMin;
		// Optionaly let the week start on the day as defined by moment's locale
		// data
		$mdDateLocale.firstDayOfWeek = localeDate._week.dow;
	}

	function setApplicationCalendar(key) {
		// 0- set app local
		$rootScope.__app.calendar = key;
	}

	function reload(){
	//	/*
	//	 * watch direction and update app.dir
	//	 */
	//	$rootScope.$watch(function() {
	//		return $rootScope.__app.settings.dir || $rootScope.__app.configs.dir || 'ltr';
	//	}, setApplicationDirection);
	//
	//	/*
	//	 * watch local and update language
	//	 */
	//	$rootScope.$watch(function() {
	//		// Check language
	//		return $rootScope.__app.settings.language || $rootScope.__app.configs.language || 'en';
	//	}, setApplicationLanguage);
	//
	//	/*
	//	 * watch calendar
	//	 */
	//	$rootScope.$watch(function() {
	//		return $rootScope.__app.settings.calendar || $rootScope.__app.configs.calendar || 'Gregorian';
	//	}, setApplicationCalendar);
	}

	//---------------------------------------
	// End
	//---------------------------------------
	service = {
		reload: reload
	};

	provider = {
		$get: function() {
			return service;
		}
	};
	return provider;
});
