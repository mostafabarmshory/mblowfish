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

/*
 * Application configuration
 */
mblowfish
	.config(function(
		$mbApplicationProvider, $mbLayoutProvider, $mbToolbarProvider,
		$mbSidenavProvider, $mbSettingsProvider, $mbViewProvider,
		$mbAccountProvider, $mbComponentProvider,
		$mbTranslateProvider, $mbTranslateSanitizationProvider,
		$mbStorageProvider, $locationProvider) {
		$mbAccountProvider
			.addAuthenticationProvider('DemoMemoryAuthenticationProvider');
		//
		// Application manager
		//
		// Application ID is used to seperate applications from each other. for
		// example you may have studo and dashboard application.
		//
		$mbApplicationProvider
			.setKey('demo')
			.setPreloadingEnabled(true)
			// Add a custom preloading container
			//		.setPreloadingComponent({
			//			template: '<h1 style="width: 100%; height: 100%; margin: 0px; padding: 150px; background: red;">Loading</h1>',
			//			controller: 'MbApplicationPreloadingContainerCtrl',
			//			controllerAs: 'ctrl',
			//		})
			// Add a customer action 
			//		.addAction('init', {
			//			title: 'Unlimited test wait',
			//			/*@ngInject*/
			//			action: function($q) {
			//				var deferred = $q.defer();
			//				return deferred.promise;
			//			}
			//		})
			.setAccountDetailRequired(false)
			.setSettingsRequired(true)
			.setLogingRequired(true)
			// Set custom login panel
			.setLoginComponent({
				templateUrl: 'views/demo-account-select.html',
				/* @ngInject */
				controller: function($mbAccount) {
					function login(cred) {
						return $mbAccount.login(cred);
					}
					this.login = login;
				},
				controllerAs: 'ctrl'
			})
			;

		$mbSettingsProvider
			.setAutosaveEnabled(true)
			.setTemplateUrl('resources/settings-template.json');

		//
		// Storage prefix
		//
		//  All data will be stored in local storage with key. This will be
		// added to all keys. So you can run several application which is 
		// designed based on MB
		$mbStorageProvider.setKeyPrefix('demo.');

		//
		// HTML5 Addess style
		//
		// Enables HTML5 addresss style. SO the #! sign will be removed from
		// the path.
		$locationProvider.html5Mode(true);

		//
		//  $mbLayout: manages layouts of the system. It is used as a basic layout
		// system to manage views, editors and etc. You are free to add layouts dynamically
		// at runtime.
		//
		// $mbLayoutProvider.setMode('auto');
		$mbLayoutProvider
			.setMode('docker')
			.addProvider('MbLayoutsLayoutProviderLocal')
			.addProvider('DemoLayoutProviderDefault')
			.setDefalutLayout('default');


		// Translation 
		$mbTranslateProvider
			.translations('fa', {
				'Dashboard': 'داشبور',
				'Applications': 'نرم‌افزارها',
				'Account': 'حساب کاربری',
				'Profile': 'پروفایل‌ها',
				'User management': 'مدیریت کاربران',
				'User': 'کاربر',
			})
			.preferredLanguage('fa')
			.useMissingTranslationHandlerLog();
		$mbTranslateSanitizationProvider
			.useStrategy(['sanitize']);


		$mbComponentProvider
			.addComponent('test.component.id', {
				template: '<input style="font-size: 12px;padding: 0px;margin: 2px;border: none;height: 18px;" type="text" />',
				/* @ngInject */
				controller: function($element) {
					$element.keypress(function(event) {
						if (event.keyCode == 13) {
							alert('Value:' + $element.find('input').val());
						}
					});
				},
				controllerAs: 'ctrl'
			});


		//
		//  By initializing the main toolbar you can add list of action or component
		// into the toolbar.
		//
		$mbToolbarProvider
			.init([{
				url: '/app/demo',
				items: [
					'mb.app.navigator.toggle',
					'demo.alert',
					MB_NAVIGATOR_SIDENAV_TOGGLE_ACTION,
					'demo.travel.create'
				]
			}, {
				url: '/app',
				float: 'left',
				items: [
					MB_PREFERENCES_SHOW_ACTION,
				]
			}, {
				url: '/app/account',
				float: 'right',
				items: [
					'mb.app.navigator.toggle',
					'test.component.id',
					//				MB_ACCOUNT_LOGIN_ACTION,
					//				MB_ACCOUNT_LOGOUT_ACTION,
				]
			}, {
				url: '/app/layouts',
				float: 'right',
				items: [
					MB_LAYOUTS_TOOLBAR_COMPONENT
				]
			}]);


//		//
//		// $mbAction: manages all actions
//		//
//		$mbSidenavProvider
//			.addSidenav('/app/navigator', {
//				title: 'Navigator',
//				description: 'Navigate all path and routs of the pandel',
//				controller: 'MbNavigatorCtrl',
//				controllerAs: 'ctrl',
//				templateUrl: 'views/mb-navigator.html',
//				//		locked: '$mdMedia("min-width: 333px");',
//				position: 'start'
//			});
		//
		//  $mbView: manages all views of an application. you can add a new view 
		// dynamically.
		//
		$mbViewProvider
			.addView('/demo', {
				title: 'Demo&Tutorials',
				description: 'Demo explorer.',
				icon: 'wb_sunny',
				templateUrl: 'views/index.html',
				groups: ['Tutorials&Demo']
			})
			.addView('/demo/core', {
				title: 'Core Features',
				anchor: 'editors',
				templateUrl: 'views/core/index.html',
				groups: ['Tutorials&Demo']
			})
			.addView('/demo/ui', {
				title: 'UI',
				icon: 'layers_clear',
				anchor: 'editors',
				templateUrl: 'views/ui/index.html',
				groups: ['Tutorials&Demo']
			})
			.addView('/demo/components', {
				title: 'Components',
				icon: 'hotel',
				anchor: 'editors',
				templateUrl: 'views/components/index.html',
				groups: ['Tutorials&Demo']
			})
			.addView('/demo/core/resources/file', {
				title: 'File',
				icon: 'file',
				controller: 'TestResoucesCtrl',
				controllerAs: 'ctrl',
				templateUrl: 'views/core/resource-file.html',
				groups: ['Resources']
			})
			.addView('/demo/core/resources/image-url', {
				title: 'Image URL',
				icon: 'gollary',
				controller: 'TestResoucesCtrl',
				controllerAs: 'ctrl',
				templateUrl: 'views/core/resource-image-url.html',
				groups: ['Resources']
			});
	})
	.run(function($mbToolbar, $window, MbAction) {
		// Create and add action automatically
		var action = new MbAction({
			title: 'Auto action',
			icon: 'save',
			/* @ngInject */
			action: function($window) {
				$window.alert('Autoloaded action is called');
			}
		});
		var toolbar = $mbToolbar.getToolbar('/app/demo');
		toolbar.addAction(action);
	});


$(window).on('load', function() {
	mblowfish
		.loadModules('demo')
		.then(function() {
			try {
				mblowfish.bootstrap(document.documentElement);
			} catch (e) {
				console.error(e);
			}
		});
});
