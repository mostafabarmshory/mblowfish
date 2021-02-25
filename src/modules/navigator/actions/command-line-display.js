
mblowfish.action(MB_NAVIGATOR_CMDLINE_TOGGLE_ACTION, {
	icon: 'call_to_action',
	group: 'Navigator',
	title: 'Open Command Line',
	description: 'Open command line to run an action',
	hotkey: 'F2',
	demon: true,
	action: function($mdBottomSheet, $event, $mbActions) {
		'ngInject';

		$mdBottomSheet.show({
			templateUrl: 'scripts/module-navigator/actions/command-line-display.html',
			clickOutsideToClose: true,
			/* @ngInject */
			controller: function($scope, $mdBottomSheet) {
				var actions = $mbActions.getActions()
				$scope.actions = actions;

				/*
				 * Create filter function for a query string
				 */
				function createFilterFor(query) {
					var lowercaseQuery = query.toLowerCase();
					return function filterFn(action) {
						return action.title && action.title.toLowerCase().indexOf(lowercaseQuery) >= 0;
					};
				}

				$scope.search = function(query) {
					$scope.actions = query ? _.filter(actions, createFilterFor(query)) : actions;
				};

				$scope.runAction = function(action) {
					$mdBottomSheet.hide($mbActions.exec(action));
				};
			}
		});
		$event.preventDefault();
		$event.stopPropagation();
	}
});