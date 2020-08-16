mblowfish.wizardPage('holidaySchedulePage', {
	title: 'Schedule',
	description: 'When your holiday start and end',
	templateUrl: 'scripts/wizards/holidaySchedulePage.html',
	controllerAs: 'ctrl',
	controller: function($wizard) {
		'ngInject';

		function createSetterGetter(key) {
			return function(date) {
				if (_.isUndefined(date)) {
					return $wizard.getData(key);
				}
				$wizard.setData(key, date);
			}
		}

		this.travelDate = createSetterGetter('travelDate');
		this.returnDate = createSetterGetter('returnDate');
	},
	isPageComplete: function($wizard) {
		'ngInject';
		return $wizard.data.travelDate && $wizard.data.returnDate;
	}
});