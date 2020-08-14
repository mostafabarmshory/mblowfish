mblowfish.action('demo.travel.create', {
	title: 'New Travel',
	description: 'Creates new travel',
	icon: 'card_travel',
	action: function($event, $mbWizard, $mbActions) {
		'ngInject';
		//>> Check values
		if (!$event.values) {
			return $mbWizard.openWizard('demo.travel.create')
				.then(function($result) {
					$event.values = [$result];
					return $mbActions.exec('demo.travel.create', $event);
				});
		}

		alert('New travel is created:' + JSON.stringify($event.values));
	}
});