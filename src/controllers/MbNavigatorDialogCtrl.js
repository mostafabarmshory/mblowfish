/**
@ngdoc Controllers
@name MbNavigatorDialogCtrl
@description # AccountCtrl Controller of the mblowfish

 */
export default class MbNavigatorDialogCtrl {
	constructor($scope, $mdDialog, config) {
		'ngInject';
		$scope.config = config;
		$scope.hide = function() {
			$mdDialog.cancel();
		};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.answer = function(a) {
			$mdDialog.hide(a);
		};
	}
}