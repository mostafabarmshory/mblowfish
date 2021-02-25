mblowfish.provider('$mbColorPalette', function() {
	return {
		$get: function($mdColorPalette) {
			return $mdColorPalette;
		}
	};
});
