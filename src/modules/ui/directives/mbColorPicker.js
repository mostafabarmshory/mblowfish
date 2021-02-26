mblowfish.directive('mbColorPicker', function() {

	return {
		templateUrl: 'scripts/module-ui/directives/mb-color-picker.html',

		// Added required controller ngModel
		require: '^ngModel',
		scope: {
			options: '=mbColorPicker',

			// Input options
			type: '@',
			label: '@?',
			icon: '@?',
			random: '@?',
			default: '@?',

			// Dialog Options
			openOnInput: '=?',
			hasBackdrop: '=?',
			clickOutsideToClose: '=?',
			skipHide: '=?',
			preserveScope: '=?',

			// Advanced options
			mbColorClearButton: '=?',
			mbColorPreview: '=?',

			mbColorAlphaChannel: '=?',
			mbColorSpectrum: '=?',
			mbColorSliders: '=?',
			mbColorGenericPalette: '=?',
			mbColorMaterialPalette: '=?',
			mbColorHistory: '=?',
			mbColorHex: '=?',
			mbColorRgb: '=?',
			mbColorHsl: '=?',
			mbColorDefaultTab: '=?'
		},
		controller: function($scope, $element, $attrs, $mdDialog, MbColorPicker) {
			'ngInject';
			var didJustClose = false;

			// Merge Options Object with scope.  Scope will take precedence much like css vs style attribute.
			if ($scope.options !== undefined) {
				for (var opt in $scope.options) {
					if ($scope.options.hasOwnProperty(opt)) {
						var scopeKey;
						//if ( $scope.hasOwnProperty( opt ) ) { // Removing this because optional scope properties are not added to the scope.
						scopeKey = opt;
						//} else
						if ($scope.hasOwnProperty('mbColor' + opt.slice(0, 1).toUpperCase() + opt.slice(1))) {
							scopeKey = 'mbColor' + opt.slice(0, 1).toUpperCase() + opt.slice(1);
						}
						if (scopeKey && ($scope[scopeKey] === undefined || $scope[scopeKey] === '')) {
							$scope[scopeKey] = $scope.options[opt];
						}
					}
				}
			}

			// Get ngModelController from the current element
			var ngModel = $element.controller('ngModel');

			// Quick function for updating the local 'value' on scope
			var updateValue = function(val) {
				$scope.value = val || ngModel.$viewValue || '';
			};

			// Defaults
			// Everything is enabled by default.
			$scope.mbColorClearButton = $scope.mbColorClearButton === undefined ? true : $scope.mbColorClearButton;
			$scope.mbColorPreview = $scope.mbColorPreview === undefined ? true : $scope.mbColorPreview;

			$scope.mbColorAlphaChannel = $scope.mbColorAlphaChannel === undefined ? true : $scope.mbColorAlphaChannel;
			$scope.mbColorSpectrum = $scope.mbColorSpectrum === undefined ? true : $scope.mbColorSpectrum;
			$scope.mbColorSliders = $scope.mbColorSliders === undefined ? true : $scope.mbColorSliders;
			$scope.mbColorGenericPalette = $scope.mbColorGenericPalette === undefined ? true : $scope.mbColorGenericPalette;
			$scope.mbColorMaterialPalette = $scope.mbColorMaterialPalette === undefined ? true : $scope.mbColorMaterialPalette;
			$scope.mbColorHistory = $scope.mbColorHistory === undefined ? true : $scope.mbColorHistory;
			$scope.mbColorHex = $scope.mbColorHex === undefined ? true : $scope.mbColorHex;
			$scope.mbColorRgb = $scope.mbColorRgb === undefined ? true : $scope.mbColorRgb;
			$scope.mbColorHsl = $scope.mbColorHsl === undefined ? true : $scope.mbColorHsl;
			// Set the starting value
			updateValue();

			// Keep an eye on changes
			$scope.$watch(function() {
				return ngModel.$modelValue;
			}, function(newVal) {
				updateValue(newVal);
			});

			// Watch for updates to value and set them on the model
			$scope.$watch('value', function(newVal, oldVal) {
				if (newVal === '' || typeof newVal === 'undefined' || !newVal) {
					$scope.clearValue();
				}
				if (newVal !== oldVal) {
					ngModel.$setViewValue(newVal);
				}
			});

			// The only other ngModel changes

			$scope.clearValue = function clearValue() {
				ngModel.$setViewValue('');
			};
			$scope.showColorPicker = function showColorPicker($event) {
				if (didJustClose) {
					return;
				}
				//	dateClick = Date.now();
				//	console.log( "CLICK OPEN", dateClick, $scope );

				MbColorPicker.show({
					value: $scope.value,
					defaultValue: $scope.default,
					random: $scope.random,
					clickOutsideToClose: $scope.clickOutsideToClose,
					hasBackdrop: $scope.hasBackdrop,
					skipHide: $scope.skipHide,
					preserveScope: $scope.preserveScope,

					mbColorAlphaChannel: $scope.mbColorAlphaChannel,
					mbColorSpectrum: $scope.mbColorSpectrum,
					mbColorSliders: $scope.mbColorSliders,
					mbColorGenericPalette: $scope.mbColorGenericPalette,
					mbColorMaterialPalette: $scope.mbColorMaterialPalette,
					mbColorHistory: $scope.mbColorHistory,
					mbColorHex: $scope.mbColorHex,
					mbColorRgb: $scope.mbColorRgb,
					mbColorHsl: $scope.mbColorHsl,
					mbColorDefaultTab: $scope.mbColorDefaultTab,

					$event: $event

				}).then(function(color) {
					$scope.value = color;
				});
			};
		},
		compile: function(element, attrs) {

			//attrs.value = attrs.value || "#ff0000";
			attrs.type = attrs.type !== undefined ? attrs.type : 0;

		}
	};
});





















