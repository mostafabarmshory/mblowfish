import templateUrl from './ui-file-view.html';

export default {
	icon: 'file',
	title: 'File UI',
	groups: ['UI'],
	templateUrl: templateUrl,
	controller: function($scope) {
		'ngInject';
		$scope.files = [];
	}
}