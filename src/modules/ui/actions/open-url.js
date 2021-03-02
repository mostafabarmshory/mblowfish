export default {
	group: 'UI',
	title: 'Open URL',
	description: 'Open a url',
	icon: 'open_in_browser',
	action: function($location, $event, $q, $window) {
		'ngInject';
		var values = $event.values;
		if (!values) {
			values = $window
				.prompt('Enter the URL.', 'https://viraweb123.ir/wb/')
				.then(function(url) {
					values = [url];
				});
		}
		$q.when(values)
			.then(function() {
				_.forEach(values, function(url) {
					$location.url('/mb/iframe/' + url);
				});
			});
	}
}