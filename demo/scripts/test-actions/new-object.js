
mblowfish.action('demo.alert', {
	icon: 'add',
	title: 'Add new window module',
	description: 'Adds new module into the application.',
	hotkey: 'ctrl+z',
	action: function($window, $event) {
		'ngInject';
		$window.alert('New dialog is opened!?');
		$event.stopPropagation();
		$event.preventDefault();
	}
});