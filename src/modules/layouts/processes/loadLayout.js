

/*
Process to load stored layouts
*/
export default {
	title: 'Loading layouts',
	description: 'Loacing last saved layout form storage',
	action: function($mbLayout, $mbStorage) {
		'ngInject';
		var layoutMaps = $mbStorage.storedLayouts || {};
		_.forEach(layoutMaps, function(layout, id) {
			$mbLayout.setLayout(id, layout);
		});
	}
};