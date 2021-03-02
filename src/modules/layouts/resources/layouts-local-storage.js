import templateUrl from './layouts-local-storage.html';

import Constants from '../Constants';

export default {
	title: 'Stored Layouts',
	templateUrl: templateUrl,
	tags: [Constants.MB_LAYOUTS_LAYOUTS_SP],
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
}
