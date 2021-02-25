

/**

@ngInject
 */
function lmGoldenlayout(/*$mbTheming*/) {
	return {
		restrict: 'C',
		link: function($scope, $element) {
//			$mbTheming($element);
		}
	};
}

export default lmGoldenlayout;