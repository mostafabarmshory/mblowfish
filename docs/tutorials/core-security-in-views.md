# Use Security Expression in UI

Every time you need to check if user has a role, then an action be available. In these
cases you must get current account and check here roles. In this tutorial I will show
you how to use security expression in UI.


## Challenge

We want to add an action and add it into the application toolbar. Then the action is 
ready to use if the current accoutn has role tenant.owner.


## Crate new Action

We simple add an action:

	mblowfish.addAction('test.alert', {
		action: function(){
			alert('hi');
		}
	});

## Create View

Then we create a view:

	mblowfish.addView('/demo/security-test/security-expression-in-view', {
		template:'<div><button ng-click="ctrl.callAction($event)">Call Action</button></div>',
		controllerAs: 'ctrl',
		controller: function($mbActions){
			'ngInject';
			this.callAction= function($event){
				$mbActions.exec('test.alert', $event);
			};
		}
	});
	
## Adding Security Expression

Adding expression to the button:


	...
	template:'<div><button ng-enable="hasRole(\'tenant.owner\')" ng-click="ctrl.callAction($event)">Call Action</button></div>',
	...
	

