
/*
 *  Runtime configurations: some part of system can be updated at the runtime. 
 * This help moldules to update the application and contributes new functionality.
 */
angular.module('app').run(function($mbView, MbAction, $mbToolbar) {
	//
	//  $mbView: manages all views of an application. you can add a new view 
	// dynamically.
	//
	$mbView.add('/demo', {
		title: 'Demo&Tutorials',
		description: 'Demo explorer.',
		icon: 'wb_sunny',
		templateUrl: 'views/index.html',
		groups: ['Tutorials&Demo']
	}).add('/demo/core', {
		title: 'Core Features',
		anchor: 'editors',
		templateUrl: 'views/core/index.html',
		groups: ['Tutorials&Demo']
	}).add('/demo/ui', {
		title: 'UI',
		icon: 'layers_clear',
		anchor: 'editors',
		templateUrl: 'views/ui/index.html',
		groups: ['Tutorials&Demo']
	}).add('/demo/components', {
		title: 'Components',
		icon: 'hotel',
		anchor: 'editors',
		templateUrl: 'views/components/index.html',
		groups: ['Tutorials&Demo']
	});

	// Create and add action automatically
	var action = new MbAction({
		title: 'Auto action',
		icon: 'save',
		/* @ngInject */
		action: function($window) {
			$window.alert('Autoloaded action is called');
		}
	});
	var toolbar = $mbToolbar.getToolbar('/app/demo');
	toolbar.addAction(action);
});

