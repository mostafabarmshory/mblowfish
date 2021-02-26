/**

@ngInject
 */
export default  function() {
	return {
		restrict: 'E',
		scope: false,
		require: 'ngModel',
		link: function(scope, element, attr, ngModel) {
			function render() {
				if (!ngModel.$modelValue) {
					return;
				}
				var mbFile = ngModel.$modelValue;
				var src = URL.createObjectURL(mbFile);
				switch (mbFile.media) {
					case 'image': {
						element.replaceWith(
							'<img src="' + src + '" />'
						);
						break;
					}
					case 'video': {
						element.replaceWith(
							'<video controls>' +
							'<source src="' + src + '"">' +
							'</video>'
						);
						break;
					}
					case 'audio': {
						element.replaceWith(
							'<audio controls>' +
							'<source src="' + src + '"">' +
							'</audio>'
						);
						break;
					}
					default: {
						var fileType = mbFile.type || 'unknown/unknown';
						var unKnowClass = attr.mbUnknowClass || 'mb-file-unknow';
						element.replaceWith(
							'<object type="' + fileType + '" data="' + src + '">' +
							'<div class="mb-file-input-preview-default">' +
							'<md-icon class="mb-file-input-preview-icon ' + unKnowClass + '"></md-icon>' +
							'</div>' +
							'</object>'
						);
					}
				}
			}
			ngModel.$render = render;
		}
	};
}



