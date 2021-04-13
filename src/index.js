/**
This is the entery point of the application?? 
 */
import $ from "jquery";
import _ from "lodash";

import mblowfish from './mblowfish.js';

import './angular-material-common.css';
import './angular-material-hack-button.css';
import './angular-material-hack-toolbar.css';
import './index.css';


/****************************************************************************
 * Controllers                                                              *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
import MbAbstractCtrl from './controllers/MbAbstractCtrl';
import MbDynamicFormDialogCtrl from './controllers/MbDynamicFormDialogCtrl';
import MbNavigatorDialogCtrl from './controllers/MbNavigatorDialogCtrl';
import MbResourceDialogCtrl from './controllers/MbResourceDialogCtrl';

/****************************************************************************
 * Services                                                                *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
import mbAccount from './services/mbAccount';
import mbActions from './services/mbActions';
import mbApplication from './services/mbApplication';
import mbClipboard from './services/mbClipboard';
import mbComponent from './services/mbComponent';
import mbCrypto from './services/mbCrypto';
import mbDialog from './services/mbDialog';
import mbDispatcher from './services/mbDispatcher';
import mbDispatcherUtil from './services/mbDispatcherUtil';
import mbDynamicForm from './services/mbDynamicForm';
import mbEditor from './services/mbEditor';
import mbHotkey from './services/mbHotkey';
import mbJobs from './services/mbJobs';
import mbLayout from './services/mbLayout';
import mbLocal from './services/mbLocal';
import mbLog from './services/mbLog';
import mbMenu from './services/mbMenu';
import mbMimetype from './services/mbMimetype';
import mbModules from './services/mbModules';
import mbNavigator from './services/mbNavigator';
import mbNotification from './services/mbNotification';
import mbPreferences from './services/mbPreferences';
import mbResource from './services/mbResource';
import mbRoute from './services/mbRoute';
import mbRouteParams from './services/mbRouteParams';
import mbSelection from './services/mbSelection';
import mbSettings from './services/mbSettings';
import mbSidenav from './services/mbSidenav';
import mbStorage from './services/mbStorage';
import mbTheming from './services/mbTheming';
import mbToolbar from './services/mbToolbar';
import mbUiUtil from './services/mbUiUtil';
import mbUtil from './services/mbUtil';
import mbView from './services/mbView';
import mbWizard from './services/mbWizard';

import mbHttp from './services/mbHttp';
import mbLocation from './services/mbLocation';
import mbQueue from './services/mbQueue';

/****************************************************************************
 * Configuration&Runs                                                       *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
import angularHackThemeConfigs from './angularHackThemeConfigs';
import angularHackConfigs from './angularHackConfigs';
import angularHackIconsConfigs from './angularHackIconsConfigs';
import angularHackWindowRun from './angularHackWindowRun';

/****************************************************************************
 * Factories                                                                *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
import MbActionFactory from './factories/MbActionFactory';
import MbActionGroupFactory from './factories/MbActionGroupFactory';
import MbActionHotkeyMapFactory from './factories/MbActionHotkeyMapFactory';
import MbAuthenticationFactory from './factories/MbAuthenticationFactory';
import MbAuthenticationProviderFactory from './factories/MbAuthenticationProviderFactory';
import MbComponentFactory from './factories/MbComponentFactory';
import MbContainerFactory from './factories/MbContainerFactory';
import MbEditorFactory from './factories/MbEditorFactory';
import MbEventFactory from './factories/MbEventFactory';
import MbFrameFactory from './factories/MbFrameFactory';
import MbHttpRequestInterceptorFactory from './factories/MbHttpRequestInterceptorFactory';
import MbJobFactory from './factories/MbJobFactory';
import MbLayoutFactory from './factories/MbLayoutFactory';
import MbLayoutProviderFactory from './factories/MbLayoutProviderFactory';
import MbMenuFactory from './factories/MbMenuFactory';
import MbMimetypeFactory from './factories/MbMimetypeFactory';
import MbObservableObjectFactory from './factories/MbObservableObjectFactory';
import MbSidenavFactory from './factories/MbSidenavFactory';
import MbToolbarFactory from './factories/MbToolbarFactory';
import MbUiHandlerFactory from './factories/MbUiHandlerFactory';
import MbViewFactory from './factories/MbViewFactory';
import MbWizardFactory from './factories/MbWizardFactory';
import MbWizardPageFactory from './factories/MbWizardPageFactory';

/****************************************************************************
 * Directives                                                               *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
import lmGoldenlayout from './directives/lmGoldenlayout';
import mbToolbarGroupDirective from './directives/mbToolbarGroup';
import mbViewDirectiveDirective from './directives/mbView';

/****************************************************************************
 * Filters                                                                  *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
import mbmd5Filter from './filters/mbmd5';
import mbunsafeFilter from './filters/mbunsafe';

/****************************************************************************
 * constants                                                               *
 *                                                                          *
 *                                                                          *
 ****************************************************************************/
