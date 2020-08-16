mblowfish.factory('MbWizardPage', function(MbComponent, $injector) {


	var MbWizardPage = function(config) {
		config = _.assign({
			title: '',
			description: '',
			isWizardPage: true,
		}, config);

		this.userNextPage = config.nextPage;
		this.userIsPageComplete = config.isPageComplete;

		delete config.nextPage;
		delete config.isPageComplete;
		MbComponent.call(this, config);
		return this;
	};


	// Circle derives from Shape
	MbWizardPage.prototype = Object.create(MbComponent.prototype);

	MbWizardPage.prototype.getNextPage = function() { };
	MbWizardPage.prototype.getNextPageIndex = function() {
		if (this.userNextPage) {
			if (_.isFunction(this.userNextPage)) {
				return this.$wizard.pageIdToIndex(this.invoke(this.userNextPage));
			}
			return this.$wizard.pageIdToIndex(this.userNextPage);
		}
		return this.index + 1;
	};

	MbWizardPage.prototype.isPageComplete = function() {
		if (this.userIsPageComplete) {
			return this.invoke(this.userIsPageComplete);
		}
		return true;
	};

	/*
	Calls a user function
	*/
	MbWizardPage.prototype.invoke = function(userFunction, locals) {
		return $injector.invoke(userFunction, this, _.assign(locals || {}, {
			$wizard: this.$wizard,
			$currentPage: this,
			$currentPageIndex: this.index
		}));
	};

	return MbWizardPage;
});