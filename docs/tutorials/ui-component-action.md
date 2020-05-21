# Create a UI action with a component

With $mbActions you can add a new action the the core system and call it with a command ID. However,
adding an action directly to a toolbar, view, editor or menu is very critical. UI component is a sub
class of Action, so you can add it directly into the $mbAction.

In this tutorial you will learn how to add a component UI to $mbAction and call it by command ID.

Required steps are:

- crate a component
- register component with toolbar
- call component action with command

## Challenge

We want to add an action and add it into the application toolbar. Then we want to call it with its
command ID directly.

The command id is:

	do-allert

## Crate new UI component


	component = new MBComponent({
		id: 'do-alert',
		title: 'Alert',
		description: 'A simple alert dialgo',
		icon: 'bell',
		/* @ngInject */
		action: function($window){
			$window.alert('Hi, this is a simple alert');
		}
	});

## Register the component

	$mbActions.add(component.id, component);


## Call the action

	$mbActions.exec('do-alert');

## Put it together

	module.run(function($mbActions, MBComponent){
		component = new MBComponent({
			id: 'do-alert',
			title: 'Alert',
			description: 'A simple alert dialgo',
			icon: 'bell',
			/* @ngInject */
			action: function($window){
				$window.alert('Hi, this is a simple alert');
			}
		});
		$mbActions.add(component.id, component);
	});