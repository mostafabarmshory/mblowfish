
/**
A regestred wizard


 */
mblowfish.factory('MbWizard', function(MbContainer) {

	var MbWizard = function(config) {
		config = _.assign({
			title: '',
			description: '',
			pages: [],
		}, config, {
				templateUrl: 'scripts/factories/wizard.html',
				isWizard: true,
				pages: []
			});

		MbContainer.call(this, config);
		return this;
	};


	// Circle derives from Shape
	MbWizard.prototype = Object.create(MbContainer.prototype);

	MbWizard.prototype.setErrorMessage = function() { };
	MbWizard.prototype.getErrorMessage = function() { };

	MbWizard.prototype.getNextPage = function() { };
	MbWizard.prototype.flipNextPage = function() { };
	MbWizard.prototype.canFlipToNextPage = function() { };


	MbWizard.prototype.performFinish = function() { };
	MbWizard.prototype.performCancel = function() { };
	MbWizard.prototype.canFinish = function() { };

	return MbWizard;
});