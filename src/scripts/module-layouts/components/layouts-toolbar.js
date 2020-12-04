mblowfish.addComponent(MB_LAYOUTS_TOOLBAR_COMPONENT, {
	templateUrl: 'scripts/module-layouts/components/layouts-toolbar.html',
	controllerAs: 'ctrl',
	controller: function($mbActions, $mbLayout) {
		'ngInject';

		this.saveAs = function($event) {
			return $mbActions.exec(MB_LAYOUTS_SAVE_CURRENT_ACTION, $event);
		};

		this.loadLayout = function($event, layout) {
			if (layout) {
				$event.values = [layouts];
			}
			return $mbActions.exec(MB_LAYOUTS_LOAD_ACTION, $event);
		};

		this.openMenu = function($mdMenu, $event) {
			this.layouts = $mbLayout.getLayouts();
			$mdMenu.open($event);
		};
	}
});