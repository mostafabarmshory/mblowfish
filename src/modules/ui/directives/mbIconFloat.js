
/**

@ngInject
 */
export default function($mdTheming) {

	var INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT',
		'MD-SELECT'];

	var LEFT_SELECTORS = INPUT_TAGS.reduce(
		function(selectors, isel) {
			return selectors.concat(['mb-icon ~ ' + isel, '.mb-icon ~ ' + isel]);
		}, []).join(',');

	var RIGHT_SELECTORS = INPUT_TAGS.reduce(
		function(selectors, isel) {
			return selectors.concat([isel + ' ~ mb-icon', isel + ' ~ .mb-icon']);
		}, []).join(',');

	function compile(tElement) {
		// Check for both a left & right icon
		var leftIcon = tElement[0]
			.querySelector(LEFT_SELECTORS);
		var rightIcon = tElement[0]
			.querySelector(RIGHT_SELECTORS);

		if (leftIcon) {
			tElement.addClass('mb-icon-left');
		}
		if (rightIcon) {
			tElement.addClass('mb-icon-right');
		}

		return function postLink(scope, element) {
			$mdTheming(element);
		};
	}

	return {
		restrict: 'C',
		compile: compile
	};
}
