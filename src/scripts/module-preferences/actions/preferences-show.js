mblowfish.addAction(MB_PREFERENCES_SHOW_ACTION, {
	title: 'Preferences',
	icon: 'settings',
	/* @ngInject */
	action: function($location) {
		return $location.url('preferences');
	}
});//