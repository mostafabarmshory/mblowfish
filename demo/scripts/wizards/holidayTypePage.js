mblowfish.wizardPage('holidayTypePage', {
	title: 'Vihicle',
	description: 'How do you want to go and return from holiday?',
	templateUrl: 'scripts/wizards/holidayTypePage.html',
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

		this.type = createSetterGetter('type');
		if (_.isUndefined($wizard.data.type)) {
			$wizard.setData('type', 'plane');
		}
	},

	nextPage: function($wizard) {
		'ngInject';
		switch ($wizard.data.type) {
			case 'plane':
				return 'holidayPlanePage';
			case 'train':
				return 'holidayTrainPage';
			case 'car':
				return 'holidayCarPage';
		}
	}
});