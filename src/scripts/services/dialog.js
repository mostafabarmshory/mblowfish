/**
@ngdoc Services
@name $mbDialog
@description Manage dialogs

 */
mblowfish.provider('$mbDialog', function() {

	//--------------------------------------------------------
	// Services
	//--------------------------------------------------------
	var provider;
	//	var service;


	//--------------------------------------------------------
	// varialbes
	//--------------------------------------------------------


	//--------------------------------------------------------
	// Functions
	//--------------------------------------------------------


	//--------------------------------------------------------
	// End
	//--------------------------------------------------------
	provider = {
		$get: function($mdDialog) {
			'ngInject';
			return $mdDialog;
		}
	}
	return provider;
});
