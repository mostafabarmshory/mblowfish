mblowfish.wizardPage('holidayCarPage', {
	title: 'Car',
	description: 'Which car are you intrested to use.',
	templateUrl: 'scripts/wizards/holidayCarPage.html',
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

		this.carModel = createSetterGetter('carModel');
	},
	nextPage: 'holidayFinalPage'
});