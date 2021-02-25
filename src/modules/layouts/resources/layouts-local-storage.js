mblowfish.addResource('mb-layouts-local-storage', {
	title: 'Stored Layouts',
	templateUrl: 'scripts/module-layouts/resources/layouts-local-storage.html',
	tags: [MB_LAYOUTS_LAYOUTS_SP],
	controllerAs: 'ctrl',
	controller: function($resource, $mbLayoutsLocalStorage) {
		'ngInject';
		var ctrl = this;
		var selected;

		function setSelected(layoutName) {
			selected = layoutName;
			$resource.setValue([layoutName]);
		}

		function isSelected(layoutName) {
			return selected === layoutName;
		}

		function deleteLayout(layoutName) {
			$mbLayoutsLocalStorage.deleteLayout(layoutName);
			ctrl.layouts = $mbLayoutsLocalStorage.getLayouts();
		}

		_.assign(ctrl, {
			layouts: $mbLayoutsLocalStorage.getLayouts(),
			setSelected: setSelected,
			isSelected: isSelected,
			deleteLayout: deleteLayout,
		});
	}
});
