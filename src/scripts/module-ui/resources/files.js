mblowfish.resource('local-files', {
	icon: 'file_upload',
	label: 'Local files',
	templateUrl: 'scripts/module-ui/resources/files.html',
	controller: function($resource, $style) {
		'ngInject';
		var ctrl = this;
		function setFiles(files) {
			$resource.setValue(files);
		}
		ctrl.files = [];
		_.assign(ctrl, {
			$style: $style,
			setFiles: setFiles
		});
	},
	controllerAs: 'ctrl',
	priority: 1,
	tags: ['files']
});