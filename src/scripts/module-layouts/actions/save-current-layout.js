mblowfish.addAction(MB_LAYOUTS_SAVE_CURRENT_ACTION, {
	title: 'Save Layout',
	icon: 'save',
	/* @ngInject */
	action: function($mbLayout, $mbLayoutsLocalStorage) {
		function saveAs(layoutId) {
			$mbLayoutsLocalStorage.createLayout(layoutId, $mbLayout.getCurrentLayout());
		}
		prompt('Name of the layout.', 'layout')
			.then(function(layoutId) {
				if (!$mbLayoutsLocalStorage.hasLayout(layoutId)) {
					saveAs(layoutId);
				} else {
					confirm('A layout with the same name exist. Overidde the layout?')
						.then(function() {
							saveAs(layoutId);
						});
				}
			});
	}
})