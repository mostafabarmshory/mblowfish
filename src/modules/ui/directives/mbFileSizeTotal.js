/**

@ngInject
 */
export default function() {
	var sizes = ['Byte', 'KB', 'MB'];
	return {
		restrict: "A",
		require: "ngModel",
		link: function(scope, element, attrs, ctrl) {
			if (!ctrl) {
				return;
			}
			var intMax = -1;
			attrs.$observe('mbFileSizeTotal', function(value) {
				var reg = /^[1-9][0-9]*(Byte|KB|MB)$/;
				if (!reg.test(value)) {
					intMax = -1;
				} else {
					var unit = value.match(reg)[1];
					var number = value.substring(0, value.indexOf(unit));
					sizes.every(function(obj, idx) {
						if (unit === obj) {
							intMax = parseInt(number) * Math.pow(1024, idx);
							return false;
						} else {
							return true;
						}
					});
				}
				ctrl.$validate();
			});
			ctrl.$validators.filesizetotal = function(modelValue) {
				if (!modelValue) {
					return false;
				}
				var intTotal = 0;
				angular.forEach(modelValue, function(obj) {
					intTotal = intTotal + obj.size;
				});
				return intTotal < intMax;
			};
		}
	}
}