mblowfish
	// controllers
	.controller('MbAbstractCtrl', MbAbstractCtrl)
	.controller('MbDynamicFormDialogCtrl', MbDynamicFormDialogCtrl)
	.controller('MbNavigatorDialogCtrl', MbNavigatorDialogCtrl)
	.controller('MbResourceDialogCtrl', MbResourceDialogCtrl)

	// directives
	.directive('lmGoldenlayout', lmGoldenlayout)
	.directive('mbToolbarGroup', mbToolbarGroupDirective)
	.directive('mbView', mbViewDirectiveDirective)

	// factories
	.factory('MbAction', MbActionFactory)
	.factory('MbActionGroup', MbActionGroupFactory)
	.factory('MbActionHotkeyMap', MbActionHotkeyMapFactory)
	.factory('MbAuthentication', MbAuthenticationFactory)
	.factory('MbAuthenticationProvider', MbAuthenticationProviderFactory)
	.factory('MbComponent', MbComponentFactory)
	.factory('MbContainer', MbContainerFactory)
	.factory('MbEditor', MbEditorFactory)
	.factory('MbEvent', MbEventFactory)
	.factory('MbFrame', MbFrameFactory)
	.factory('MbHttpRequestInterceptor', MbHttpRequestInterceptorFactory)
	.factory('MbJob', MbJobFactory)
	.factory('MbLayout', MbLayoutFactory)
	.factory('MbLayoutProvider', MbLayoutProviderFactory)
	.factory('MbMenu', MbMenuFactory)
	.factory('MbMimetype', MbMimetypeFactory)
	.factory('MbObservableObject', MbObservableObjectFactory)
	.factory('MbSidenav', MbSidenavFactory)
	.factory('MbToolbar', MbToolbarFactory)
	.factory('MbUiHandler', MbUiHandlerFactory)
	.factory('MbView', MbViewFactory)
	.factory('MbWizard', MbWizardFactory)
	.factory('MbWizardPage', MbWizardPageFactory)
	.factory('$exceptionHandler', function($log) {
		'ngInject';
		return function myExceptionHandler(exception, cause) {
			$log.warn(exception, cause);
		};
	})

	// filters
	.filter('mbmd5', mbmd5Filter)
	.filter('mbunsafe', mbunsafeFilter)

	// Services
	// UI
	.provider('$mbComponent', mbComponent)
	.provider('$mbDialog', mbDialog)
	.provider('$mbDynamicForm', mbDynamicForm)
	.provider('$mbEditor', mbEditor)
	.provider('$mbHotkey', mbHotkey)
	.provider('$mbLayout', mbLayout)
	.service('$mbMenu', mbMenu)
	.service('$mbNavigator', mbNavigator)
	.service('$mbNotification', mbNotification)
	.service('$mbRoute', mbRoute)
	.service('$mbRouteParams', mbRouteParams)
	.provider('$mbSidenav', mbSidenav)
	.provider('$mbTheming', mbTheming)
	.provider('$mbToolbar', mbToolbar)
	.service('$mbUiUtil', mbUiUtil)
	.provider('$mbView', mbView)
	.provider('$mbWizard', mbWizard)

	// Core services
	.provider('$mbAccount', mbAccount)
	.provider('$mbActions', mbActions)
	.provider('$mbApplication', mbApplication)
	.service('$mbClipboard', mbClipboard)
	.service('$mbCrypto', mbCrypto)
	.provider('$mbDispatcher', mbDispatcher)
	.provider('$mbDispatcherUtil', mbDispatcherUtil)
	.provider('$mbJobs', mbJobs)
	.provider('$mbLocal', mbLocal)
	.provider('$mbMimetype', mbMimetype)
	.provider('$mbModules', mbModules)
	.provider('$mbPreferences', mbPreferences)
	.provider('$mbResource', mbResource)
	.service('$mbSelection', mbSelection)
	.provider('$mbSettings', mbSettings)
	.provider('$mbStorage', mbStorage)
	.service('$mbUtil', mbUtil)
	.provider('$mbHttp', mbHttp)
	.provider('$mbLocation', mbLocation)
	.provider('$mbQueue', mbQueue)

	// configs
	.provider('$mbLog', mbLog)
	.config(angularHackThemeConfigs)
	.config(angularHackConfigs)
	.config(angularHackIconsConfigs)
	.run(angularHackWindowRun)
	.addConstants({
		MB_SECURITY_ACCOUNT_SP: '/app/security/account',

		MB_SETTINGS_SP: '/app/settings',
		MB_SETTINGS_ST: '/app/settings',



		STORE_LOCAL_PATH: '/app/local',

		SETTING_LOCAL_LANGUAGE: 'local.language',
		SETTING_LOCAL_DATEFORMAT: 'local.dateformat',
		SETTING_LOCAL_DATETIMEFORMAT: 'local.datetimeformat',
		SETTING_LOCAL_CURRENCY: 'local.currency',
		SETTING_LOCAL_DIRECTION: 'local.direction',
		SETTING_LOCAL_CALENDAR: 'local.calendar',
		SETTING_LOCAL_TIMEZONE: 'local.timezone',
	});


/*
Modules
 */
import './modules/help';
import './modules/layouts';
import './modules/moduleManager';
import './modules/navigator';
import './modules/preferences';
import './modules/translate';
import './modules/ui';

export default mblowfish;