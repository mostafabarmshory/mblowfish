# Call an action with id

Action help to develop system functionalities as a indivisual section. For example you can 
implement a function to logout current user and clean sessions or an action to login and
create a new user session.

In this tutorial we will add an action to alert a message and call it with its command id.

## Define and register an action

To define an action

	action = {
		/* @ngInject */
		action: function($event, $window){
			$window.alert($event.message);
		}
	};

To register

	$mbActionsProvider.add('alert', action);

You may register an action as follow:

	$mbActionsProvider.add('alert', {
		/* @ngInject */
		action: function($event, $window){
			$window.alert($event.message);
		}
	});

You may use $mbAction service in run time to add an action dynamically, but you must 
wait for whole application to be loaded and then call actions. It is used in modules
to defines new actions.


	$mbActions.add('alert', {
		/* @ngInject */
		action: function($event, $window){
			$window.alert($event.message);
		}
	});


## Call action by ID

	$mbActions.exec('alert', {
		message: 'Hellow Action'
	});

