
mblowfish.addAction(MB_NAVIGATOR_SIDENAV_TOGGLE_ACTION, {
	title: 'Navigator',
	description: 'Tooble Navigator Sidenav',
	icon: 'menu',
	/* @ngInject */
	action: function($mbSidenav) {
		$mbSidenav.getSidenav('/app/navigator').toggle();
	}
});