mblowfish.directive('mbFileSize', function() {
	var sizes = ['Byte', 'KB', 'MB'];
	return {
		restrict: "A",
		require: "ngModel",
		link: function(scope, element, attrs, ctrl) {
			if (!ctrl) {
				return;
			}
			var intMax = -1;
			attrs.$observe('mbFileSize', function(value) {
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
			ctrl.$validators.filesize = function(modelValue) {
				if (!modelValue) {
					return false;
				}
				var boolValid = true;
				modelValue.every(function(obj) {
					if (obj.size > intMax) {
						boolValid = false;
						return false;
					} else {
						return true;
					}
				});
				return boolValid;
			};
		}
	}
});