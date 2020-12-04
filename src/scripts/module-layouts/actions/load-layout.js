mblowfish.addAction(MB_LAYOUTS_LOAD_ACTION, {
	title: 'Load Layout',
	icon: 'launch',
	action: function($event, $mbLayout, $mbResource) {
		'ngInject';
		function loadLayout(layoutName) {
			$mbLayout.setLayout(layoutName);
		}

		var vals = $event.values;
		if (_.isUndefined(vals) || vals.length < 0) {
			$mbResource
				.get(MB_LAYOUTS_LAYOUTS_SP, {
					title: 'Select layout',
					$style: {
						multi: false
					}
				})
				.then(function(values) {
					loadLayout(values[0]);
				});
		} else {
			loadLayout(vals[0]);
		}
	}
})