
import templateUrl from './mbColorPickerContainer.html';

/**

@ngInject
 */
export default function($timeout, $mbColorPalette, MbColorPickerHistory, MbColor) {
	return {
		templateUrl: templateUrl,
		scope: {
			value: '=?',
			default: '@',
			random: '@',
			ok: '=?',
			mbColorAlphaChannel: '=',
			mbColorSpectrum: '=',
			mbColorSliders: '=',
			mbColorGenericPalette: '=',
			mbColorMaterialPalette: '=',
			mbColorHistory: '=',
			mbColorHex: '=',
			mbColorRgb: '=',
			mbColorHsl: '=',
			mbColorDefaultTab: '='
		},
		controller: function($scope, $element/*, $attrs*/) {
			//	console.log( "mbColorPickerContainer Controller", Date.now() - dateClick, $scope );

			function getTabIndex(tab) {
				var index = 0;
				if (tab && typeof (tab) === 'string') {
					/* DOM isn't fast enough for this

					var tabs = $element[0].querySelector('.mb-color-picker-colors').getElementsByTagName( 'md-tab' );
					console.log( tabs.length );
					 */
					var tabName = 'mbColor' + tab.slice(0, 1).toUpperCase() + tab.slice(1);
					var tabs = ['mbColorSpectrum', 'mbColorSliders', 'mbColorGenericPalette', 'mbColorMaterialPalette', 'mbColorHistory'];
					for (var x = 0; x < tabs.length; x++) {
						//console.log(  tabs[x]('ng-if') );
						//if ( tabs[x].getAttribute('ng-if') == tabName ) {
						if (tabs[x] === tabName) {
							if ($scope[tabName]) {
								index = x;
								break;
							}
						}
					}
				} else if (tab && typeof (tab) === 'number') {
					index = tab;
				}

				return index;
			}

			///////////////////////////////////
			// Variables
			///////////////////////////////////
			//				var container = angular.element( $element[0].querySelector('.mb-color-picker-container') );
			//				var resultSpan = angular.element( container[0].querySelector('.mb-color-picker-result') );
			var previewInput = angular.element($element[0].querySelector('.mb-color-picker-preview-input'));

			var outputFn = [
				'toHexString',
				'toRgbString',
				'toHslString'
			];



			$scope.default = $scope.default ? $scope.default : $scope.random ? MbColor.random() : 'rgb(255,255,255)';
			if ($scope.value.search('#') >= 0) {
				$scope.type = 0;
			} else if ($scope.value.search('rgb') >= 0) {
				$scope.type = 1;
			} else if ($scope.value.search('hsl') >= 0) {
				$scope.type = 2;
			}
			$scope.color = new MbColor($scope.value || $scope.default); // Set initial color
			$scope.alpha = $scope.color.getAlpha();
			$scope.history = MbColorPickerHistory;
			$scope.materialFamily = [];

			$scope.whichPane = getTabIndex($scope.mbColorDefaultTab);
			$scope.inputFocus = false;

			// Colors for the palette screen
			///////////////////////////////////
			//				var steps = 9;
			//				var freq = 2 * Math.PI/steps;

			$scope.palette = [
				['rgb(255, 204, 204)', 'rgb(255, 230, 204)', 'rgb(255, 255, 204)', 'rgb(204, 255, 204)', 'rgb(204, 255, 230)', 'rgb(204, 255, 255)', 'rgb(204, 230, 255)', 'rgb(204, 204, 255)', 'rgb(230, 204, 255)', 'rgb(255, 204, 255)'],
				['rgb(255, 153, 153)', 'rgb(255, 204, 153)', 'rgb(255, 255, 153)', 'rgb(153, 255, 153)', 'rgb(153, 255, 204)', 'rgb(153, 255, 255)', 'rgb(153, 204, 255)', 'rgb(153, 153, 255)', 'rgb(204, 153, 255)', 'rgb(255, 153, 255)'],
				['rgb(255, 102, 102)', 'rgb(255, 179, 102)', 'rgb(255, 255, 102)', 'rgb(102, 255, 102)', 'rgb(102, 255, 179)', 'rgb(102, 255, 255)', 'rgb(102, 179, 255)', 'rgb(102, 102, 255)', 'rgb(179, 102, 255)', 'rgb(255, 102, 255)'],
				['rgb(255, 51, 51)', 'rgb(255, 153, 51)', 'rgb(255, 255, 51)', 'rgb(51, 255, 51)', 'rgb(51, 255, 153)', 'rgb(51, 255, 255)', 'rgb(51, 153, 255)', 'rgb(51, 51, 255)', 'rgb(153, 51, 255)', 'rgb(255, 51, 255)'],
				['rgb(255, 0, 0)', 'rgb(255, 128, 0)', 'rgb(255, 255, 0)', 'rgb(0, 255, 0)', 'rgb(0, 255, 128)', 'rgb(0, 255, 255)', 'rgb(0, 128, 255)', 'rgb(0, 0, 255)', 'rgb(128, 0, 255)', 'rgb(255, 0, 255)'],
				['rgb(245, 0, 0)', 'rgb(245, 123, 0)', 'rgb(245, 245, 0)', 'rgb(0, 245, 0)', 'rgb(0, 245, 123)', 'rgb(0, 245, 245)', 'rgb(0, 123, 245)', 'rgb(0, 0, 245)', 'rgb(123, 0, 245)', 'rgb(245, 0, 245)'],
				['rgb(214, 0, 0)', 'rgb(214, 108, 0)', 'rgb(214, 214, 0)', 'rgb(0, 214, 0)', 'rgb(0, 214, 108)', 'rgb(0, 214, 214)', 'rgb(0, 108, 214)', 'rgb(0, 0, 214)', 'rgb(108, 0, 214)', 'rgb(214, 0, 214)'],
				['rgb(163, 0, 0)', 'rgb(163, 82, 0)', 'rgb(163, 163, 0)', 'rgb(0, 163, 0)', 'rgb(0, 163, 82)', 'rgb(0, 163, 163)', 'rgb(0, 82, 163)', 'rgb(0, 0, 163)', 'rgb(82, 0, 163)', 'rgb(163, 0, 163)'],
				['rgb(92, 0, 0)', 'rgb(92, 46, 0)', 'rgb(92, 92, 0)', 'rgb(0, 92, 0)', 'rgb(0, 92, 46)', 'rgb(0, 92, 92)', 'rgb(0, 46, 92)', 'rgb(0, 0, 92)', 'rgb(46, 0, 92)', 'rgb(92, 0, 92)'],
				['rgb(255, 255, 255)', 'rgb(205, 205, 205)', 'rgb(178, 178, 178)', 'rgb(153, 153, 153)', 'rgb(127, 127, 127)', 'rgb(102, 102, 102)', 'rgb(76, 76, 76)', 'rgb(51, 51, 51)', 'rgb(25, 25, 25)', 'rgb(0, 0, 0)']
			];

			$scope.materialPalette = $mbColorPalette;

			///////////////////////////////////
			// Functions
			///////////////////////////////////
			$scope.isDark = function isDark(color) {
				if (angular.isArray(color)) {
					return new MbColor({ r: color[0], g: color[1], b: color[2] }).isDark();
				} else {
					return new MbColor(color).isDark();
				}

			};
			$scope.previewFocus = function() {
				$scope.inputFocus = true;
				$timeout(function() {
					previewInput[0].setSelectionRange(0, previewInput[0].value.length);
				});
			};
			$scope.previewUnfocus = function() {
				$scope.inputFocus = false;
				previewInput[0].blur();
			};

			$scope.previewBlur = function() {
				$scope.inputFocus = false;
				$scope.setValue();
			};

			$scope.previewKeyDown = function($event) {
				if ($event.keyCode === 13 && angular.isFunction($scope.ok)) {
					$scope.ok();
				}
			};

			$scope.setPaletteColor = function(event) {
				$timeout(function() {
					$scope.color = new MbColor(event.target.style.backgroundColor);
				});
			};

			$scope.setValue = function setValue() {
				// Set the value if available
				if ($scope.color && $scope.color && outputFn[$scope.type] && $scope.color.toRgbString() !== 'rgba(0, 0, 0, 0)') {
					$scope.value = $scope.color[outputFn[$scope.type]]();
				}
			};

			$scope.changeValue = function changeValue() {
				$scope.color = new MbColor($scope.value);
				$scope.$broadcast('mbColorPicker:colorSet', { color: $scope.color });
			};


			///////////////////////////////////
			// Watches and Events
			///////////////////////////////////
			$scope.$watch('color._a', function(newValue) {
				$scope.color.setAlpha(newValue);
			}, true);

			$scope.$watch('whichPane', function( /*newValue*/) {
				// 0 - spectrum selector
				// 1 - sliders
				// 2 - palette
				$scope.$broadcast('mbColorPicker:colorSet', { color: $scope.color });

			});

			$scope.$watch('type', function() {
				previewInput.removeClass('switch');
				$timeout(function() {
					previewInput.addClass('switch');
				});
			});

			$scope.$watchGroup(['color.toRgbString()', 'type'], function( /*newValue*/) {
				if (!$scope.inputFocus) {
					$scope.setValue();
				}
			});


			///////////////////////////////////
			// INIT
			// Let all the other directives initialize
			///////////////////////////////////
			//	console.log( 'mbColorPickerContainer Controller PRE Timeout', Date.now() - dateClick );
			$timeout(function() {
				//		console.log( 'mbColorPickerContainer Controller Timeout', Date.now() - dateClick );
				$scope.$broadcast('mbColorPicker:colorSet', { color: $scope.color });
				previewInput.focus();
				$scope.previewFocus();
			});
		},
		link: function(scope, element/*, attrs*/) {

			//				var tabs = element[0].getElementsByTagName( 'md-tab' );
			/*
			Replicating these structure without ng-repeats

			<div ng-repeat='row in palette track by $index' flex='15'  layout-align='space-between' layout='row'  layout-fill>
				<div ng-repeat='col in row track by $index' flex='10' style='height: 25.5px;' ng-style='{'background': col};' ng-click='setPaletteColor($event)'></div>
			</div>

			<div ng-repeat='(key, value) in materialColors'>
				<div ng-style='{'background': 'rgb('+value['500'].value[0]+','+value['500'].value[1]+','+value['500'].value[2]+')', height: '75px'}' class='mb-color-picker-material-title' ng-class='{'dark': isDark( value['500'].value )}' ng-click="setPaletteColor($event)">
					<span>{{key}}</span>
				</div>
				<div ng-repeat="(label, color) in value track by $index" ng-style="{'background': 'rgb('+color.value[0]+','+color.value[1]+','+color.value[2]+')', height: '33px'}" class="mb-color-picker-with-label" ng-class="{'dark': isDark( color.value )}" ng-click="setPaletteColor($event)">
					<span>{{label}}</span>
				</div>
			</div>
			 */


			function createDOM() {
				var paletteContainer = angular.element(element[0].querySelector('.mb-color-picker-palette'));
				var materialContainer = angular.element(element[0].querySelector('.mb-color-picker-material-palette'));
				var paletteRow = angular.element('<div class="flex-15 layout-fill layout-row layout-align-space-between" layout-align="space-between" layout="row" layout-fill"></div>');
				var paletteCell = angular.element('<div class="flex-10"></div>');

				var materialTitle = angular.element('<div class="mb-color-picker-material-title"></div>');
				var materialRow = angular.element('<div class="mb-color-picker-with-label"></div>');



				angular.forEach(scope.palette, function(value/*, key*/) {
					var row = paletteRow.clone();
					angular.forEach(value, function(color) {
						var cell = paletteCell.clone();
						cell.css({
							height: '25.5px',
							backgroundColor: color
						});
						cell.bind('click', scope.setPaletteColor);
						row.append(cell);
					});

					paletteContainer.append(row);
				});

				angular.forEach(scope.materialPalette, function(value, key) {
					var title = materialTitle.clone();
					title.html('<span>' + key.replace('-', ' ') + '</span>');
					title.css({
						height: '75px',
						backgroundColor: 'rgb(' + value['500'].value[0] + ',' + value['500'].value[1] + ',' + value['500'].value[2] + ')'
					});
					if (scope.isDark(value['500'].value)) {
						title.addClass('dark');
					}

					materialContainer.append(title);

					angular.forEach(value, function(color, label) {

						var row = materialRow.clone();
						row.css({
							height: '33px',
							backgroundColor: 'rgb(' + color.value[0] + ',' + color.value[1] + ',' + color.value[2] + ')'
						});
						if (scope.isDark(color.value)) {
							row.addClass('dark');
						}

						row.html('<span>' + label + '</span>');
						row.bind('click', scope.setPaletteColor);
						materialContainer.append(row);
					});


				});
			}



			$timeout(function() {
				createDOM();
			});
		}
	};
}
