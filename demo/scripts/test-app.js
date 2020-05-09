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

angular.module('app', ['mblowfish-core'])//
	/*
	 * Application configuration
	 */
	.config(function(
		$applicationProvider, $mbLayoutProvider,
		// TODO: replace with $mbTranslateProvider
		$translateProvider,
		$localStorageProvider, $locationProvider) {
		//
		// Application storage prefix
		//
		//  All data will be stored in local storage with key. This will be
		// added to all keys. So you can run several application which is 
		// designed based on MB
		$localStorageProvider.setKeyPrefix('demo.');

		//
		// HTML5 Addess style
		//
		// Enables HTML5 addresss style. SO the #! sign will be removed from
		// the path.
		$locationProvider.html5Mode(true);

		//
		// Application ID
		//
		// Application ID is used to seperate applications from each other. for
		// example you may have studo and dashboard application.
		//
		$applicationProvider.setKey('demo');
		$applicationProvider.setAutoloadConfigs(true);
		$applicationProvider.setAutosaveConfigs(true);



		//
		//  $mbLayout: manages layouts of the system. It is used as a basic layout
		// system to manage views, editors and etc. You are free to add layouts dynamically
		// at runtime.
		//
		$mbLayoutProvider.setDefault({
			settings: {
				hasHeaders: true,
				constrainDragToContainer: true,
				reorderEnabled: true,
				selectionEnabled: true,
				popoutWholeStack: false,
				blockedPopoutsThrowError: true,
				closePopoutsOnUnload: true,
				showPopoutIcon: false,
				showMaximiseIcon: true,
				showCloseIcon: true
			},
			dimensions: {
				borderWidth: 5,
				minItemHeight: 16,
				minItemWidth: 50,
				headerHeight: 20,
				dragProxyWidth: 300,
				dragProxyHeight: 200
			},
			content: [{
				id: 'main',
				type: 'row',
				isClosable: false,
				componentState: {},
				content: [{
					id: 'configs',
					type: 'stack',
					isClosable: false,
					width: 25,
					content: [{
						id: 'demo-pages',
						type: 'component',
						componentName: 'component',
						componentState: {
							url: '/demo',
							isView: true,
						}
					}]
				}, {
					type: 'column',
					isClosable: false,
					content: [{
						id: 'editors',
						type: 'stack',
						title: 'Editors',
						isClosable: false,
						componentState: {}
					}, {
						id: 'logs',
						type: 'stack',
						isClosable: false,
						height: 30,
					}]
				}]
			}]
		});


		//
		//  $mbTranslateProvider: 
		//
		$translateProvider.translations('fa', {
			'Dashboard': 'داشبور',
			'Applications': 'نرم‌افزارها',
			'Account': 'حساب کاربری',
			'Profile': 'پروفایل‌ها',
			'User management': 'مدیریت کاربران',
			'User': 'کاربر',
			'Users': 'کاربران',
			'Groups': 'گروه‌ها',
			'Roles': 'نقش‌ها',
			'Problems': 'مشکلات',
			'Zones': 'منطقه‌ها',
			'Networks': 'شبکه‌ها',
			'Devices': 'دستگاه‌ها',
			'Model': 'مدل',
			'Color': 'رنگ',
			'Workshops': 'کارگاه‌ها',
			'Requests': 'تقاضاها',
			'Actions': 'اکشن‌ها',
			'Tenant': 'ملک',
			'Input value': 'مقدار ورودی',

			'ID': 'شناسه',
			'Login': 'لاگین',
			'EMail': 'پست الکترونیکی',
			'Edit': 'ویرایش',
			'Save': 'ذخیره',
			'Cancel': 'انصراف',
			'Restore': 'بازیابی',
			'Password': 'گذرواژه',
			'Confirm': 'تایید',

			'Summary': 'خلاصه',
			'Phone': 'شماره تماس',
			'Mobile': 'شماره همراه',
			'LinkedId': 'لینکدین',
			'Telegram': 'تلگرام',
			'Whatsapp': 'واتساپ',
			'Contacts': 'تماس‌ها',
			'User avatar': 'اواتار کاربری',
			'User id': 'شناسه کاربری',
			'Socials': 'شبکه‌های اجتمائی',

			'spas': 'نرم‌افزارها',

			'CMS': 'سیستم مدیریت محتوی',
			'Contents': 'محتوی‌ها',

			'Bank gates': 'درگاه‌های بانکی',

			'Settings': 'تنظیمات',
			'Setting': 'تنظیم',

			'Theme': 'نمایه',
			'Themes': 'نمایه‌ها',
			'default': 'پیش فرض',
			'gray': 'خاکستری',
			'red': 'قرمز',
			'dark': 'تیره',

			'Local': 'منطقه',
			'Language': 'زبان',
			'Direction': 'جهت',
			'Right to left': 'راست به چپ',
			'Left to right': 'چپ به راست',

			'Search': 'جستجو',

			'Persian': 'فارسی',
			'English': 'انگلیسی',
			'Enable navbar': 'فعال کردن نوار ابزار',

			'Messages': 'پیام‌ها',
			'message': 'پیام',
			'set zone': 'تعیین منطقه',
			'set fixer': 'تعیین تعمیرکار',
			'remote consultant': 'مشاوره تلفنی',
			'incomplete info': 'اطلاعات ناقص',
			'schadule': 'تعیین زمان و مکان',
			'fixed': 'تعمیر شد',
			'impossilbe to fix': 'تعمییر ممکن نیست',
			'set workshop': 'تعیین کارگاه',
			'accept': 'دریافت گوشی',
			'start to fix': 'آغاز تعمیر',
			'need more time': 'نیاز به زمان بیشتر',
			'give back': 'ارسال به مشتری',
			'close': 'بستن',
			'reopen': 'باز کردن',
			'archive': 'بایگانی',
			'report': 'گزارش',

			'app.update.message': 'نسخه جدید نصب شده است، دوباره لود کنید.',

			'next': 'بعدی'
		});
		$translateProvider.preferredLanguage('fa');
	})
	/*
	 *  Runtime configurations: some part of system can be updated at the runtime. 
	 * This help moldules to update the application and contributes new functionality.
	 */
	.run(function($mbView) {
		//
		//  $mbView: manages all views of an application. you can add a new view 
		// dynamically.
		//
		$mbView.add('/demo', {
			title: 'Demo&Tutorials',
			description: 'Demo explorer.',
			icon: 'load',
			navigate: true,
			templateUrl: 'views/index.html',
		}).add('/demo/core', {
			title: 'Core Features',
			navigate: true,
			anchor: 'editors',
			templateUrl: 'views/core/index.html',
		}).add('/demo/ui', {
			title: 'UI',
			navigate: true,
			anchor: 'editors',
			templateUrl: 'views/ui/index.html',
		}).add('/demo/components', {
			title: 'Components',
			navigate: true,
			anchor: 'editors',
			templateUrl: 'views/components/index.html',
		});

		//
		//  $mbEditor: manages all editor of an application. An editor has a dynamic
		// address and is used to manage differnt items at the same tiem.
		//


	});