export default {
	title: 'Navigator',
	description: 'Tooble Navigator Sidenav',
	icon: 'menu',
	action: function($mbSidenav) {
		'ngInject';
		$mbSidenav
			.getSidenav('/app/navigator')
			.toggle();
	}
}