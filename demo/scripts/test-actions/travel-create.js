mblowfish.action('demo.travel.create', {
	title: 'New Travel',
	description: 'Creates new travel',
	icon: 'card_travel',
	action: function($event, $mbWizard) {
		'ngInject';
		//>> Check values
		if (!$event.values) {
			return $mbWizard.openWizard('demo.travel.create');
		}

		alert('New travel is created:' + JSON.stringify($event.values));
	}
});