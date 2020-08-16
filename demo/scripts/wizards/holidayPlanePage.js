mblowfish.wizardPage('holidayPlanePage', {
	title: 'Plane your holiday',
	description: 'Give us details of your holiday.',
	templateUrl: 'scripts/wizards/holidayPlanePage.html',
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

		this.planeClass = createSetterGetter('planeClass');
		this.planeAgency = createSetterGetter('planeAgency');
	},
	nextPage: 'holidayFinalPage'
});