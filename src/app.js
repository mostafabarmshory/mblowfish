// load test application
import $ from 'jquery';
import mblowfish from './index.js';

/*
Import modules
*/
import './modules/demo';

import selectAccountTemplateUrl from './app-account-select.html';



/*
 * Application configuration
 */
mblowfish
	.config(function(
		$mbApplicationProvider, $mbLayoutProvider, $mbToolbarProvider,
		$mbSidenavProvider, $mbSettingsProvider, $mbViewProvider,
		$mbAccountProvider, $mbComponentProvider,
		$mbTranslateProvider, $mbTranslateSanitizationProvider,
		$mbStorageProvider, $mbActionsProvider, $locationProvider) {
			'ngInject';


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
				templateUrl: selectAccountTemplateUrl,
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
		$mbLayoutProvider
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
			//			.useMissingTranslationHandlerLog()
			;
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
					'demo.travel.create',
					MB_LAYOUTS_THEME_SWITECH_ACTION,
				]
			}, {
				url: '/app',
				float: 'left',
				items: [
					MB_PREFERENCES_SHOW_ACTION,
					MB_LAYOUTS_THEME_SWITECH_ACTION,
				]
			}, {
				url: '/app/account',
				float: 'right',
				items: [
					'mb.app.navigator.toggle',
					'test.component.id',
					//				MB_ACCOUNT_LOGIN_ACTION,
					//				MB_ACCOUNT_LOGOUT_ACTION,
					MB_LAYOUTS_THEME_SWITECH_ACTION,
				]
			}, {
				url: '/app/layouts',
				float: 'right',
				items: [
					MB_LAYOUTS_TOOLBAR_COMPONENT
				]
			}]);


		//
		// $mbAction: manages all actions
		//
		$mbActionsProvider
			.setShortkeysEnabled(true);
	})
	.run(function($mbToolbar, MbAction) {
		// Create and add action automatically
		var action = new MbAction({
			title: 'Auto action',
			icon: 'save',
			/* @ngInject */
			action: function($window, $event) {
				$window.alert('Autoloaded action is called', $event);
			}
		});
		var toolbar = $mbToolbar.getToolbar('/app/demo');
		toolbar.addAction(action);
	});


$(window).on('load', function() {
	mblowfish
		.loadModules(/*'demo'*/)
		.then(function() {
			try {
				mblowfish.bootstrap(document.documentElement);
			} catch (e) {
				console.error(e);
			}
		});
});


