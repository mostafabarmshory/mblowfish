

/**
 * @ngdoc Controllers
 * @name MbNavigatorDialogCtrl
 * @description # AccountCtrl Controller of the mblowfish

@ngInject
 */
export default function($scope, $mdDialog, config) {
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
