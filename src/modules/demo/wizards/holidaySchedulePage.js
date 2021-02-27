import templateUrl from './holidaySchedulePage.html';

export default  {
	title: 'Schedule',
	description: 'When your holiday start and end',
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

		this.travelDate = createSetterGetter('travelDate');
		this.returnDate = createSetterGetter('returnDate');
	},
	isPageComplete: function($wizard) {
		'ngInject';
		return $wizard.data.travelDate && $wizard.data.returnDate;
	}
}