
import templateUrl from './ui.html';

export default {
	icon: 'file',
	title: 'Core Features',
	anchor: 'editors',
	groups: ['Tutorials&Demo'],
	templateUrl: templateUrl,
	controller: function($scope) {
		'ngInject';
		$scope.files = [];
	}
}