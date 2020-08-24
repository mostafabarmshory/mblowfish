
mblowfish.action('demo.alert', {
	icon: 'face',
	title: 'Add local module',
	description: 'Adds new module into the application.',
	action: function($window) {
		'ngInject';
		$window.alert('Alert action is called!?');
	}
});