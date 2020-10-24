mblowfish.addAction(IFRAME_URL_OPEN_ACTION, {
	title: 'Open URL',
	description: 'Open a url',
	icon: 'open_in_browser',
	/* @ngInject */
	action: function($location) {
		$window
			.prompt('Enter the URL.', 'https://viraweb123.ir/wb/')
			.then(function(input) {
				$location.url('/mb/iframe/' + input);
			});
	}
});