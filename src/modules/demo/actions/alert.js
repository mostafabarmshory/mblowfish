
export default {
	icon: 'face',
	title: 'Add local module',
	description: 'Adds new module into the application.',
	hotkey: 'alt+r',
	action: function($window, $event) {
		'ngInject';
		$window.alert('Alert action is called (alt+r)!?', $event);
		$event.stopPropagation();
		$event.preventDefault();
	}
}