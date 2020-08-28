mblowfish.addComponent(MB_LAYOUTS_TOOLBAR_COMPONENT, {
	templateUrl: 'scripts/module-layouts/components/layouts-toolbar.html',
	controllerAs: 'ctrl',
	/* @ngInject */
	controller: function($mbActions){
		this.saveAs = function($event){
			$mbActions.exec(MB_LAYOUTS_SAVE_CURRENT_ACTION, $event);
		}
		this.loadLayout = function($event){
			$mbActions.exec(MB_LAYOUTS_LOAD_ACTION, $event);
		}
	}
});