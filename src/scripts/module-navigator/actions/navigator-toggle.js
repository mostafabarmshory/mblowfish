
mblowfish.addAction(MB_NAVIGATOR_SIDENAV_TOGGLE_ACTION, {
	group: 'Navigator',
	title: 'Open Sidenav',
	description: 'Opens the Navigator Sidenav and display list of views',
	icon: 'menu',
	/* @ngInject */
	action: function($mbSidenav) {
		$mbSidenav.getSidenav('/app/navigator').toggle();
	}
});