/*
Desktop module is used to manage local/remote desktop.
*/
import mblowfish from '../../mblowfish';

import MbLayoutsLayoutProviderLocalFactory from './factories/MbLayoutsLayoutProviderLocal';

import mbLayoutsLocalStorage from './services/mbLayoutsLocalStorage';

mblowfish
	.addConstants({
		MB_LAYOUTS_LAYOUTS_SP: '/app/layouts',

		MB_LAYOUTS_TOOLBAR_COMPONENT: 'mb.layouts.controller.toolbar.component',

		MB_LAYOUTS_SAVE_CURRENT_ACTION: 'mb.layouts.save.current', // save current layout as new desktop
		MB_LAYOUTS_LOAD_ACTION: 'mb.layouts.load',
		MB_LAYOUTS_THEME_SWITECH_ACTION: 'layouts.theme.switch'
	})
	.factory('MbLayoutsLayoutProviderLocal', MbLayoutsLayoutProviderLocalFactory)
	.provider('$mbLayoutsLocalStorage', mbLayoutsLocalStorage)
	.addApplicationProcess('init', {
		title: 'Loading layouts',
		/*
		Process to load stored layouts
		@ngInject 
		*/
		action: function($mbLayout, $mbStorage) {
			var layoutMaps = $mbStorage.storedLayouts || {};
			_.forEach(layoutMaps, function(layout, id) {
				$mbLayout.setLayout(id, layout);
			});
		}
	});