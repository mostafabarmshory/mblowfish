import templateUrl from './holidayCarPage.html';

export default {
	title: 'Car',
	description: 'Which car are you intrested to use.',
	templateUrl: templateUrl,
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
}

