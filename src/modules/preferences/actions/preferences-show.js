export default {
	group: 'Preferences',
	title: 'Preferences list',
	icon: 'settings',
	/* @ngInject */
	action: function($location) {
		return $location.url('preferences');
	}
}