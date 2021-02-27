
import templateUrl from './MbColorPicker.html';
/**

@ngInject
 */
export default function($mbDialog, MbColorPickerHistory, MbColor) {
	var dialog;

	return {
		show: function(options) {
			if (options === undefined) {
				options = {};
			}
			//console.log( 'DIALOG OPTIONS', options );
			// Defaults
			// Dialog Properties
			options.hasBackdrop = options.hasBackdrop === undefined ? true : options.hasBackdrop;
			options.clickOutsideToClose = options.clickOutsideToClose === undefined ? true : options.clickOutsideToClose;
			options.defaultValue = options.defaultValue === undefined ? '#FFFFFF' : options.defaultValue;
			options.focusOnOpen = options.focusOnOpen === undefined ? false : options.focusOnOpen;
			options.preserveScope = options.preserveScope === undefined ? true : options.preserveScope;
			options.skipHide = options.skipHide === undefined ? true : options.skipHide;

			// mbColorPicker Properties
			options.mbColorAlphaChannel = options.mbColorAlphaChannel === undefined ? false : options.mbColorAlphaChannel;
			options.mbColorSpectrum = options.mbColorSpectrum === undefined ? true : options.mbColorSpectrum;
			options.mbColorSliders = options.mbColorSliders === undefined ? true : options.mbColorSliders;
			options.mbColorGenericPalette = options.mbColorGenericPalette === undefined ? true : options.mbColorGenericPalette;
			options.mbColorMaterialPalette = options.mbColorMaterialPalette === undefined ? true : options.mbColorMaterialPalette;
			options.mbColorHistory = options.mbColorHistory === undefined ? true : options.mbColorHistory;
			options.mbColorRgb = options.mbColorRgb === undefined ? true : options.mbColorRgb;
			options.mbColorHsl = options.mbColorHsl === undefined ? true : options.mbColorHsl;
			options.mbColorHex = ((options.mbColorHex === undefined) || (!options.mbColorRgb && !options.mbColorHsl)) ? true : options.mbColorHex;
			options.mbColorAlphaChannel = (!options.mbColorRgb && !options.mbColorHsl) ? false : options.mbColorAlphaChannel;

			dialog = $mbDialog.show({
				templateUrl: templateUrl,
				hasBackdrop: options.hasBackdrop,
				clickOutsideToClose: options.clickOutsideToClose,

				controller: ['$scope', 'options', function($scope, options) {
					//console.log( "DIALOG CONTROLLER OPEN", Date.now() - dateClick );
					$scope.close = function close() {
						$mdDialog.cancel();
					};
					$scope.ok = function ok() {
						$mdDialog.hide($scope.value);
					};
					$scope.hide = $scope.ok;



					$scope.value = options.value;
					$scope.default = options.defaultValue;
					$scope.random = options.random;

					$scope.mbColorAlphaChannel = options.mbColorAlphaChannel;
					$scope.mbColorSpectrum = options.mbColorSpectrum;
					$scope.mbColorSliders = options.mbColorSliders;
					$scope.mbColorGenericPalette = options.mbColorGenericPalette;
					$scope.mbColorMaterialPalette = options.mbColorMaterialPalette;
					$scope.mbColorHistory = options.mbColorHistory;
					$scope.mbColorHex = options.mbColorHex;
					$scope.mbColorRgb = options.mbColorRgb;
					$scope.mbColorHsl = options.mbColorHsl;
					$scope.mbColorDefaultTab = options.mbColorDefaultTab;

				}],

				locals: {
					options: options
				},
				preserveScope: options.preserveScope,
				skipHide: options.skipHide,

				targetEvent: options.$event,
				focusOnOpen: options.focusOnOpen,
				autoWrap: false,
				onShowing: function() {
					//		console.log( "DIALOG OPEN START", Date.now() - dateClick );
				},
				onComplete: function() {
					//		console.log( "DIALOG OPEN COMPLETE", Date.now() - dateClick );
				}
			});

			dialog.then(function(value) {
				MbColorPickerHistory.add(new MbColor(value));
			}, function() { });

			return dialog;
		},
		hide: function() {
			return dialog.hide();
		},
		cancel: function() {
			return dialog.cancel();
		}
	};
}

