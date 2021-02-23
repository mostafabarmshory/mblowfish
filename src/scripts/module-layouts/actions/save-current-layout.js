mblowfish.addAction(MB_LAYOUTS_SAVE_CURRENT_ACTION, {
	group: 'Layout',
	title: 'Save',
	description: 'Saves the current layout',
	icon: 'save',
	action: function($mbLayout, $mbLayoutsLocalStorage) {
		'ngInject';
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