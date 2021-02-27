import templateUrl from './file.html';

export default {
	icon: 'file_upload',
	label: 'Local file',
	templateUrl: templateUrl,
	controller: function($resource, $style) {
		'ngInject';
		var ctrl = this;
		function setFile(files) {
			var val;
			if (angular.isArray(files) && files.length) {
				val = files[0];
			}
			$resource.setValue(val);
		}
		ctrl.files = [];
		_.assign(ctrl, {
			$style: $style,
			setFile: setFile
		});
	},
	controllerAs: 'ctrl',
	priority: 1,
	tags: ['file']
}