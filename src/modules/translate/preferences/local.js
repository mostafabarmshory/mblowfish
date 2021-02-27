
import templateUrl from './local.html';

export default {
	title: 'local',
	icon: 'language',
	templateUrl: templateUrl,
	/* @ngInject */
	controller: function($scope, $mbSettings) {
		var names = [
			SETTING_LOCAL_LANGUAGE,
			SETTING_LOCAL_DATEFORMAT,
			SETTING_LOCAL_DATETIMEFORMAT,
			SETTING_LOCAL_CURRENCY,
			SETTING_LOCAL_DIRECTION,
			SETTING_LOCAL_CALENDAR,
			SETTING_LOCAL_TIMEZONE,
		];
		var ctrl = this;
		$scope.config = {};

		function load() {
			_.forEach(names, function(name) {
				$scope.config[name] = $mbSettings.get(name);
			});
		}

		function save() {
			_.forEach(names, function(name) {
				$mbSettings.set(name, $scope.config[name]);
			});
		}

		_.assign(ctrl, {
			load: load,
			save: save,
		});


		load();
	},
	controllerAs: 'ctrl'
}