

/**
@ngdoc Controllers
@name MbDynamicFormDialogCtrl
@description 

AccountCtrl Controller of the mblowfish
 */
export default class MbDynamicFormDialogCtrl {
	constructor($scope, $mdDialog, $schema, $value, $style) {
		'ngInject';
		$scope.style = $style;
		$scope.data = $value;
		$scope.schema = $schema;
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