/*
Desktop module is used to manage local/remote desktop.
*/

mblowfish.addConstants({

	MB_LAYOUTS_LAYOUTS_SP: '/app/layouts',

	MB_LAYOUTS_TOOLBAR_COMPONENT: 'mb.layouts.controller.toolbar.component',

	MB_LAYOUTS_SAVE_CURRENT_ACTION: 'mb.layouts.save.current', // save current layout as new desktop
	MB_LAYOUTS_LOAD_ACTION: 'mb.layouts.load',
	MB_LAYOUTS_THEME_SWITECH_ACTION: 'layouts.theme.switch'
});

/*
Process to load stored layouts
 */
mblowfish.addApplicationProcess('init', {
	title: 'Loading layouts',
	/* @ngInject */
	action:function($mbLayout, $mbStorage) {
		var layoutMaps = $mbStorage.storedLayouts || {};
		_.forEach(layoutMaps, function(layout, id) {
			$mbLayout.setLayout(id, layout);
		});
	}
});