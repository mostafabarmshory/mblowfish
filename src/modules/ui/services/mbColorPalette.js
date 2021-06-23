

function mbColorPalette() {
	return {
		$get: function($mdColorPalette) {
			"ngInject";
			return $mdColorPalette;
		}
	};
}

export default mbColorPalette;