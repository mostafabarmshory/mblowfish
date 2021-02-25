mblowfish.resource('wb-url', {
	title: 'URL',
	icon: 'link',
	templateUrl: 'scripts/module-ui/resources/url.html',
	controller: function($scope, $resource, $style) {
		'ngInject';
		var ctrl = this;
		$scope.url = $resource.getValue();
		if (!_.isString($scope.url)) {
			$scope.url = '';
		}
		function setUrl(url) {
			$resource.setValue(url);
		}
		_.assign(ctrl, {
			$style: $style,
			setUrl: setUrl
		});
	},
	controllerAs: 'ctrl',
	tags: [
		'url',
		'image-url',
		'vedio-url',
		'audio-url',
		'page-url',
		'avatar-url',
		'thumbnail-url'
	]
});