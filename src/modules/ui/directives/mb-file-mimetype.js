mblowfish.directive('mbFileMimetype', function() {
	return {
		restrict: "A",
		require: "ngModel",
		link: function(scope, element, attrs, ctrl) {
			if (!ctrl) {
				return;
			}
			var reg;
			attrs.$observe('mbFileMimetype', function(value) {
				reg = new RegExp(value.replace(/,/g, '|'), "i");
				ctrl.$validate();
			});
			ctrl.$validators.filemimetype = function(modelValue) {
				if (!modelValue) {
					return false;
				}
				var boolValid = true;
				modelValue.every(function(obj) {
					if (obj.type.match(reg)) {
						return true;
					} else {
						boolValid = false;
						return false;
					}
				});
				return boolValid;
			};
		}
	}
});
