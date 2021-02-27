import templateUrl from './holidayLocationPage.html';

export default  {
	title: 'Location',
	description: 'Where do you want to go?',
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

		this.from = createSetterGetter('from');
		this.to = createSetterGetter('to');
	},
	nextPage: 'holidayTypePage'
}