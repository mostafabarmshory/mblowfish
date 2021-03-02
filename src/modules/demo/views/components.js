
import templateUrl from './components.html';

export default {
	icon: 'file',
	title: 'components ',
	anchor: 'editors',
	groups: ['Tutorials&Demo'],
	templateUrl: templateUrl,
	controller: function($scope) {
		'ngInject';
		$scope.files = [];
	}
}