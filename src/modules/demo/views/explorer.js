
import templateUrl from './explorer.html';

export default{
	icon: 'file',
	title: 'File UI',
	groups: ['UI'],
	templateUrl: templateUrl,
	controller: function($scope) {
		'ngInject';
		$scope.files = [];
	}
}