mblowfish.resource('local-files', {
	icon: 'file_upload',
	label: 'Local files',
	templateUrl: 'scripts/module-ui/resources/files.html',
	controller: function($scope, $resource, $style) {
		'ngInject';
		var ctrl = this;
		function setFiles(files) {
			var vals = [];
			_.forEach(files, function(file) {
				vals.push(file.lfFile);
			});
			$resource.setValue(vals);
		}
		$scope.files = [];
		$scope.$watch('files.length', function() {
			setFiles($scope.files);
		});
		_.assign(ctrl, {
			$style: $style,
			setFiles: setFiles
		});
	},
	controllerAs: 'ctrl',
	priority: 1,
	tags: ['files']
});