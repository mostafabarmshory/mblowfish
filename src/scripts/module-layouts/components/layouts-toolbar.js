mblowfish.addComponent(MB_LAYOUTS_TOOLBAR_COMPONENT, {
	templateUrl: 'views/layouts/components/controller-toolbar.html',
	icon: 'dashboard',
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