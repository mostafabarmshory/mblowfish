mblowfish.addAction(MB_PREFERENCES_SHOW_ACTION, {
	group: 'Preferences',
	title: 'Preferences list',
	icon: 'settings',
	/* @ngInject */
	action: function($location) {
		return $location.url('preferences');
	}
});//