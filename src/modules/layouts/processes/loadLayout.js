

export default {
	title: 'Loading layouts',
	description: 'Loacing last saved layout form storage',
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
};