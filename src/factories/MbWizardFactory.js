import mblowfish from '../mblowfish';
import templateUrl from './MbWizardFactory.html';

/**
A regestred wizard

@ngInject
 */
function MbWizardFactory(MbContainer, $injector, $q) {

	var MbWizard = function(config) {
		var $wizard = this;
		config = _.assign({
			title: '',
			description: '',
			isWizard: true,
			pages: [],
			templateUrl: templateUrl,
			controllerAs: 'ctrl',
			controller: function($scope) {
				'ngInject';
				var ctrl = this;
				this.getPageCount = function() {
					return $wizard.pages.length;
				};

				this.backPage = function($event) {
					$wizard.flipToPreviousPage($event);
				};

				this.nextPage = function($event) {
					$wizard.flipNextPage($event);
				};

				this.cancelWizard = function($event) {
					$wizard.performCancel($event);
				};

				this.finishWizard = function($event) {
					$wizard.performFinish($event);
				};

				// bind
				$wizard.on('errorMessageChanged', function() {
					ctrl.errorMessage = $wizard.getErrorMessage();
					updateButtons();
				});

				$wizard.on('pageChanged', function() {
					updateConfigs();
					updateButtons();
				});

				$wizard.on('change', function() {
					updateButtons();
				});

				function updateButtons() {
					ctrl.nextDisabled = !$wizard.canFlipToNextPage();
					ctrl.backDisabled = !$wizard.canFlipToPreviousPage();
					ctrl.cancelDisabled = true;
					ctrl.finishDisabled = !$wizard.canFinish();
					ctrl.helpDisabled = !$wizard.isHelpAvailable();
				}

				function updateConfigs() {
					var page = $wizard.currentPage || {};
					ctrl.title = page.title || config.title;
					ctrl.description = page.description || config.description;
					ctrl.image = page.image || config.image;
				}
			},
		}, config);
		this.wizardPageIds = config.pages;
		// bind to class variable
		this.userOnChange = config.onChange;
		this.userPerformCancel = config.performCancel;
		this.userCanFinish = config.canFinish;
		this.userPerformFinish = config.performFinish;
		this.data = {};
		// remove user functions
		delete config.pages;
		delete config.onChange;
		delete config.canFinish;
		delete config.performCancel;
		delete config.performFinish;
		MbContainer.call(this, config);
		return this;
	};


	// Circle derives from Shape
	MbWizard.prototype = Object.create(MbContainer.prototype);

	MbWizard.prototype.setErrorMessage = function(message) {
		this.errorMessage = message;
		this.fire('errorMessageChanged', {
			value: message
		});
		return this;
	};

	MbWizard.prototype.getErrorMessage = function() {
		return this.errorMessage;
	};

	MbWizard.prototype.getNextPage = function() {
		return this.pages[this.calculateNextPageIndex()];
	};

	MbWizard.prototype.pageIdToIndex = function(id) {
		return this.wizardPageIds.indexOf(id);
	};

	MbWizard.prototype.calculateNextPageIndex = function() {
		if (this.currentPageIndex === -1) {
			return 0;
		}
		var index = this.currentPage.getNextPageIndex();
		if (index > -1) {
			return index;
		}
		if (this.currentPage.index < this.pages.length - 1) {
			return this.currentPage.index + 1;
		}
	}

	MbWizard.prototype.flipTo = function(nextPageIndex) {
		if (this.currentPage) {
			this.currentPage.destroy();
			delete this.currentPage;
		}
		this.currentPageIndex = nextPageIndex;
		this.currentPage = this.pages[nextPageIndex];
		var wizard = this;
		var element = mblowfish.element('<div></div>');
		this.$body.append(element);
		return this.currentPage.render(_.assign({}, this.$locals || {}, {
			$element: element,
			$wizard: this,
			$currentPage: this.currentPage,
			$currentPageIndex: nextPageIndex
		})).then(function() {
			wizard.fire('pageChanged');
		});
	};

	MbWizard.prototype.flipNextPage = function() {
		if (!this.canFlipToNextPage()) {
			return;
		}
		var nextPageIndex = this.calculateNextPageIndex();
		if (nextPageIndex < 0) {
			return;
		}
		if (this.currentPage) {
			this.pageStack.push(this.currentPage);
		}
		return this.flipTo(nextPageIndex);
	};

	MbWizard.prototype.canFlipToNextPage = function() {
		// >> this is first page
		if (this.currentPageIndex === -1 && this.pages.length > 0) {
			return true;
		}
		var nextPageIndex = this.currentPage.getNextPageIndex();
		return this.currentPage.isPageComplete() &&
			nextPageIndex > -1 &&
			nextPageIndex < this.pages.length;
	};

	MbWizard.prototype.flipToPreviousPage = function() {
		if (!this.canFlipToPreviousPage()) {
			return;
		}
		var page = this.pageStack.pop();
		var pageIndex = this.pages.indexOf(page);
		this.flipTo(pageIndex);
	};

	MbWizard.prototype.canFlipToPreviousPage = function() {
		if (this.currentPageIndex < 1) {
			return false;
		}
		return true;
	};

	MbWizard.prototype.performFinish = function($event) {
		var result;
		if (this.userPerformFinish) {
			result = this.invoke(this.userPerformFinish);
		}
		var wizard = this;
		$q.when(result)
			.then(function() {
				wizard.fire('finish', $event);
			});
	};

	MbWizard.prototype.canFinish = function() {
		var result = true;
		if (_.isFunction(this.userCanFinish)) {
			result = this.invoke(this.userCanFinish);
		}
		return result;
	};

	MbWizard.prototype.performCancel = function($event) {
		this.fire('cancel', $event);
		return this.destroy();
	};

	MbWizard.prototype.render = function(locals) {
		var wizard = this;
		this.pageStack = [];
		this.currentPage = undefined;
		this.currentPageIndex = -1;
		this.$locals = locals;
		return MbContainer.prototype.render.apply(this, [locals])
			.then(function(handler) {
				wizard.$body = handler.$element.find('#body');
				wizard.flipNextPage();
			});
	};

	MbWizard.prototype.destroy = function() {
		if (this.currentPage) {
			this.pageStack.push(this.currentPage);
		}
		_.forEach(this.pageStack, function(page) {
			page.destroy();
		});
		delete this.pageStack;
		delete this.currentPage;
		return MbContainer.prototype.destroy.apply(this);
	};

	/*
	Calls a user function
	*/
	MbWizard.prototype.invoke = function(userFunction, locals) {
		return $injector.invoke(userFunction, this, _.assign({}, locals || {}, this.$locals, {
			$wizard: this,
			$currentPage: this.currentPage,
			$currentPageIndex: this.currentPageIndex
		}));
	};


	MbWizard.prototype.getData = function(key) {
		return this.data[key];
	};

	MbWizard.prototype.isHelpAvailable = function() {
		return false;
	};

	MbWizard.prototype.setData = function(key, value) {
		this.data[key] = value;
		var $event = {
			value: value,
			key: key,
		};
		this.fire('change', $event);
		if (_.isFunction(this.userOnChange)) {
			this.invoke(this.userOnChange, {
				$event: $event
			});
		}
	};

	return MbWizard;
}

export default MbWizardFactory;