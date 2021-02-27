import templateUrl from './holidayTrainPage.html';

export default  {
	title: 'Train',
	description: 'Which train are intrested to use',
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

		this.trainClass = createSetterGetter('trainClass');
	},
	nextPage: 'holidayFinalPage'
}