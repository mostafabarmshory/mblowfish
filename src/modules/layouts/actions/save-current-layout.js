export default {
	group: 'Layout',
	title: 'Save',
	description: 'Saves the current layout',
	icon: 'save',
	action: function($mbLayout, $mbLayoutsLocalStorage, $event) {
		'ngInject';
		function saveAs(layoutId) {
			$mbLayoutsLocalStorage.createLayout(layoutId, $mbLayout.getCurrentLayout());
		}
		prompt('Name of the layout.', 'layout', $event)
			.then(function(layoutId) {
				if (!$mbLayoutsLocalStorage.hasLayout(layoutId)) {
					saveAs(layoutId);
				} else {
					confirm('A layout with the same name exist. Overidde the layout?', $event)
						.then(function() {
							saveAs(layoutId);
						});
				}
			});
	}
}