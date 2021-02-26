import templateUrl from './files.html';

export default {
	icon: 'file_upload',
	label: 'Local files',
	templateUrl: templateUrl,
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
}