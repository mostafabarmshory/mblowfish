import templateUrl from './layouts-toolbar.html';

export default {
	templateUrl: templateUrl,
	controllerAs: 'ctrl',
	controller: function($mbActions, $mbLayout) {
		'ngInject';
		this.layouts = $mbLayout.getLayouts();

		this.saveAs = function($event) {
			return $mbActions.exec(MB_LAYOUTS_SAVE_CURRENT_ACTION, $event);
		};

		this.loadLayout = function($event, layout) {
			if (layout) {
				$event.values = [layout];
			}
			return $mbActions.exec(MB_LAYOUTS_LOAD_ACTION, $event);
		};

		this.openMenu = function($mdMenu, $event) {
			this.layouts = $mbLayout.getLayouts();
			$mdMenu.open($event);
		};
	}
}