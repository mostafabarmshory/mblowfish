mblowfish.factory('MbWizardPage', function(MbComponent) {


	var MbWizard = function(config) {
		config = _.assign({
			title: '',
			description: '',
			isWizardPage: true,
		}, config);

		MbComponent.call(this, config);
		return this;
	};


	// Circle derives from Shape
	MbWizard.prototype = Object.create(MbComponent.prototype);
	return MbWizard;
});