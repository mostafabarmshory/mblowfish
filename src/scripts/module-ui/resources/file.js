mblowfish.resource('local-file', {
	icon: 'file_upload',
	label: 'Local file',
	templateUrl: 'scripts/module-ui/resources/file.html',
	controller: function($scope, $resource, $style) {
		'ngInject';
		var ctrl = this;
		function setFile(files) {
			var val;
			if (angular.isArray(files) && files.length) {
				val = files[0];
			}
			$resource.setValue(val);
		}
		$scope.files = [];
		_.assign(ctrl, {
			$style: $style,
			setFile: setFile
		});
	},
	controllerAs: 'ctrl',
	priority: 1,
	tags: ['file']
});