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
@ngdoc Services
@name $mbLocal
@description manage localization of widgets

Many variables create system local:

- language
- currency
- direction
- calendar
- date formate
- date time format
- timezone


## Common Built-In Expressions

The base class for expressions is $mbLocal. This provides some 
common expressions which are available in templates.

By default, built in expressions are enabled automatically. However you can
disable it in configuration:

	$mbLocalProvider
		.setExpressionsEnabled(false);

- isLanguage(lang): check if language is set
- isCurrency(currency): check if currency is set
- isCalendar(calendar): checks if the callender is set
- isRtl : true if the direction is set right to left
- isLtr : true if the direction is set left to right

For example, to add security into a view or editor:

@example
	<div ng-show="!isRtl && isLanguage('fa')">Direction must be RTL for current language</div>
 */
mblowfish.provider('$mbLocal', function() {

	//---------------------------------------
	// Services
	//---------------------------------------
	var provider;
	var service;

	var rootScope;
	var mbStorage;
	var mbDispatcher;
	var mdDateLocale;
	var mbTranslate;

	//---------------------------------------
	// variables
	//---------------------------------------
	var defaultCalendar = 'en';
	var defaultCurrency = 'USD';
	var defaultDateFormat = 'jYYYY-jMM-jDD';
	var defaultDateTimeFormat = 'jYYYY-jMM-jDD HH:mm:ss';
	var defaultDirection = 'ltr';
	var defaultLanguage = 'en';
	var defaultTimezone = 'UTC';

	var dateFormat;
	var dateTimeFormat;
	var language;
	var currency;
	var direction;
	var calendar;
	var timezone;

	var autoSave = false;
	var exrpressionsEnabled = true;


	//---------------------------------------
	// functions
	//---------------------------------------

	function formatDateInternal(inputDate, format) {
		if (!inputDate) {
			return '';
		}
		try {
			if (calendar !== 'Jalaali') {
				format = format.replace('j', '');
			}
			return moment
				.utc(inputDate, 'YYYY-MM-DD HH:mm:ss')
				.local()
				.format(format);
		} catch (ex) {
			return 'Bad date format:' + ex.message;
		}
	}
	/**
	 Formats the input date based on the format
	 
	 NOTE: default format is 'YYYY-MM-DD hh:mm:ss'
	 
	 @params data {String | Date} to format
	 @params format {String} of the output
	 @memberof $mbLocal
	 */
	function formatDate(inputDate, format) {
		return formatDateInternal(inputDate, format || dateFormat || defaultDateFormat);
	}


	function setDateFormat(newDateFormat) {
		//>> change
		dateFormat = newDateFormat;

		//>> save
		if (autoSave) {
			save();
		}

		//>> fire changes
		mbDispatcher.dispatch(STORE_LOCAL_PATH, {
			type: 'update',
			key: 'dateFormat',
			values: [newDateFormat]
		});

		return service;
	}


	function getDateFormat() {
		return dateFormat;
	}

	/**
	 Formats the input date based on the format
	 
	 NOTE: default format is 'YYYY-MM-DD hh:mm:ss'
	 
	 @params data {String | Date} to format
	 @params format {String} of the output
	 @memberof $mbLocal
	 */
	function formatDateTime(inputDate, format) {
		return formatDateInternal(inputDate, format || dateTimeFormat || defaultDateTimeFormat);
	}

	function setDateTimeFormat(newDateTimeFormat) {
		//>> change
		dateTimeFormat = newDateTimeFormat;

		//>> save
		if (autoSave) {
			save();
		}

		//>> fire changes
		mbDispatcher.dispatch(STORE_LOCAL_PATH, {
			type: 'update',
			key: 'dateTimeFormat',
			values: [newDateTimeFormat]
		});

		return service;
	}

	function getDateTimeFormat() {
		return dateTimeFormat;
	}

	/**
	 Get currency of the system
	 
	 @return currency ISO code
	 @memberof $mbLocal
	 */
	function getCurrency() {
		return currency;
	}

	/**
	 Sets currency of the system
	 
	 @param currency {String} ISO code
	 @memberof $mbLocal
	 */
	function setCurrency(newCurrency) {
		//>> change
		currency = newCurrency;

		//>> save
		if (autoSave) {
			save();
		}

		//>> fire changes
		mbDispatcher.dispatch(STORE_LOCAL_PATH, {
			type: 'update',
			key: 'currency',
			values: [currency]
		});

		return service;
	}

	function setDirection(newDirection) {
		//>> change
		// update variables
		direction = newDirection;
		// update expressions
		if (exrpressionsEnabled) {
			rootScope.isRtl = direction === 'rtl';
			rootScope.isLtr = direction === 'ltr';
		}

		//>> save
		if (autoSave) {
			save();
		}

		//>> fire changes
		mbDispatcher.dispatch(STORE_LOCAL_PATH, {
			type: 'update',
			key: 'direction',
			values: [direction]
		});

		return service;
	}

	function getDirection() {
		return direction;
	}

	/**
	 Sets language of the system
	 
	 @params language {String} ISO code
	 @memberof $mbLocal
	 */
	function setLanguage(lang) {
		language = lang;
		mbTranslate.use(lang);

		//>> save
		if (autoSave) {
			save();
		}

		//>> fire changes
		mbDispatcher.dispatch(STORE_LOCAL_PATH, {
			type: 'update',
			key: 'language',
			values: [language]
		});

		return service;
	}

	/**
	 Get language of the system
	 
	 @return language ISO code
	 @memberof $mbLocal
	 */
	function getLanguage() {
		return language;
	}

	function setCalendar(key) {
		calendar = key;
		//>> Chnage date format
		// Change moment's locale so the 'L'-format is adjusted.
		// For example the 'L'-format is DD-MM-YYYY for Dutch
		moment.loadPersian();
		moment.locale(key);
		// Set month and week names for the general $mdDateLocale service
		var localeDate = moment.localeData();
		mdDateLocale.months = localeDate._months;
		mdDateLocale.shortMonths = localeDate._monthsShort;
		mdDateLocale.days = localeDate._weekdays;
		mdDateLocale.shortDays = localeDate._weekdaysMin;
		// Optionaly let the week start on the day as defined by moment's locale data
		mdDateLocale.firstDayOfWeek = localeDate._week.dow;

		//>> save
		if (autoSave) {
			save();
		}

		//>> fire changes
		mbDispatcher.dispatch(STORE_LOCAL_PATH, {
			type: 'update',
			key: 'calendar',
			values: [calendar]
		});

		return service;
	}

	function getCalendar() {
		return calendar;
	}


	function setTimezone(newTimezone) {
		timezone = newTimezone;

		//>> save
		if (autoSave) {
			save();
		}

		//>> fire changes
		mbDispatcher.dispatch(STORE_LOCAL_PATH, {
			type: 'update',
			key: 'timezone',
			values: [timezone]
		});

		return service;
	}

	function getTimezone() {
		return timezone;
	}

	function save() {
		mbSettings
			.set(SETTING_LOCAL_CALENDAR, calendar)
			.set(SETTING_LOCAL_CURRENCY, currency)
			.set(SETTING_LOCAL_DATEFORMAT, dateFormat)
			.set(SETTING_LOCAL_DATETIMEFORMAT, dateTimeFormat)
			.set(SETTING_LOCAL_DIRECTION, direction)
			.set(SETTING_LOCAL_LANGUAGE, language)
			.set(SETTING_LOCAL_TIMEZONE, timezone);
	}

	function load() {
		setCalendar(mbSettings.get(SETTING_LOCAL_CALENDAR, defaultCalendar));
		setCurrency(mbSettings.get(SETTING_LOCAL_CURRENCY, defaultCurrency));
		setDateFormat(mbSettings.get(SETTING_LOCAL_DATEFORMAT, defaultDateFormat));
		setDateTimeFormat(mbSettings.get(SETTING_LOCAL_DATETIMEFORMAT, defaultDateTimeFormat));
		setDirection(mbSettings.get(SETTING_LOCAL_DIRECTION, defaultDirection));
		setLanguage(mbSettings.get(SETTING_LOCAL_LANGUAGE, defaultLanguage));
		setTimezone(mbSettings.get(SETTING_LOCAL_TIMEZONE, defaultLanguage));

		if (exrpressionsEnabled) {
			rootScope.isLanguage = function(lang) {
				return lang === language;
			};
			rootScope.isCurrency = function(cur) {
				return currency == cur;
			};
			rootScope.isCalendar = function(cal) {
				return calendar = cal;
			};
			rootScope.isRtl = direction === 'rtl';
			rootScope.isLtr = direction === 'ltr';
		}
	}

	//---------------------------------------
	// End
	//---------------------------------------
	service = {
		load: load,
		save: save,

		setCalendar: setCalendar,
		getCalendar: getCalendar,

		formatDate: formatDate,
		setDateFormat: setDateFormat,
		getDateFormat: getDateFormat,

		formatDateTime: formatDateTime,
		setDateTimeFormat: setDateTimeFormat,
		getDateTimeFormat: getDateTimeFormat,

		setLanguage: setLanguage,
		getLanguage: getLanguage,

		setCurrency: setCurrency,
		getCurrency: getCurrency,

		setDirection: setDirection,
		getDirection: getDirection,

		setTimezone: setTimezone,
		getTimezone: getTimezone,
	};

	provider = {
		/* @ngInject */
		$get: function($mbStorage, $mdDateLocale, $mbDispatcher, $rootScope, $mbTranslate) {
			mbStorage = $mbStorage;
			mdDateLocale = $mdDateLocale;
			mbDispatcher = $mbDispatcher;
			rootScope = $rootScope;
			mbTranslate = $mbTranslate;

			load();
			return service;
		},
		setDefaultLanguage: function(language) {
			defaultLanguage = language;
			return provider;
		},
		setDefaultCurrency: function(currency) {
			defaultCurrency = currency;
			return provider;
		},
		setDefaultDateFormat: function(dateFormat) {
			defaultDateFormat = dateFormat;
			return provider;
		},
		setDefaultDateTimeFomrat: function(dateTimeFormat) {
			defaultDateTimeFormat = dateTimeFormat;
			return provider;
		},
		setDefaultDirection: function(direction) {
			defaultDirection = direction;
			return provider;
		},
		setDefaultCalendar: function(calendar) {
			defaultCalendar = calendar;
			return provider;
		},
		setDefaultTimezone: function(timezone) {
			defaultTimezone = timezone;
			return provider;
		}
	};
	return provider;
});
