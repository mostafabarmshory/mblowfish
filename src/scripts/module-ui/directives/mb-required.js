
// TODO:  maso, 2020: must replaced with ngRequried
mblowfish.directive('mbRequired', function() {
	return {
		restrict: "A",
		require: "ngModel",
		link: function(scope, element, attrs, ctrl) {
			if (!ctrl) {
				return;
			}
			ctrl.$validators.required = function(modelValue, viewValue) {
				if (!modelValue) {
					return false;
				}
				return modelValue.length > 0;
			};
		}
	}
});