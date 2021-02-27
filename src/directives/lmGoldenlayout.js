

/**

@ngInject
 */
export default function($mbTheming) {
	return {
		restrict: 'C',
		link: function($scope, $element) {
			$mbTheming($element);
		}
	};
}

