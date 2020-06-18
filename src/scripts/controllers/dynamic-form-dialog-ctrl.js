

/**
@ngdoc Controllers
@name MbDynamicFormDialogCtrl
@description 

AccountCtrl Controller of the mblowfish-core
 */
mblowfish.controller('MbDynamicFormDialogCtrl', function($scope, $mdDialog, $schema, $value, $style) {
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
});
