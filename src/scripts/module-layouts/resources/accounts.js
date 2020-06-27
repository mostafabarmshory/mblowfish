mblowfish.addResource('mb-layouts-local-storage', {
	title: 'Stored Layouts',
	templateUrl: 'views/layouts/resources/layouts.html',
	tags: [MB_LAYOUTS_LAYOUTS_SP],
	controllerAs: 'ctrl',
	/* @ngInject */
	controller: function($scope, $resource, $mbLayoutsLocalStorage, $style) {
		var ctrl = this;
		var selected;

		function setSelected(layoutName) {
			selected = layoutName;
			$resource.setValue([layoutName]);
		}

		function isSelected(layoutName) {
			return selected === layoutName;
		}

		_.assign(ctrl, {
			layouts: $mbLayoutsLocalStorage.getLayouts(),
			setSelected: setSelected,
			isSelected: isSelected,
		});
	}
});
