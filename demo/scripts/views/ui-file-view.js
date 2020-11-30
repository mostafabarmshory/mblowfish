mblowfish.view('/demo/ui/mb-file-view', {
	icon: 'file',
	title: 'File UI',
	groups: ['UI'],
	templateUrl: 'scripts/views/ui-file-view.html',
	controller: function($scope) {
		'ngInject';
		$scope.files = [];
	}
});