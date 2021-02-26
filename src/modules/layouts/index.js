/*
Desktop module is used to manage local/remote desktop.
*/


import mblowfish from '../../mblowfish';

import Constants from './Constants';
import loadLayoutAction from './actions/load-layout';
import saveCurrentLayoutAction from './actions/save-current-layout';
import switchThemeAction from './actions/theme-switch';

import layoutToolbarComponent from './components/layouts-toolbar';

import MbLayoutsLayoutProviderLocalFactory from './factories/MbLayoutsLayoutProviderLocal';

import loadLayoutProcess from './processes/loadLayout';

import localStoragelayoutResource from './resources/layouts-local-storage';

import mbLayoutsLocalStorage from './services/mbLayoutsLocalStorage';

mblowfish
	.constant(Constants)
	//>> actions
	.action(MB_LAYOUTS_LOAD_ACTION, loadLayoutAction)
	.action(MB_LAYOUTS_SAVE_CURRENT_ACTION, saveCurrentLayoutAction)
	.action(MB_LAYOUTS_THEME_SWITECH_ACTION, switchThemeAction)

	//>> components
	.component(MB_LAYOUTS_TOOLBAR_COMPONENT, layoutToolbarComponent)

	//>> factories
	.factory('MbLayoutsLayoutProviderLocal', MbLayoutsLayoutProviderLocalFactory)

	//>> Processes
	.applicationProcess('init', loadLayoutProcess)

	//>> resources
	.resource('mb-layouts-local-storage', localStoragelayoutResource)

	//>> services
	.provider('$mbLayoutsLocalStorage', mbLayoutsLocalStorage)

	//<<end
	;





