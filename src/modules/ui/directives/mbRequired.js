/**

@ngInject
 */
export default  function() {
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
}