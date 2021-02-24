
mblowfish.action('demo.alert', {
	icon: 'face',
	title: 'Add local module',
	description: 'Adds new module into the application.',
	hotkey: 'alt+r',
	action: function($window, $event) {
		'ngInject';
		$window.alert('Alert action is called (alt+r)!?');
		$event.stopPropagation();
		$event.preventDefault();
	}
});