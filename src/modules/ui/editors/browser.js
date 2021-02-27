

//
//  $mbEditor: manages all editor of an application. An editor has a dynamic
// address and there may be multiple instance of it at the same time but with
// different parameter.
//
// There are serveral editor registered here to cover some of our system 
// functionalities such as:
//
// - Open a new URL
//
export default {
	title: 'Browser',
	description: 'Open external page',
	controllerAs: 'ctrl',
	template: '<iframe class="mb-module-iframe" ng-src="{{ctrl.currentContenttUrl}}"></iframe>',
	groups: ['Utilities'],
	controllerAs: 'ctrl',
	controller: function($sce, $state) {
		'ngInject';
		// Load secure path
		this.currentContenttUrl = $sce.trustAsResourceUrl($state.params.url);
	}
}

